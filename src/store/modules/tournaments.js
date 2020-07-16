// import axios from "axios";
import { ToastProgrammatic as Toast } from 'buefy'
import { v4 as uuidv4 } from "uuid";
import { listTournaments } from "../../graphql/queries";
import { API } from "aws-amplify";
import { createTournament, updateTournament } from '../../graphql/mutations';
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
  filteredTournaments: [],
  filter: { show: "own" },
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
  SET_FILTER: "set-filter",
  SET_FILTERED: "set-filtered",
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
  [mutationTypes.SET_FILTERED](state, tournaments) {
    state.filteredTournaments = tournaments;
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
  },
  [mutationTypes.SET_FILTER](state, show) {
    state.filter = show;
  }
};

const actions = {
  setLoading({ commit }, { loading }) {
    commit(mutationTypes.SET_LOADING, loading);
  },
  load: async ({ commit, dispatch }, { year }) => {
    commit(mutationTypes.SET_LOADING, true);
    try {
      const result = await API.graphql({
        query: listTournaments,
        variables: {
          filter: {
            year: { eq: year, },
          },
        }
      });
      const tournaments = result.data.listTournaments.items
      commit(mutationTypes.SET_TOURNAMENTS, tournaments);
      dispatch("filter");
    } catch (error) {
      console.log("tournaments/load", error);
      notifyError(error);
    }
    commit(mutationTypes.SET_LOADING, false);
  },
  filter: ({ commit, rootGetters, state }) => {
    commit(mutationTypes.SET_LOADING, true);
    if (state.filter.show == "all") {
      commit(mutationTypes.SET_FILTERED, state.tournaments);
    } else {
      const { id = null } = rootGetters["referees/current"];
      const result = state.tournaments.filter((t) => {
        let found = t.referees.find((r) => r.id == id);
        console.log("inside filter", {
          refs: t.referees.map((r) => r.id),
          td: t.td == id,
          found,
        });
        return t.td == id || found;
      });
      commit(mutationTypes.SET_FILTERED, result);
      commit(mutationTypes.SET_LOADING, false);
    }
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
  update: async ({ commit }, { tournament }) => {
    commit(mutationTypes.SET_LOADING, true);
    try {
      const result = await API.graphql({
        query: updateTournament,
        variables: { input: tournament.toJson() },
      });
      console.log("tournaments/update", { ...result });
      commit(mutationTypes.UPDATE_TOURNAMENT, result.data.updateTournament);
      commit(mutationTypes.SET_WIP, null);
      Toast.open({
        message: `Tournament updated`,
        type: "is-success"
      });
    } catch (err) {
      console.log("tournaments/update", err);
      notifyError(err);
    }
    commit(mutationTypes.SET_LOADING, false);
  },
  setFilter: ({ commit, dispatch }, { filter }) => {
    commit(mutationTypes.SET_FILTER, filter);
    dispatch("filter");
  }
};

const tournaments = {
  namespaced: true,
  state,
  getters: {
    loading: state => state.loading,
    all: state => state.filteredTournaments,
    byId: state => id => state.tournaments.find( t => t.id == id ),
    teams: state => state.teams,
    showForm: state => state.showTournamentForm,
    wip: state => state.wip,
    hasWip: state => Boolean(state.wip),
    filter: state => state.filter,
  },
  mutations,
  actions,
};
export default tournaments;
