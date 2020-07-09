// import axios from "axios";

const state = {
  loading: false,
  tournaments: [],
  teams: []
};

const mutationTypes = {
  SET_LOADING: "set-loading",
  CREATE_TOURNAMENT: "create-tournament",
  SET_TOURNAMENTS: "set-tournaments",
  SET_TEAMS: "set-teams",
  ADD_TEAM: "add-team",
};

const mutations = {
  [mutationTypes.SET_LOADING](state, loading) {
    state.loading = loading;
  },
  [mutationTypes.CREATE_TOURNAMENT](state, tournament) {
    state.tournaments.push(tournament);
    const all = JSON.parse(localStorage.getItem("tournaments"));
    const year = tournament.getYear();
    all[year] = all[year] || [];
    all[year].push(tournament);
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
  }
};

const actions = {
  setLoading({ commit }, { loading }) {
    commit(mutationTypes.SET_LOADING, loading);
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
      return {
        success: true,
        type: 'success',
        message: `Tournament ${tournament.name} added to your ePass`
      };
    } catch (err) {
      return {
        success: false,
        type: 'error',
        message: err.message
      };
    }
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
