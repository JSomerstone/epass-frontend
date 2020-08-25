import { mount } from "@vue/test-utils";
import Vuex from "vuex";
import localVue from "../../localVue";
import store from "../../mockStore";

import CountryAutocomplete from "@/components/field/CountryAutocomplete";

describe("CountryAutocomplete", () => {

  let propsData;
  beforeAll(() => {
    propsData = {
      value: "",
      placeholder: "Country",
      disabled: false,
      onSelect: jest.fn()
    }
  });
  it("Renders correctly", () => {
    const wrapper = mount(CountryAutocomplete, {
      localVue,
      store: new Vuex.Store(store),
      propsData,
    });
    expect(wrapper).toMatchSnapshot();
  });

  it("Typing filters country list and selecting calls onSelect", async () => {
    const wrapper = mount(CountryAutocomplete, {
      localVue,
      store: new Vuex.Store(store),
      propsData,
    });
    
    const inputField = wrapper.find('input');
    await inputField.trigger("focus");
    await inputField.setValue("Fin");
    await inputField.trigger("blur");
    expect(wrapper).toMatchSnapshot();
    await wrapper.find("a.is-hovered").trigger("click");
    expect(propsData.onSelect).toHaveBeenCalledWith("Finland");
  });

});