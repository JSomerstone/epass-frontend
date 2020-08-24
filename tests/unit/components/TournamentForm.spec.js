import { mount } from "@vue/test-utils";
import Vuex from "vuex";
import localVue from "../localVue";
import store from "../mockStore";
import testReferees from "../../data/referee.json";

import TournamentForm from "@/components/TournamentForm";
import Tournament from "@/store/models/Tournament";


describe("TournamentDetailRow", () => {
  let tournament, referees = [];
  
  beforeEach(() => {
    referees = testReferees.map(
      ({ id }, n) => {
        return { id: id, games: n, tenSeconds: n };
      }
    )
    tournament = new Tournament(
      {
        id: "bogus-tournament",
        dates: ['2020-08-24', '2020-08-24'],
        td: testReferees[0].id,
        referees,
        teams: ["Team A", "Team B"]
      },
      testReferees
    );
  });

  it("Renders correctly", async () => {
    const wrapper = mount(TournamentForm, {
      store: new Vuex.Store(store),
      localVue,
      propsData: { tournament, open: true },
      stubs: {
        transition: false
      }
    });

    await wrapper.vm.loadTournamentForm(tournament);
    expect(wrapper).toMatchSnapshot();
  });
});