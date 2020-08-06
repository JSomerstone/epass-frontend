// import axios from "axios";
import { ToastProgrammatic as Toast } from 'buefy'
import { successMessage, errorMessage, notifyException, infoMessage } from "../../utils/notificationUtils";
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
  debug: false,
  loading: false,
  userInfo: { email: "", userId: "", email_verified: false },
  signupStep: signupSteps.auth,
  signupEmail: "",
  signupUserId: "",
};

Auth.currentAuthenticatedUser()
  .then(user => {
    state.userInfo = {
      userId: user.username,
      email_verified: user.attributes.email_verified,
      email: user.attributes.email
    };
  })
  .catch(err => errorMessage("Unable to get current user", err));

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
    } else {
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
  async signUp(
    { commit, dispatch },
    { email, password, attributes = {}, onSuccess = () => { }, onFailure = () => { } }
  ) {
    dispatch("setLoading", { loading: true });
    try {
      commit(mutationTypes.SET_SIGNUP_EMAIL, email);
      const result = await Auth.signUp({
        username: email,
        password,
        attributes,
      });
      onSuccess(result);
      commit(mutationTypes.SET_SIGNUP_USERID, result.userSub);
    } catch (error) {
      notifyException(error);
      onFailure(error);
    }
    dispatch("setLoading", { loading: false });
  },

  async verifyAddress(
    { dispatch, state },
    { code, onSuccess = () => {} }
  ) {
    dispatch("setLoading", { loading: true });
    try {
      await Auth.confirmSignUp(state.signupEmail, code);
      successMessage("Address verified");
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
  async login({ commit, dispatch }, { email, password, onSuccess = () => {} }) {
    dispatch("setLoading", { loading: true });

    Auth.signIn(email, password)
      .then((user) => {
        successMessage(`Welcome ${user.attributes.email}`);
        commit(mutationTypes.SET_USER_INFO, user);
        onSuccess(user);
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
      .then(() => {
        successMessage("Password updated");
      })
      .catch(notifyException)
      .finally(() => {
        commit(mutationTypes.SET_LOADING, false);
      });
  },

  async changeEmail({ commit }, { email, onSuccess = () => {} }) {
    commit(mutationTypes.SET_LOADING, true);
    let user = await Auth.currentAuthenticatedUser();
    Auth.updateUserAttributes(user, { email })
      .then(onSuccess)
      .catch(notifyException)
      .finally(() => {
        commit(mutationTypes.SET_LOADING, false);
      });
  },

  async verifyEmailChange(
    { commit },
    { verificationCode, onSuccess = () => {} }
  ) {
    commit(mutationTypes.SET_LOADING, true);
    Auth.verifyCurrentUserAttributeSubmit("email", verificationCode)
      .then(onSuccess)
      .catch(notifyException)
      .finally(() => {
        commit(mutationTypes.SET_LOADING, false);
      });
  },
  
  async forgotPassword({ commit }, { email, onSuccess = () => {} }) {
    commit(mutationTypes.SET_LOADING, true);
    Auth.forgotPassword(email)
      .then(onSuccess)
      .catch(notifyException)
      .finally(() => commit(mutationTypes.SET_LOADING, false));
  },

  async forgotPasswordConfirm(
    { commit },
    { email, code, newPassword, onSuccess = () => { } }
  ) {
    commit(mutationTypes.SET_LOADING, true);
    Auth.forgotPasswordSubmit(email, code, newPassword)
      .then(onSuccess)
      .catch(notifyException)
      .finally(() => commit(mutationTypes.SET_LOADING, false));
  },
};

const auth = {
  namespaced: true,
  state,
  getters: {
    loading: (state) => state.loading,
    signupOngoing: state => state.signupStep > 0 && state.signupStep < signupSteps.done,
    signupStep: (state) => state.signupStep,
    signupEmail: (state) => state.signupEmail,
    signupUserId: (state) => state.signupUserId,
    loggedIn: (state) => Boolean(state.userInfo.userId),
    user: (state) => state.userInfo,
    debug: state => state.debug
  },
  mutations,
  actions,
  mutationTypes,
};
export default auth;
