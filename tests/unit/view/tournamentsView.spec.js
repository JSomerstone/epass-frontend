import { shallowMount } from "@vue/test-utils";
import Vuex from "vuex";
import localVue from "../localVue";
import Tournaments from "../../../src/views/Tournaments.vue";
import tournamentModule from "../../../src/store/modules/tournaments";
import refereeModule from "../../../src/store/modules/referees";
import VueRouter from "vue-router";
import routes from "@/routes";
import Referee from "@/store/models/RefereeClass";
import referees from "../../data/referee.json";

describe("Tournaments-view", () => {
  let state, store, route;
  let router = new VueRouter({ routes });
  let mockAction = jest.fn();
  route = {
    params: { year: 2020 },
    query: {}
  }
  state = {
    tournaments: tournamentModule.state,
    referees: refereeModule.state,
  };
  beforeEach(() => {
    let storeProps = {
      modules: {
        tournaments: {
          state: state.tournaments,
          namespaced: true,
          getters: {
            all: () => [],
            loading: () => false,
            debug: () => false,
          },
          actions: {
            load: mockAction,
            loadTeams: mockAction,
          }
        },
        referees: {
          state: state.referees,
          namespaced: true,
          getters: {
            current: () => new Referee(referees[0]),
          },
          actions: {
            load: mockAction
          }
        },
      },
    };
    store = new Vuex.Store(storeProps);
  });

  it("renders correctly with empty list", () => {
    const wrapper = shallowMount(Tournaments, {
      store,
      router,
      localVue,
      stubs: ["router-link", "b-button"],
      mocks: {
        $route: route
      }
    });
    expect(wrapper).toMatchSnapshot();
  })
});