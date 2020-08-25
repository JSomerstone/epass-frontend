import { mount, RouterLinkStub } from "@vue/test-utils";
import Vuex from "vuex";
import localVue from "../localVue";
import store from "../mockStore";
import TournamentList from "@/components/TournamentList";
import tournaments from "../../data/tournaments.json"

describe("TournamentList", () => {

  beforeEach(() => {
  });

  it("Renders correctly", () => {
    const wrapper = mount(TournamentList, {
      localVue,
      store: new Vuex.Store(store),
      propsData: {
        items: tournaments[2020],
        year: 2020
      }
    });
    expect(wrapper).toMatchSnapshot();
  });

  it("Renders correctly with empty list", () => {
    const wrapper = mount(TournamentList, {
      localVue,
      store: new Vuex.Store(store),
      propsData: {
        year: 2020
      }
    });
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.vm.isEmpty).toBe(true);
  });

  it("Reloading dispatches tournaments/load", async () => {
    const wrapper = mount(TournamentList, {
      localVue,
      store: new Vuex.Store(store),
      propsData: {
        year: 2020
      }
    });
    const { load } = store.modules.tournaments.actions;
    await wrapper.findComponent({ ref: "reloadBtn" }).trigger("click");
    
    expect(load).toHaveBeenCalled();
  });

  it("Clicking tournament name opens details", async () => {
    const wrapper = mount(TournamentList, {
      localVue,
      store: new Vuex.Store(store),
      stubs: {  RouterLink: RouterLinkStub },
      propsData: {
        items: tournaments[2020],
        year: 2020
      }
    });
    await wrapper.find("td a").trigger("click");

    expect(wrapper).toMatchSnapshot();
    await wrapper.vm.toggle(0);
  });

  it("Tournaments can be sorted by date", async () => {
    const wrapper = mount(TournamentList, {
      localVue,
      store: new Vuex.Store(store),
      propsData: {
        items: tournaments[2020],
        year: 2020
      }
    });
    expect(wrapper.find("td.date-column").text()).toBe("2/20/2020 - 2/22/2020");
    await wrapper.find("td.date-column").trigger("click");
    expect(wrapper.find("td.date-column").text()).toBe("3/20/2020");

    const row0 = { dates: ["2020-08-25 00:00:00", "2020-08-26 00:00:00"] };
    const row1 = { dates: ["2020-08-24 00:00:00", "2020-08-24 00:00:00"] };
    expect(wrapper.vm.sortDates(row0, row1, true)).toBe(24 * 60 * 60 * 1000);
  });
});