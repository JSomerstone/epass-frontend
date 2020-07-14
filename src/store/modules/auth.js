// import axios from "axios";
import { ToastProgrammatic as Toast } from 'buefy'
import Amplify, { Auth } from 'aws-amplify';
import awsconfig from "../../aws-exports";
Amplify.configure(awsconfig);

const signupSteps = {
  auth: 0,
  verify: 1,
  profile: 2,
  done: 3
}

const state = {
  loading: false,
  user: null,
  userInfo: { email: "", username: ""},
  signupStep: signupSteps.auth
};

const mutationTypes = {
  SET_LOADING: "set-loading",
  SET_USER: "set-user",
  SIGNUP_STEP: "set-signup-step",
};

const mutations = {
  [mutationTypes.SET_LOADING](state, loading) {
    state.loading = loading;
  },

  [mutationTypes.SET_USER](state, user) {
    state.user = user;
    const {
      attributes: { email= "" },
      username = "",
    } = user;
    state.userInfo = { email, username };
  },

  [mutationTypes.SIGNUP_STEP](state, step) {
    state.signupStep = step;
  },
};

const actions = {
  setLoading({ commit }, { loading }) {
    commit(mutationTypes.SET_LOADING, loading);
  },
  setSignupState({ commit }, { signup }) {
    commit(mutationTypes.SET_SIGNUP_STATE, signup);
  },
  async signUp({ commit, dispatch }, { username, password, attributes = {} }) {
    dispatch("setLoading", { loading: true });
    console.log({ action: "Signup", username, attributes });
    try {
      const result = await Auth.signUp({
        username,
        password,
        attributes,
      });
      console.log({ result });
      commit(mutationTypes.SET_USER, result.result.user);
      commit(mutationTypes.SIGNUP_STEP, signupSteps.verify);
    } catch (error) {
      commit(mutationTypes.SIGNUP_STEP, signupSteps.auth);
      console.log("error signing up:", error);
      Toast.open({
        message: error.message,
        type: "is-danger",
      });
    }
    dispatch("setLoading", { loading: false });
  },

  async verifyAddress({ commit, dispatch }, { username, code }) {
    dispatch("setLoading", { loading: true });
    console.log({ action: "Verify", code });
    try {
      await Auth.confirmSignUp(username, code);
      commit(mutationTypes.SIGNUP_STEP, signupSteps.profile);
    } catch (error) {
      commit(mutationTypes.SIGNUP_STEP, signupSteps.verify);
      console.log("error verifying up:", error);
      Toast.open({
        message: error.message,
        type: "is-danger",
      });
    }
    dispatch("setLoading", { loading: false });
  },

  async login({ commit, dispatch }, { username, password }) {
    dispatch("setLoading", { loading: true });

    Auth.signIn(username, password)
      .then((user) => {
        console.log(user);
        commit(mutationTypes.SET_USER, user);
        Toast.open({
          message: `Welcome ${user.attributes.email}`,
          type: "is-success",
        });
      })
      .catch((error) => {
        console.log("error signIn up:", error);
        Toast.open({
          duration: 10000,
          message: error.message,
          type: "is-danger",
        });
      })
      .finally(() => {
        dispatch("setLoading", { loading: false });
      });
  },

  async logout({ commit, dispatch }) {
    dispatch("setLoading", { loading: true });
    Auth.signOut()
      .then(() => {
        commit(mutationTypes.SET_USER, null);
      })
      .catch((error) => {
        console.log("error in Auth.signOut():", error);
        Toast.open({
          duration: 10000,
          message: error.message,
          type: "is-danger",
        });
      })
      .finally(() => {
        dispatch("setLoading", { loading: false });
      });
  }
};

const auth = {
  namespaced: true,
  state,
  getters: {
    loading: (state) => state.loading,
    signupStep: state => state.signupStep,
    loggedIn: state => Boolean(state.user),
    user: state => state.userInfo
  },
  mutations,
  actions,
  mutationTypes,
};
export default auth;
