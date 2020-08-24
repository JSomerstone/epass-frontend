import { shallowMount, mount } from "@vue/test-utils";
import localVue from "../localVue";
import store from "../mockStore";
import Vuex from "vuex";
import Tournaments from "../../../src/views/Tournaments.vue";
import stubs from "../../stubs";

describe("Tournaments-view", () => {
  let route;

  beforeEach(() => {
    route = {
      params: { year: 2020 },
      query: { open: true }
    }
  });

  it("renders correctly with empty list", () => {
    const wrapper = shallowMount(Tournaments, {
      store: new Vuex.Store(store),
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
      store: new Vuex.Store(store),
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