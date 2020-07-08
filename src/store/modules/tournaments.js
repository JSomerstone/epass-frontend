// import axios from "axios";
import Tournament from "../models/Tournament";

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
    const all = JSON.parse(localStorage.getItem("tournaments"));
    const result = all[year] || [];
    console.log(`Found ${result.length} tournaments for ${year}`);
    commit(mutationTypes.SET_TOURNAMENTS, result);
    commit(mutationTypes.SET_LOADING, false);
  },
  create: ({ commit, dispatch }, { tournament }) => {
    console.log("creating new tournament", tournament);
    commit(mutationTypes.SET_LOADING, true);
    const event = new Tournament(tournament);
    const year = event.getYear(),
      all = JSON.parse(localStorage.getItem("tournamets"));
    all[year] = all[year] || [];
    all[year].push(event);
    localStorage.setItem("tournamets", JSON.stringify(all));
    dispatch("tournaments/load", year);
    commit(mutationTypes.SET_LOADING, false);
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
