import { mount, RouterLinkStub } from "@vue/test-utils";
import Vuex from "vuex";
import localVue from "../localVue";
import store from "../mockStore";
import testReferees from "../../data/referee.json";

import Navbar from "@/components/Navbar";

describe("Navbar", () => {

  let { auth, referees } = store.modules;


  beforeEach(() => {
    auth.state.userInfo = { };
    referees.state.current = {};
  });

  it("Renders Login & Signup buttons when not logged in", () => {

    const vuexStore = new Vuex.Store(store);
    const wrapper = mount(Navbar, {
      localVue,
      store: vuexStore,
      stubs: {
        RouterLink: RouterLinkStub
      }
    });
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find("a.login-link").text()).toBe("Login");
    expect(wrapper.find("a.sign-up-link").text()).toBe("Sign up");
    let link = wrapper.findComponent(RouterLinkStub);
    expect(link.props().to.path).toBe('/')
  });

  it("Does not render Login & Signup buttons when logged in", () => {
    auth.state.userInfo = {
      userId: "bogus-user",
      refereeId: testReferees[0].id,
    }
    const vuexStore = new Vuex.Store(store);
    const wrapper = mount(Navbar, {
      localVue,
      store: vuexStore,
      stubs: {
        RouterLink: RouterLinkStub
      }
    });
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find("a.login-link").exists()).toBe(false);
    expect(wrapper.find("a.sign-up-link").exists()).toBe(false);
    // "firtsName lastName" of the first item in test/data/referees.json
    expect(wrapper.find("a.settings-link").text()).toBe("Settings");
    expect(wrapper.find("a.logout-link").text()).toBe("Logout");
  });


  it("Calls auth/logout when Logout button is clicked", async () => {
    auth.state.userInfo = {
      userId: "bogus-user",
      refereeId: testReferees[0].id,
    }
    const logout = jest.fn();
    auth.actions = { logout }

    const vuexStore = new Vuex.Store(store);
    const wrapper = mount(Navbar, {
      localVue,
      store: vuexStore,
      stubs: {
        RouterLink: RouterLinkStub
      }
    });
    const logoutBtn = wrapper.find("a.logout-link");
    await logoutBtn.trigger('click');
    expect(logout).toHaveBeenCalled();
  });
});