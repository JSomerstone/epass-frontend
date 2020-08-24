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
    let { actions } = store.modules.tournaments;
    Object.keys(actions).map(
      key => actions[key].mockReset()
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
    const wrapper = mount(TournamentForm, {
      store: new Vuex.Store(store),
      localVue,
      propsData: { tournament, open: true },
      stubs
    });

    await wrapper.vm.loadTournamentForm(tournament);
    const saveBtn = wrapper.findComponent({ ref: "saveBtn" });
    await saveBtn.trigger("click");
    expect(store.modules.tournaments.actions.create).toHaveBeenCalled();
    expect(store.modules.tournaments.actions.update).not.toHaveBeenCalled();
  });


  it("Handles saving existing tournament", async () => {
    tournament.name = "Existing test tournament";
    const wrapper = mount(TournamentForm, {
      store: new Vuex.Store(store),
      localVue,
      propsData: { tournament, open: true },
      stubs
    });

    await wrapper.vm.loadTournamentForm(tournament);
    const saveBtn = wrapper.findComponent({ ref: "saveBtn" });
    await saveBtn.trigger("click");
    expect(store.modules.tournaments.actions.update).toHaveBeenCalled();
    expect(store.modules.tournaments.actions.create).not.toHaveBeenCalled();
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
});