import router from "../../router";

const state = {
  redirTo: {}
};
const mutationTypes = {
  REDIRECT: "redirect"
};

const mutations = {
  [mutationTypes.REDIRECT](state, target) {
    state.redirTo = target;
  }
}

const actions = {
  redirect({ commit }, { target }) {
    commit(mutationTypes.REDIRECT, target);
    router.replace({ ...target });
  }
}

const navigation = {
  namespaced: true,
  mutations,
  state,
  actions,
};
export default navigation;