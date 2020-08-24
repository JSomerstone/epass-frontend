import { mount } from "@vue/test-utils";
import Vuex from "vuex";
import localVue from "../localVue";
import store from "../mockStore";
import testReferees from "../../data/referee.json";

import TournamentForm from "@/components/TournamentForm";
import Tournament from "@/store/models/Tournament";


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


  it("Can add notes", async () => {
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
});