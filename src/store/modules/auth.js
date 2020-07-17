// import axios from "axios";
import { ToastProgrammatic as Toast } from 'buefy'
import { successMessage, errorMessage, notifyException, infoMessage } from "../../utils/notificationUtils";
import Amplify, { Auth } from 'aws-amplify';
import awsconfig from "../../aws-exports";
Amplify.configure(awsconfig);

const AUTH_KEYS = {
  META: "authMetaData",
  USER: "LastAuthUser",
  USER_DATA: "userData"
};

let userInfo = { email: "", userId: "", email_verified: false };
const localLoad = (key, defaultValue = null) => JSON.parse(localStorage.getItem(key)) || defaultValue;
const localSave = (key, value) => localStorage.setItem(key, JSON.stringify(value));

const authMeta = localLoad(AUTH_KEYS.META);
if (authMeta) {
  try {
    // There has been a login -> Load from Local Storage
    let userId = localStorage.getItem(authMeta.userKey);
    const userData = localLoad(authMeta.userDataKey);
    userInfo = {
      userId,
      email_verified: Boolean(userData.UserAttributes.find(
        (attr) => attr.Name == "email_verified"
      ).Value),
      email: userData.UserAttributes.find((attr) => attr.Name == "email").Value,
    };
  } catch (error) {
    errorMessage("Error while loading user data from localStorage", error);
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
      state.userInfo = { userId: "", email: "", email_verified: false };
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
      state.userInfo = { email, userId: username, email_verified };
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
  setSignupStep({ commit }, { step }) {
    commit(mutationTypes.SIGNUP_STEP, step);
  },
  setUser({ commit }, { user }) {
    commit(mutationTypes.SET_USER_INFO, user);
  },
  async signUp({ commit, dispatch }, { email, password, attributes = {} }) {
    dispatch("setLoading", { loading: true });
    try {
      commit(mutationTypes.SET_SIGNUP_EMAIL, email);
      const result = await Auth.signUp({
        username: email,
        password,
        attributes,
      });
      commit(mutationTypes.SET_SIGNUP_USERID, result.userSub);
      commit(mutationTypes.SIGNUP_STEP, signupSteps.verify);
    } catch (error) {
      errorMessage(error.message, error);
      if (error.code == "UsernameExistsException") {
        commit(mutationTypes.SIGNUP_STEP, signupSteps.verify);
      }
    }
    dispatch("setLoading", { loading: false });
  },

  async verifyAddress({ commit, dispatch, state }, { code, onSuccess = () => { } }) {
    dispatch("setLoading", { loading: true });
    try {
      await Auth.confirmSignUp(state.signupEmail, code);
      successMessage("Address verified");
      commit(mutationTypes.SIGNUP_STEP, signupSteps.profile);
      onSuccess();
    } catch (error) {
      notifyException(error);
    }
    dispatch("setLoading", { loading: false });
  },
  async resendVerification({ dispatch, state }) {
    dispatch("setLoading", { loading: true });
    Auth.resendSignUp(state.signupEmail)
      .then(() => {
        infoMessage("Verification message sent");
      })
      .catch(notifyException)
      .finally(() => {
        dispatch("setLoading", { loading: false });
      });
  },
  async login({ commit, dispatch }, { email, password }) {
    dispatch("setLoading", { loading: true });

    Auth.signIn(email, password)
      .then((user) => {
        commit(mutationTypes.SET_USER_INFO, user);
        commit(mutationTypes.SIGNUP_STEP, signupSteps.profile);
        successMessage(`Welcome ${user.attributes.email}`);
      })
      .catch((error) => {
        notifyException(error);
        if (error.code == "UserNotConfirmedException") {
          commit(mutationTypes.SIGNUP_STEP, signupSteps.verify);
          commit(mutationTypes.SET_SIGNUP_EMAIL, email);
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
      .catch(notifyException)
      .finally(() => {
        dispatch("setLoading", { loading: false });
      });
  },

  async changePassword({ commit }, { oldPassword, newPassword }) {
    commit(mutationTypes.SET_LOADING, true);
    Auth.currentAuthenticatedUser()
      .then((user) => {
        return Auth.changePassword(user, oldPassword, newPassword);
      })
      .then((data) => {
        successMessage("Password updated");
        console.log(data);
      })
      .catch(notifyException)
      .finally(() => {
        commit(mutationTypes.SET_LOADING, true);
      });
  },
};

const auth = {
  namespaced: true,
  state,
  getters: {
    loading: (state) => state.loading,
    signupStep: (state) => state.signupStep,
    signupEmail: (state) => state.signupEmail,
    signupUserId: (state) => state.signupUserId,
    loggedIn: (state) => Boolean(state.userInfo.userId),
    user: (state) => state.userInfo,
  },
  mutations,
  actions,
  mutationTypes,
};
export default auth;
