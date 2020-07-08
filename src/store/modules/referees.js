// import axios from "axios";
import Referee from "../models/RefereeClass";

const state = {
  loading: false,
  referees: [],
};

const mutationTypes = {
  SET_LOADING: "set-loading",
  SET_REFEREES: "set-referees",
};

const mutations = {
  [mutationTypes.SET_LOADING](state, loading) {
    state.loading = loading;
  },
  [mutationTypes.SET_REFEREES](state, referees) {
    state.referees = referees;
  }
};

const actions = {
  setLoading({ commit }, { loading }) {
    commit(mutationTypes.SET_LOADING, loading);
  },
  load: async ({ commit }) => {
    commit(mutationTypes.SET_LOADING, true);
    console.log("Loading referees from backend");
    const result = JSON.parse(localStorage.getItem("referees"));
    console.log(`Found ${result.length} referees`);
    commit(mutationTypes.SET_REFEREES, result);
    commit(mutationTypes.SET_LOADING, false);
  },
  create: ({ commit, dispatch }, { referee }) => {
    commit(mutationTypes.SET_LOADING, true);
    const ref = new Referee(referee);
    console.log("creating new ref", ref);
    const all = JSON.parse(localStorage.getItem("referees"));
    all.push(ref);
    localStorage.setItem("referees", JSON.stringify(all));
    dispatch("referees/load");
    commit(mutationTypes.SET_LOADING, false);
  }
};

const referees = {
  namespaced: true,
  state,
  getters: {
    loading: state => state.loading,
    all: state => state.referees,
    search: (state) => (query) => {
      const all = state.referees;
      return query == "" ? all : all.filter(
        ref => {
          const { firstName, lastName, country } = ref;
          const match = [firstName, lastName, country].find(
            prop => prop.toLowerCase().includes(query)
          )
          return Boolean(match);
        }
      )
    }
  },
  mutations,
  actions,
};
export default referees;
