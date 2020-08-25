import { mount } from "@vue/test-utils";
import Vuex from "vuex";
import localVue from "../localVue";
import store from "../mockStore";
import RefereeForm from "@/components/RefereeForm";
import Referee from "@/store/models/RefereeClass";

describe("RefereeForm", () => {
  let referee;

  beforeEach(() => {
    referee = new Referee();
  });

  it("Renders correctly", () => {
    const wrapper = mount(RefereeForm, {
      localVue,
      store: new Vuex.Store(store),
      propsData: {
        value: referee
      }
    });
    expect(wrapper).toMatchSnapshot();
  });

  it("Emits the changes on field", async () => {
    const wrapper = mount(RefereeForm, {
      localVue,
      store: new Vuex.Store(store),
      propsData: {
        value: referee
      }
    });
    let nameField = wrapper.find('input');
    await nameField.trigger("focus");
    await nameField.setValue("Daniel");
    await nameField.trigger("blur");

    expect(referee.firstName).toBe("Daniel");

  })
});