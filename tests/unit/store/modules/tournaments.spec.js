import tournaments from "@/store/modules/tournaments";
import Vuex from "vuex";
import localVue from "../../localVue";
import { API } from "aws-amplify";
jest.mock("aws-amplify");

describe("Module: tournaments", () => {

  let store;
  beforeEach(() => {
    tournaments.state = {
      loading: false,
      tournaments: [],
      filteredTournaments: [],
      selectedTournaments: [],
      filter: { show: "own" },
      wip: null,
      showTournamentForm: false,
      teams: [],
      debug: false
    };

    store = new Vuex.Store({
      modules: { tournaments }
    });
  });

  it("/setLoading changes the state", () => {
    store.dispatch("tournaments/setLoading", { loading: true });
    expect(tournaments.state.loading).toBe(true);
  });
});