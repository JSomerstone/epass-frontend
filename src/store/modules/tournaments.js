// import axios from "axios";
import Tournament from "../models/Tournament";

const state = {
  loading: false,
  tournaments: [],
  teams: []
};

const mutationTypes = {
  SET_LOADING: "set-loading",
  SET_TOURNAMENTS: "set-tournaments",
  SET_TEAMS: "set-teams",
  ADD_TEAM: "add-team",
};

const mutations = {
  [mutationTypes.SET_LOADING](state, loading) {
    state.loading = loading;
  },
  [mutationTypes.SET_TOURNAMENTS](state, tournaments) {
    state.tournaments = tournaments;
  },
  [mutationTypes.SET_TEAMS](state, list) {
    state.teams = list;
  },
  [mutationTypes.ADD_TEAM](state, team) {
    state.teams.push(team);
    localStorage.setItem("teams", JSON.stringify(state.teams));
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
  loadTeams: async ({ commit }) => {
    const result = JSON.parse(localStorage.getItem("teams"));
    result.sort();
    console.log(`Got ${result.length} teams`);
    commit(mutationTypes.SET_TEAMS, result);
  },
  addTeam: async ({ commit }, { team }) => {
    console.log("trying to add ", team);
    commit(mutationTypes.ADD_TEAM, team);
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
    all: state => state.tournaments,
    teams: state => state.teams,
  },
  mutations,
  actions,
};
export default tournaments;
