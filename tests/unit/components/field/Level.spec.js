import { mount } from "@vue/test-utils";
import Vuex from "vuex";
import localVue from "../../localVue";
import store from "../../mockStore";

import Level from "@/components/field/Level";

describe("Level", () => {

  let propsData;
  beforeAll(() => {
    propsData = { value: 1 }
  });
  it("Renders correctly", () => {
    const wrapper = mount(Level, {
      localVue,
      propsData,
    });
    expect(wrapper).toMatchSnapshot();
  });

  it("Value change is emitted", async () => {
    const wrapper = mount(Level, {
      localVue,
      store: new Vuex.Store(store),
      propsData,
    });
    
    await wrapper.setData({ level: 2 });
    expect(wrapper.vm.level).toBe(2);
  });

});