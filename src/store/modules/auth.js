// import axios from "axios";
import { ToastProgrammatic as Toast } from 'buefy'
import Amplify, { Auth } from 'aws-amplify';
import awsconfig from "../../aws-exports";
Amplify.configure(awsconfig);

const state = {
  loading: false,
  loggedIn: false,
  user: null,
};

const mutationTypes = {
  SET_LOADING: "set-loading",
};

const mutations = {
  [mutationTypes.SET_LOADING](state, loading) {
    state.loading = loading;
  },

  [mutationTypes.SET_USER](state, user) {
    state.loading = user;
  },
};

const actions = {
  setLoading({ commit }, { loading }) {
    commit(mutationTypes.SET_LOADING, loading);
  },
  async signUp({ commit }, { username, password, attributes }) {
    console.log({ action: "Signup", username, attributes });
    try {
      const result = await Auth.signUp({
        username,
        password,
        attributes,
      });
      console.log({ result });
      commit(mutationTypes.SET_USER, result);
    } catch (error) {
      console.log("error signing up:", error);
      Toast.open({
        message: error.message,
        type: "is-error",
      });
    }
  },
};

const auth = {
  namespaced: true,
  state,
  getters: {
    loading: (state) => state.loading,
  },
  mutations,
  actions,
  mutationTypes,
};
export default auth;
