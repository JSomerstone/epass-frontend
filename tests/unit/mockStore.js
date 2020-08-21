import Vuex from "vuex";

import tournamentModule from "@/store/modules/tournaments";
import refereeModule from "@/store/modules/referees";
import Referee from "@/store/models/RefereeClass";

import referees from "../data/referee.json";
import tournaments from "../data/tournaments.json";

const store = new Vuex.Store({
  modules: {
    tournaments: {
      state: tournamentModule.state,
      namespaced: true,
      getters: {
        all: () => tournaments["2020"],
        loading: () => false,
        debug: () => false,
        filter: () => tournamentModule.state.filter,
        teams: () => [],
      },
      actions: {
        load: jest.fn(),
        loadTeams: jest.fn(),
        addTeam: jest.fn(),
      }
    },
    referees: {
      state: refereeModule.state,
      namespaced: true,
      getters: {
        current: () => new Referee(referees[0]),
        all: () => referees,
        search: () => jest.fn(),
      },
      actions: {
        load: jest.fn()
      }
    },
  },
});

export default store;