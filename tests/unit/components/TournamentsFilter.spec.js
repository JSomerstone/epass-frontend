import { mount, RouterLinkStub } from "@vue/test-utils";
import Vuex from "vuex";
import localVue from "../localVue";
import store from "../mockStore";
import TournamentsFilter from "@/components/TournamentsFilter";
import tournaments from "../../data/tournaments.json"

describe("TournamentsFilter", () => {

  it("Renders correctly", () => {
    const wrapper = mount(TournamentsFilter, {
      localVue,
      store: new Vuex.Store(store),
    });
    expect(wrapper).toMatchSnapshot();
  });

  it("Dispatces tournaments/setFilter when changed", async () => {
    const wrapper = mount(TournamentsFilter, {
      localVue,
      store: new Vuex.Store(store),
    });
    const { setFilter } = store.modules.tournaments.actions;
    expect(wrapper.vm.showTournaments).toBe("own");
    //For reason X triggering click on UI did not change the state
    await wrapper.setData({ showTournaments: 'all' })
    expect(wrapper.vm.showTournaments).toBe("all");
    expect(setFilter).toHaveBeenCalled();
  });

});