import { shallowMount, mount } from "@vue/test-utils";
import Vuex from "vuex";
import localVue from "../localVue";
import Tournaments from "../../../src/views/Tournaments.vue";
import tournamentModule from "../../../src/store/modules/tournaments";
import refereeModule from "../../../src/store/modules/referees";
import VueRouter from "vue-router";
import routes from "@/routes";
import Referee from "@/store/models/RefereeClass";
import referees from "../../data/referee.json";
import stubs from "../../stubs";

describe("Tournaments-view", () => {
  let state, store, route;
  let router = new VueRouter({ routes });
  route = {
    params: { year: 2020 },
    query: { open: true }
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
            filter: () => state.tournaments.filter,
            teams: () => [],
          },
          actions: {
            load: jest.fn(),
            loadTeams: jest.fn(),
            addTeam: jest.fn(),
          }
        },
        referees: {
          state: state.referees,
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
  });

  it("renders complete view when mounted", () => {
    const wrapper = mount(Tournaments, {
      store,
      router,
      localVue,
      stubs,
      mocks: {
        $route: route,
        $buefy: jest.fn(),
      }
    });
    expect(wrapper).toMatchSnapshot();

  });
});