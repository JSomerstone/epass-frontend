// import axios from "axios";
import { ToastProgrammatic as Toast } from 'buefy'
import { v4 as uuidv4 } from "uuid";
import { listTournaments } from "../../graphql/queries";
import { API } from "aws-amplify";
import { createTournament } from '../../graphql/mutations';
//import Tournament from '../models/Tournament';


const notifyError = (error) => {
  if (error.message) {
    Toast.open({
      message: error.message,
      type: "is-danger"
    });
  } else if (error.errors) {
    for (let { message } of error.errors) {
      Toast.open({ message, type: "is-danger" });
    }
  }
}

const state = {
  loading: false,
  tournaments: [],
  wip: null,
  showTournamentForm: false,
  teams: []
};

const mutationTypes = {
  SET_LOADING: "set-loading",
  NEW_TOURNAMENT: "create-tournament",
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
  [mutationTypes.NEW_TOURNAMENT](state, tournament) {
    state.tournaments.push(tournament);
  },
  [mutationTypes.UPDATE_TOURNAMENT](state, tournament) {
    const index = state.tournaments.findIndex(t => t.id === tournament.id);
    state.tournaments[index] = tournament
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
  load: async ({ commit }, { year }) => {
    commit(mutationTypes.SET_LOADING, true);
    try {
      const result = await API.graphql({
        query: listTournaments,
        filter: { year }
      });
      console.log("tournaments/load", { ...result });
      const tournaments = result.data.listTournaments.items.map((r) => {
        return { ...r };
      });
      commit(mutationTypes.SET_TOURNAMENTS, tournaments);
    } catch (error) {
      console.log("tournaments/load", error);
      notifyError(error);
    }
    commit(mutationTypes.SET_LOADING, false);
  },
  loadTeams: async ({ commit }) => {
    const result = JSON.parse(localStorage.getItem("teams") || "[]");
    result.sort();
    commit(mutationTypes.SET_TEAMS, result);
  },
  addTeam: async ({ commit }, { team }) => {
    commit(mutationTypes.ADD_TEAM, team);
  },
  create: async ({ commit }, { tournament }) => {
    commit(mutationTypes.SET_LOADING, true);
    try {
      const result = await API.graphql({
        query: createTournament,
        variables: { input: tournament.toJson() },
      });
      console.log("tournaments/create", { ...result });
      commit(mutationTypes.NEW_TOURNAMENT, result.data.createTournament);
      Toast.open({
        message: `Tournament created`,
        type: "is-success"
      });
    } catch (err) {
      console.log("tournaments/create", err);
      notifyError(err);
    }
    commit(mutationTypes.SET_LOADING, false);
  },
  update: ({ commit, dispatch }, { tournament }) => {
    try {
      commit(mutationTypes.SET_LOADING, true);
      commit(mutationTypes.UPDATE_TOURNAMENT, tournament);
      commit(mutationTypes.SET_WIP, null);
      dispatch("load", { year: tournament.getYear() });
      Toast.open({
        message: `Tournament ${tournament.name} updated`,
        type: "is-success"
      });
    } catch (err) {
      Toast.open({
        message: err.message,
        type: "is-danger"
      });
    }
  }
};

const tournaments = {
  namespaced: true,
  state,
  getters: {
    loading: state => state.loading,
    all: state => state.tournaments,
    byId: state => id => state.tournaments.find( t => t.id == id ),
    teams: state => state.teams,
    showForm: state => state.showTournamentForm,
    wip: state => state.wip,
    hasWip: state => Boolean(state.wip),
  },
  mutations,
  actions,
};
export default tournaments;
