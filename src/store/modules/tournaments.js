// import axios from "axios";
import { ToastProgrammatic as Toast } from 'buefy'

const state = {
  loading: false,
  tournaments: [],
  wip: null,
  showTournamentForm: false,
  teams: []
};

const mutationTypes = {
  SET_LOADING: "set-loading",
  CREATE_TOURNAMENT: "create-tournament",
  UPDATE_TOURNAMENT: "update-tournament",
  SET_TOURNAMENTS: "set-tournaments",
  SET_WIP: "set-wip",
  SET_SHOW_FORM: "set-show-form",
  SET_TEAMS: "set-teams",
  ADD_TEAM: "add-team",
};

const mutations = {
  [mutationTypes.SET_LOADING](state, loading) {
    state.loading = Boolean(loading);
  },
  [mutationTypes.CREATE_TOURNAMENT](state, tournament) {
    state.tournaments.push(tournament);
    const all = JSON.parse(localStorage.getItem("tournaments"));
    const year = tournament.getYear();
    all[year] = all[year] || [];
    all[year].push(tournament);
    localStorage.setItem("tournaments", JSON.stringify(all));
  },
  [mutationTypes.UPDATE_TOURNAMENT](state, tournament) {
    const index = state.tournaments.findIndex(t => t.id === tournament.id);
    state.tournaments[index] = tournament
    const all = JSON.parse(localStorage.getItem("tournaments"));
    const year = tournament.getYear();
    all[year] = state.tournaments;
    localStorage.setItem("tournaments", JSON.stringify(all));
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
  },
  [mutationTypes.SET_WIP](state, tournament) {
    state.wip = tournament;
  },
  [mutationTypes.SET_SHOW_FORM](state, show) {
    state.showTournamentForm = Boolean(show);
  }
};

const actions = {
  setLoading({ commit }, { loading }) {
    commit(mutationTypes.SET_LOADING, loading);
  },
  setShowForm({ commit }, { show }) {
    commit(mutationTypes.SET_SHOW_FORM, show);
  },
  load: async ({ commit }, { year }) => {
    commit(mutationTypes.SET_LOADING, true);
    const all = JSON.parse(localStorage.getItem("tournaments"));
    const result = all[year] || [];
    console.log(`Found ${result.length} tournaments for ${year}`);
    commit(mutationTypes.SET_TOURNAMENTS, result);
    commit(mutationTypes.SET_LOADING, false);
  },
  loadTeams: async ({ commit }) => {
    const result = JSON.parse(localStorage.getItem("teams"));
    result.sort();
    commit(mutationTypes.SET_TEAMS, result);
  },
  addTeam: async ({ commit }, { team }) => {
    commit(mutationTypes.ADD_TEAM, team);
  },
  create: ({ commit }, { tournament }) => {
    try {
      console.log("Presisting tournament");
      commit(mutationTypes.SET_LOADING, true);
      commit(mutationTypes.CREATE_TOURNAMENT, tournament);
      commit(mutationTypes.SET_LOADING, false);
      Toast.open({
        message: `Tournament ${tournament.name} added to your ePass`,
        type: "is-success"
      });
    } catch (err) {
      Toast.open({
        message: err.message,
        type: "is-error"
      });
    }
  },
  update: ({ commit }, { tournament }) => {
    try {
      console.log("Presisting tournament");
      commit(mutationTypes.SET_LOADING, true);
      commit(mutationTypes.UPDATE_TOURNAMENT, tournament);
      commit(mutationTypes.SET_WIP, null);
      commit(mutationTypes.SET_LOADING, false);
      Toast.open({
        message: `Tournament ${tournament.name} updated`,
        type: "is-success"
      });
    } catch (err) {
      Toast.open({
        message: err.message,
        type: "is-error"
      });
    }
  },
  openForEdit: ({ commit }, { tournament }) => {
    commit(mutationTypes.SET_WIP, tournament);
    commit(mutationTypes.SET_SHOW_FORM, Boolean(tournament));
  },
};

const tournaments = {
  namespaced: true,
  state,
  getters: {
    loading: state => state.loading,
    all: state => state.tournaments,
    teams: state => state.teams,
    showForm: state => state.showTournamentForm,
    wip: state => state.wip,
    hasWip: state => Boolean(state.wip),
  },
  mutations,
  actions,
};
export default tournaments;
