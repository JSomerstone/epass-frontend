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
  loggedIn: false,
  user: null,
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
    state.loading = user;
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
      commit(mutationTypes.SET_USER, result);
      commit(mutationTypes.SIGNUP_STEP, signupSteps.verify);
    } catch (error) {
      commit(mutationTypes.SIGNUP_STEP, signupSteps.auth);
      console.log("error signing up:", error);
      Toast.open({
        message: error.message,
        type: "is-error",
      });
    }
    dispatch("setLoading", { loading: false });
  },
};

const auth = {
  namespaced: true,
  state,
  getters: {
    loading: (state) => state.loading,
    signupStep: state => state.signupStep
  },
  mutations,
  actions,
  mutationTypes,
};
export default auth;
