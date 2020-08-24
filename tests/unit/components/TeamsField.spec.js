import { mount, RouterLinkStub } from "@vue/test-utils";
import Vuex from "vuex";
import localVue from "../localVue";
import store from "../mockStore";

import TeamsField from "@/components/TeamsField";

describe("TeamsField", () => {
  let { tournaments } = store.modules;
  let value;

  beforeEach(() => {
    tournaments.state.teams = ["Team A", "Team B", "Team C", "Team D"];
    value = ["Team A", "Team B"];
  });

  it("Teams are removable when field is editable", async () => {
    const wrapper = mount(TeamsField, {
      localVue,
      store: new Vuex.Store(store),
      propsData: { value, editable: true },
      stubs: {
        RouterLink: RouterLinkStub
      }
    });

    expect(wrapper).toMatchSnapshot();
    let list = wrapper.find("div.team-list");
    expect(list.text()).toContain("Team A");
    expect(list.text()).toContain("Team B");
    expect(list.text()).not.toContain("Team C");

    await wrapper.find("a.delete").trigger("click");
    expect(list.text()).not.toContain("Team A");
  });

  it("New team can be added when field is editable", async () => {
    const vuexStore = new Vuex.Store(store);
    const wrapper = mount(TeamsField, {
      localVue,
      store: new Vuex.Store(store),
      propsData: { value, editable: true },
      stubs: {
        RouterLink: RouterLinkStub
      }
    });

    await wrapper.find('input').setValue("Team C");
    await wrapper.find('a.dropdown-item').trigger("click");
    expect(wrapper.find("div.team-list").text()).toContain("Team C");
  });

  it("Team can be added with Enter", async () => {
    const wrapper = mount(TeamsField, {
      localVue,
      store: new Vuex.Store(store),
      propsData: { value, editable: true },
      stubs: {
        RouterLink: RouterLinkStub
      }
    });

    const inputField = wrapper.find('input')
    await inputField.setValue("Team X");
    await wrapper.vm.onInput({ code: "Enter" });
    expect(wrapper.find("div.team-list").text()).toContain("Team X");
    expect(tournaments.actions.addTeam).toHaveBeenCalled();
  });
});