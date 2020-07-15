// import axios from "axios";
import { ToastProgrammatic as Toast } from 'buefy'
import Amplify, { Auth } from 'aws-amplify';
import awsconfig from "../../aws-exports";
Amplify.configure(awsconfig);

const AUTH_KEYS = {
  META: "authMetaData",
  USER: "LastAuthUser",
  USER_DATA: "userData"
};

let userInfo = { email: "", username: "", email_verified: false };
const localLoad = (key, defaultValue = null) => JSON.parse(localStorage.getItem(key)) || defaultValue;
const localSave = (key, value) => localStorage.setItem(key, JSON.stringify(value));

const authMeta = localLoad(AUTH_KEYS.META);
if (authMeta) {
  try {
    // There has been a login -> Load from Local Storage
    let username = localStorage.getItem(authMeta.userKey);
    const userData = localLoad(authMeta.userDataKey);
    userInfo = {
      username,
      email_verified: Boolean(userData.UserAttributes.find(
        (attr) => attr.Name == "email_verified"
      ).Value),
      email: userData.UserAttributes.find((attr) => attr.Name == "email").Value,
    };
  } catch (error) {
    console.log("Error while loading user data from localStorage:", error);
  }
}


const signupSteps = {
  auth: 0,
  verify: 1,
  profile: 2,
  done: 3
}

const state = {
  loading: false,
  userInfo,
  signupStep: signupSteps.auth,
  signupEmail: "",
  signupUserId: "",
};

const mutationTypes = {
  SET_LOADING: "set-loading",
  SET_USER_INFO: "set-user",
  SIGNUP_STEP: "set-signup-step",
  SET_SIGNUP_EMAIL: "set-signup-email",
  SET_SIGNUP_USERID: "set-signup-userid",
};

const mutations = {
  [mutationTypes.SET_LOADING](state, loading) {
    state.loading = loading;
  },

  [mutationTypes.SET_USER_INFO](state, user) {
    if (user == null) {
      state.userInfo = { username: "", email: "", email_verified: false };
      localStorage.removeItem(AUTH_KEYS.META);
    } else {
      localSave(AUTH_KEYS.META, {
        keyPrefix: user.keyPrefix,
        userKey: `${user.keyPrefix}.${AUTH_KEYS.USER}`,
        userDataKey: `${user.keyPrefix}.${user.username}.${AUTH_KEYS.USER_DATA}`,
      });
      const {
        attributes: { email = "", email_verified = false },
        username = "",
      } = user;
      state.userInfo = { email, username, email_verified };
    }
  },

  [mutationTypes.SIGNUP_STEP](state, step) {
    state.signupStep = step;
  },

  [mutationTypes.SET_SIGNUP_EMAIL](state, email) {
    state.signupEmail = email;
  },

  [mutationTypes.SET_SIGNUP_USERID](state, userId) {
    state.signupUserId = userId;
  },
};

const actions = {
  setLoading({ commit }, { loading }) {
    commit(mutationTypes.SET_LOADING, loading);
  },
  setSignupState({ commit }, { signup }) {
    commit(mutationTypes.SET_SIGNUP_STATE, signup);
  },
  setUser({ commit }, { user }) {
    commit(mutationTypes.SET_USER_INFO, user);
  },
  async signUp({ commit, dispatch }, { username, password, attributes = {} }) {
    dispatch("setLoading", { loading: true });
    try {
      commit(mutationTypes.SET_SIGNUP_EMAIL, username);
      const result = await Auth.signUp({
        username,
        password,
        attributes,
      });
      console.log("signup", { ...result });
      commit(mutationTypes.SET_SIGNUP_USERID, result.userSub);
      commit(mutationTypes.SIGNUP_STEP, signupSteps.verify);
    } catch (error) {
      console.log("error signing up:", error);
      Toast.open({
        message: error.message,
        type: "is-danger",
      });
      if (error.code == "UsernameExistsException") {
        commit(mutationTypes.SIGNUP_STEP, signupSteps.verify);
      }
    }
    dispatch("setLoading", { loading: false });
  },

  async verifyAddress({ commit, dispatch, state }, { code }) {
    dispatch("setLoading", { loading: true });
    console.log({ action: "Verify", code });
    try {
      await Auth.confirmSignUp(state.signupEmail, code);
      commit(mutationTypes.SIGNUP_STEP, signupSteps.profile);
    } catch (error) {
      console.log("error verifying up:", error);
      Toast.open({
        message: error.message,
        type: "is-danger",
      });
    }
    dispatch("setLoading", { loading: false });
  },
  async resendVerification({ dispatch, state }) {
    dispatch("setLoading", { loading: true });
    Auth.resendSignUp(state.signupEmail)
      .then(() => {
        Toast.open({ message: "Verification code sent" });
      })
      .catch((error) => {
        console.log("error in resendVerification:", error);
        Toast.open({
          message: error.message,
          type: "is-danger",
        });
      })
      .finally(() => {
        dispatch("setLoading", { loading: false });
      });
  },
  async login({ commit, dispatch }, { username, password }) {
    dispatch("setLoading", { loading: true });

    Auth.signIn(username, password)
      .then((user) => {
        console.log(user);
        commit(mutationTypes.SET_USER_INFO, user);
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
        if (error.code == "UserNotConfirmedException") {
          commit(mutationTypes.SIGNUP_STEP, signupSteps.verify);
          commit(mutationTypes.SET_SIGNUP_EMAIL, username);
          dispatch(
            "navigation/redirect",
            { target: { name: "signup" } },
            { root: true }
          );
        }
      })
      .finally(() => {
        dispatch("setLoading", { loading: false });
      });
  },

  async logout({ commit, dispatch }) {
    dispatch("setLoading", { loading: true });
    Auth.signOut()
      .then(() => {
        commit(mutationTypes.SET_USER_INFO, null);
        Toast.open({
          message: "Logged out, bye! 👋",
          type: "is-success",
        });
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
    signupStep: (state) => state.signupStep,
    signupEmail: (state) => state.signupEmail,
    signupUserId: (state) => state.signupUserId,
    loggedIn: (state) => Boolean(state.userInfo.username),
    user: (state) => state.userInfo,
  },
  mutations,
  actions,
  mutationTypes,
};
export default auth;
