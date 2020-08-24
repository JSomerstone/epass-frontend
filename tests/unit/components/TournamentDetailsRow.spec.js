import { mount, RouterLinkStub } from "@vue/test-utils";
import Vuex from "vuex";
import localVue from "../localVue";
import store from "../mockStore";
import testReferees from "../../data/referee.json";

import TournamentDetailRow from "@/components/TournamentDetailRow";
import Tournament from "@/store/models/Tournament";


describe("TournamentDetailRow", () => {
  let tournament, referees = [];
  
  beforeEach(() => {
    referees = testReferees.map(
      r => {
        return {
          id: r.id,
          games: 6,
          tenSeconds: 7
        };
      }
    )
    tournament = new Tournament(
      {
        id: "bogus-tournament",
        td: testReferees[0].id,
        referees,
        teams: ["Team A", "Team B"]
      },
      testReferees
    ).toJson();
  });

  it("Renders correctly", () => {
    const wrapper = mount(TournamentDetailRow, {
      store: new Vuex.Store(store),
      localVue,
      propsData: { tournament },
      stubs: {
        RouterLink: RouterLinkStub
      }
    });

    expect(wrapper).toMatchSnapshot();
  })
});