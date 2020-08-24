import { mount } from "@vue/test-utils";
import Vuex from "vuex";
import localVue from "../localVue";
import store from "../mockStore";
import testReferees from "../../data/referee.json";

import TournamentForm from "@/components/TournamentForm";
import Tournament from "@/store/models/Tournament";

const actionWithCallback = (store, { onSuccess }) => onSuccess();

describe("TournamentDetailRow", () => {
  let tournament, referees = [], stubs = { transition: false };
  
  beforeEach(() => {
    referees = testReferees.map(
      ({ id }, n) => {
        return { id: id, games: n, tenSeconds: n };
      }
    )
    tournament = new Tournament(
      {
        id: "bogus-tournament",
        name: "Bogus",
        city: "Helsinki",
        country: "Finland",
        dates: ['2020-08-24', '2020-08-24'],
        td: testReferees[0].id,
        referees,
        teams: ["Team A", "Team B"],
        createdAt: "2020-07-24",
        updatedAt: "2020-08-19",
        createdBy: testReferees[0].id,
      },
      testReferees
    );
    Object.keys(store.modules.tournaments.actions).map(
      key => store.modules.tournaments.actions[key].mockReset()
    );
    Object.keys(store.modules.referees.actions).map(
      key => store.modules.referees.actions[key].mockReset()
    );
  });

  it("Renders correctly", async () => {
    const wrapper = mount(TournamentForm, {
      store: new Vuex.Store(store),
      localVue,
      propsData: { tournament, open: true },
      stubs
    });

    await wrapper.vm.loadTournamentForm(tournament);
    expect(wrapper).toMatchSnapshot();
    const saveButton = wrapper.find('button.is-primary.card-footer-item')
    expect(saveButton.exists()).toBe(true);
    expect(saveButton.text()).toBe("Update");
  });

  it("Renders new tournament correctly", async () => {
    const wrapper = mount(TournamentForm, {
      store: new Vuex.Store(store),
      localVue,
      propsData: { open: true },
      stubs
    });
    expect(wrapper).toMatchSnapshot();
    const saveButton = wrapper.find('button.is-primary.card-footer-item')
    expect(saveButton.exists()).toBe(true);
    expect(saveButton.text()).toBe("Save");
  });

  it("Renders new locked tournament correctly", async () => {
    tournament.locked = true;

    const wrapper = mount(TournamentForm, {
      store: new Vuex.Store(store),
      localVue,
      propsData: { tournament, open: true },
      stubs
    });

    await wrapper.vm.loadTournamentForm(tournament);
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find('button.is-primary.card-footer-item').exists()).toBe(false);
  });


  it("Can add/remove notes", async () => {
    tournament.id = null;
    tournament.comments.items = [{
      created: "2020-08-24 13:04",
      message: "Existing note",
      refereeID: referees[1].id,
    }];
    const wrapper = mount(TournamentForm, {
      store: new Vuex.Store(store),
      localVue,
      propsData: { tournament, open: true },
      stubs
    });

    await wrapper.vm.loadTournamentForm(tournament);
    await wrapper.find("textarea").setValue("Test note");
    await wrapper.find(".add-note-btn").trigger("click");
    expect(wrapper.find('.notes').text()).toContain("Test note");
    await wrapper.find("button.remove-comment-btn").trigger("click");
  });

  it("Can add notes to existing tournament", async () => {
    tournament.comments.items = [{
      created: "2020-08-24 13:04",
      message: "Existing note",
      refereeID: referees[1].id,
    }];
    const wrapper = mount(TournamentForm, {
      store: new Vuex.Store(store),
      localVue,
      propsData: { tournament, open: true },
      stubs
    });
    const { addComment, deleteComment } = store.modules.tournaments.actions;
    addComment.mockImplementation(
      (state, { comment, onSuccess }) => {
        onSuccess({ ...comment, id: "bogus-comment-id" });
      }
    );
    deleteComment.mockImplementation((state, { comment, onSuccess }) => onSuccess());

    await wrapper.vm.loadTournamentForm(tournament);
    await wrapper.find("textarea").setValue("Test note 2");
    await wrapper.find(".add-note-btn").trigger("click");
    expect(addComment).toHaveBeenCalled();
    expect(wrapper.find('.notes').text()).toContain("Test note 2");
    expect(wrapper.vm.t.comments.items.length).toBe(2);
    await wrapper.find("button.remove-comment-btn").trigger("click");
    //TODO: wait for next tick and check that the note was removed from UI
    expect(wrapper.vm.t.comments.items.length).toBe(1);
  });

  it("Handles saving new tournament", async () => {
    tournament.id = null;
    tournament.name = "New tournament";
    const $router = { push: jest.fn() };
    const wrapper = mount(TournamentForm, {
      store: new Vuex.Store(store),
      localVue,
      propsData: { tournament, open: true },
      mocks: { $router },
      stubs
    });
    const { create, update } = store.modules.tournaments.actions;
    create.mockImplementation(
      (state, { tournament, onSuccess }) => {
        tournament.id = "test-tournament";
        onSuccess(tournament);
      }
    )
    await wrapper.vm.loadTournamentForm(tournament);
    const saveBtn = wrapper.findComponent({ ref: "saveBtn" });
    await saveBtn.trigger("click");
    expect(create).toHaveBeenCalled();
    expect($router.push).toHaveBeenCalled();
    expect(update).not.toHaveBeenCalled();
  });


  it("Handles saving existing tournament", async () => {
    tournament.name = "Existing test tournament";
    const wrapper = mount(TournamentForm, {
      store: new Vuex.Store(store),
      localVue,
      propsData: { tournament, open: true },
      stubs
    });
    const { create, update } = store.modules.tournaments.actions;
    await wrapper.vm.loadTournamentForm(tournament);
    const saveBtn = wrapper.findComponent({ ref: "saveBtn" });
    await saveBtn.trigger("click");
    expect(update).toHaveBeenCalled();
    expect(create).not.toHaveBeenCalled();
  });
  
  it("Redirects to tournament list when cancelling on open tournament", async () => {
    const $router = { push: jest.fn() };
    const wrapper = mount(TournamentForm, {
      store: new Vuex.Store(store),
      localVue,
      propsData: { tournament, open: true },
      mocks: { $router },
      stubs
    });
    
    await wrapper.vm.loadTournamentForm(tournament);
    await wrapper.findComponent({ ref: "cancelBtn" }).trigger("click");
    expect($router.push).toHaveBeenCalledWith({
      name: 'tournaments',
      params: { year: 2020 }
    });
  });

  it("Resets the form when cancelling a new tournament", async () => {
    const $router = { push: jest.fn() };
    tournament.id = null;
    tournament.name = "to-be-reset"
    const wrapper = mount(TournamentForm, {
      store: new Vuex.Store(store),
      localVue,
      propsData: { tournament, open: true },
      mocks: { $router },
      stubs
    });

    await wrapper.vm.loadTournamentForm(tournament);
    expect(wrapper.vm.t.name).toBe(tournament.name);
    await wrapper.findComponent({ ref: "cancelBtn" }).trigger("click");
    expect($router.push).not.toHaveBeenCalled();
    expect(wrapper.vm.t.name).toBe("");
  });

  it("Confirms delete command with dialog", async () => {
    const $buefy = { dialog: { prompt: jest.fn() } };
    const $router = { push: jest.fn() };
    const wrapper = mount(TournamentForm, {
      store: new Vuex.Store(store),
      localVue,
      propsData: { tournament, open: true },
      mocks: { $buefy, $router },
      stubs
    });
    store.modules.tournaments.actions.delete.mockImplementation(
      (store, { onSuccess }) => onSuccess()
    );

    await wrapper.vm.loadTournamentForm(tournament);
    await wrapper.findComponent({ ref: "deleteBtn" }).trigger("click");
    expect($buefy.dialog.prompt).toHaveBeenCalled();

    await wrapper.vm.handleConfirmDelete("DON'T!");
    expect(store.modules.tournaments.actions.delete).not.toHaveBeenCalled();
    await wrapper.vm.handleConfirmDelete("delete");
    expect(store.modules.tournaments.actions.delete).toHaveBeenCalled();
    expect($router.push).toHaveBeenCalledWith({
      name: 'tournaments',
      params: { year: 2020 }
    });
  });

  it("TD can be set/removed", async () => {
    const $buefy = { dialog: { confirm: jest.fn() } };
    $buefy.dialog.confirm.mockImplementation(
      ({ onConfirm }) => onConfirm()
    );
    tournament.td = null;
    const wrapper = mount(TournamentForm, {
      store: new Vuex.Store(store),
      localVue,
      propsData: { tournament, open: true },
      mocks: { $buefy },
      stubs
    });
    await wrapper.vm.loadTournamentForm(tournament);
    await wrapper.findComponent({ ref: "setTdButton"}).trigger("click");
    const tdTag = wrapper.find("span.td-tag");
    expect(tdTag.text()).toContain("John Doe");
    await tdTag.find("a.delete").trigger("click");
    expect($buefy.dialog.confirm).toHaveBeenCalled();
  });

  it("Referee can be set", async () => {
    tournament.referees = [];
    const wrapper = mount(TournamentForm, {
      store: new Vuex.Store(store),
      localVue,
      propsData: { tournament, open: true },
      stubs
    });
    await wrapper.vm.loadTournamentForm(tournament);
    await wrapper.findComponent({ ref: "setRefereeBtn" }).trigger("click");
    expect(wrapper.find("div.referee-table").text()).toContain("John  Doe");
  });

  it("Referee can be removed", async () => {
    const wrapper = mount(TournamentForm, {
      store: new Vuex.Store(store),
      localVue,
      propsData: { tournament, open: true },
      stubs
    });
    await wrapper.vm.loadTournamentForm(tournament);
    const refTable = wrapper.find("div.referee-table");
    expect(refTable.text()).toContain("John");
    await refTable.find("button.is-danger").trigger("click");
    expect(refTable.text()).not.toContain("John");
  });

  it("Adding new referee opens a dialog", async () => {
    const $buefy = { modal: { open: jest.fn() } };
    $buefy.modal.open.mockImplementation(
      ({ props: { onSave } }) => onSave()
    );
    store.modules.referees.actions.create.mockImplementation(
      (state, { onSuccess }) => onSuccess(testReferees[2])
    );
    tournament.referees = [];
    const wrapper = mount(TournamentForm, {
      store: new Vuex.Store(store),
      localVue,
      propsData: { tournament, open: true },
      mocks: { $buefy },
      stubs
    });
    await wrapper.vm.loadTournamentForm(tournament);

    await wrapper.findComponent({ ref: "addRefereeBtn" }).trigger("click");
    expect($buefy.modal.open).toHaveBeenCalled();
    expect(store.modules.referees.actions.create).toHaveBeenCalled();
    const refTable = wrapper.find("div.referee-table");
    expect(refTable.text()).toContain("Noob");
  });

  it("Adding new referee opens a dialog", async () => {
    const $buefy = { modal: { open: jest.fn() } };
    $buefy.modal.open.mockImplementation(
      ({ props: { onSave } }) => onSave()
    );
    store.modules.referees.actions.create.mockImplementation(
      (state, { onSuccess }) => onSuccess(testReferees[2])
    );
    tournament.td = null;
    const wrapper = mount(TournamentForm, {
      store: new Vuex.Store(store),
      localVue,
      propsData: { tournament, open: true },
      mocks: { $buefy },
      stubs
    });
    await wrapper.vm.loadTournamentForm(tournament);

    await wrapper.find(".td-autocomplete input").setValue("Waldo");
    await wrapper.findComponent({ ref: "addTdLink" }).trigger("click");
    expect($buefy.modal.open).toHaveBeenCalled();
    expect(store.modules.referees.actions.create).toHaveBeenCalled();
    const tdTag = wrapper.find("span.td-tag");
    expect(tdTag.text()).toContain(testReferees[2].firstName);
  });


  it("Tournament can be locked", async () => {
    const { lockTournament } = store.modules.tournaments.actions;
    lockTournament.mockImplementation(
      (state, { lock, onSuccess }) => onSuccess({ locked: lock })
    );
    const wrapper = mount(TournamentForm, {
      store: new Vuex.Store(store),
      localVue,
      propsData: { tournament, open: true },
      stubs
    });
    await wrapper.vm.loadTournamentForm(tournament);

    await wrapper.findComponent({ ref: "lockBtn" }).trigger("click");
    expect(lockTournament).toHaveBeenCalled();
    expect(wrapper.text()).toContain("Tournament is locked");
  });


  it("Tournament can be unlocked", async () => {
    const { lockTournament } = store.modules.tournaments.actions;
    lockTournament.mockImplementation(
      (state, { lock, onSuccess }) => onSuccess({ locked: lock })
    );
    tournament.locked = true;
    const wrapper = mount(TournamentForm, {
      store: new Vuex.Store(store),
      localVue,
      propsData: { tournament, open: true },
      stubs
    });
    await wrapper.vm.loadTournamentForm(tournament);
    expect(wrapper.text()).toContain("Tournament is locked");
    
    await wrapper.findComponent({ ref: "unlockBtn" }).trigger("click");
    expect(lockTournament).toHaveBeenCalled();
    expect(wrapper.text()).not.toContain("Tournament is locked");
  });
});