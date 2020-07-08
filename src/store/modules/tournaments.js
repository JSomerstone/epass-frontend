import axios from "axios";
const state = {
  loading: false,
  tournaments: [],
};

const mutationTypes = {
  SET_LOADING: "set-loading",
  SET_TOURNAMENTS: "set-tournaments",
};

const mutations = {
  [mutationTypes.SET_LOADING](state, loading) {
    state.loading = loading;
  },
  [mutationTypes.SET_TOURNAMENTS](state, tournaments) {
    state.tournaments = tournaments;
  }
};

const actions = {
  setLoading({ commit }, { loading }) {
    commit(mutationTypes.SET_LOADING, loading);
  },
  load: async ({ commit }, { year }) => {
    commit(mutationTypes.SET_LOADING, true);
    console.log("Getting tournaments from backend");
    axios({
      method: 'get',
      url: `/tournaments/${year}`
    })
      .then(function (response) {
        console.log(response.data);
        commit(mutationTypes.SET_TOURNAMENTS, response.data)
      })
      .finally(() => {
        commit(mutationTypes.SET_LOADING, false);
      });
  }
};

const tournaments = {
  namespaced: true,
  state,
  getters: {
    loading: state => state.loading,
    all: state => state.tournaments
  },
  mutations,
  actions,
};
export default tournaments;
