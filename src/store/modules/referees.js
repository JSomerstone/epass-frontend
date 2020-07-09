// import axios from "axios";
import Referee from "../models/RefereeClass";

const state = {
  loading: false,
  referees: [],
  current: null,
};

const mutationTypes = {
  SET_LOADING: "set-loading",
  SET_REFEREES: "set-referees",
  SET_CURRENT: "set-current",
  ADD_REFEREE: "add-referee",
};

const mutations = {
  [mutationTypes.SET_LOADING](state, loading) {
    state.loading = loading;
  },
  [mutationTypes.SET_REFEREES](state, referees) {
    state.referees = referees;
    localStorage.setItem("referees", JSON.stringify(referees));
  },
  [mutationTypes.ADD_REFEREE](state, referee) {
    state.referees.push(referee);
    localStorage.setItem("referees", JSON.stringify(state.referees));
  },
  [mutationTypes.SET_CURRENT](state, referee) {
    state.current = referee;
    localStorage.setItem("currentReferee", JSON.stringify(referee));
  }
};

const actions = {
  setLoading({ commit }, { loading }) {
    commit(mutationTypes.SET_LOADING, loading);
  },
  load: async ({ commit }) => {
    commit(mutationTypes.SET_LOADING, true);
    const result = JSON.parse(localStorage.getItem("referees"));
    commit(mutationTypes.SET_REFEREES, result);
    // Remove when authentication is implemented
    commit(mutationTypes.SET_CURRENT, new Referee(result[282]));
    commit(mutationTypes.SET_LOADING, false);
  },
  create: ({ commit, dispatch }, { referee }) => {
    commit(mutationTypes.SET_LOADING, true);
    commit(mutationTypes.ADD_REFEREE, referee);
    dispatch("load");
    commit(mutationTypes.SET_LOADING, false);
  }
};

const referees = {
  namespaced: true,
  state,
  getters: {
    loading: state => state.loading,
    all: state => state.referees,
    current: state => state.current,
    search: (state) => (query) => {
      const all = state.referees;
      return query == "" ? all : all.filter(
        ref => {
          const { firstName, lastName, country, email = "" } = ref;
          const match = [firstName, lastName, country, email].find(
            prop => prop.toLowerCase().includes(query.toString().toLowerCase())
          )
          return Boolean(match);
        }
      ).sort( (r0, r1) => r0.firstName > r1.firstName )
    },
    byId: (state) => (id) => {
      return state.referees.find(
        r => r.id === id
      )
    }
  },
  mutations,
  actions,
};
export default referees;
