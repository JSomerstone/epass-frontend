import tournamentModule from "@/store/modules/tournaments";
import refereeModule from "@/store/modules/referees";
import Referee from "@/store/models/RefereeClass";

import referees from "../data/referee.json";
import tournaments from "../data/tournaments.json";

export default {
  modules: {
    auth: {
      state: {
        debug: false,
        loading: false,
        userInfo: {},
        signupStep: 0,
        signupEmail: "",
        signupUserId: "",
      },
      namespaced: true,
      getters: {
        loading: () => false,
        signupOngoing: state => state.signupStep > 0 && state.signupStep < signupSteps.done,
        signupStep: state => state.signupStep,
        signupEmail: state => state.signupEmail,
        signupUserId: state => state.signupUserId,
        loggedIn: state => Boolean(state.userInfo.userId),
        user: state => state.userInfo,
        debug: () => false
      },
    },
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
};