// import axios from "axios";
import { listTournaments, getTournament } from "../../graphql/queries";
import { API } from "aws-amplify";
import { createTournament, updateTournament } from '../../graphql/mutations';
import { notifyException, successMessage } from '../../utils/notificationUtils';
//import Tournament from '../models/Tournament';


const state = {
  loading: false,
  tournaments: [],
  filteredTournaments: [],
  filter: { show: "own" },
  wip: null,
  showTournamentForm: false,
  teams: [],
  debug: false
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
    state.teams.sort();
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
  load: async ({ commit, dispatch, state }, { year, force = false }) => {
    if (state.tournaments.length && state.tournaments[0].year == year && !force) {
      return;
    }
    commit(mutationTypes.SET_LOADING, true);
    try {
      const result = await API.graphql({
        query: listTournaments,
        variables: {
          filter: {
            year: { eq: year },
          },
        },
      });
      const tournaments = result.data.listTournaments.items;
      commit(mutationTypes.SET_TOURNAMENTS, tournaments);
      dispatch("filter");
    } catch (error) {
      notifyException(error);
    }
    commit(mutationTypes.SET_LOADING, false);
  },
  loadTournament: ({ commit }, { id, onSuccess = () => {} }) => {
    commit(mutationTypes.SET_LOADING, true);
    API.graphql({
      query: getTournament,
      variables: { id },
    })
      .then((result) => {
        commit(mutationTypes.SET_WIP, result.data.getTournament);
        onSuccess(result.data.getTournament);
      })
      .catch(notifyException)
      .finally(() => {
        commit(mutationTypes.SET_LOADING, false);
      });
  },
  filter: ({ commit, rootGetters, state }) => {
    commit(mutationTypes.SET_LOADING, true);
    if (state.filter.show == "all") {
      commit(mutationTypes.SET_FILTERED, state.tournaments);
    } else {
      const { id = null } = rootGetters["referees/current"];
      const result = state.tournaments.filter((t) => {
        let found = t.referees.find((r) => r.id == id);
        return t.td == id || found;
      });
      commit(mutationTypes.SET_FILTERED, result);
    }
    commit(mutationTypes.SET_LOADING, false);
  },
  loadTeams: async ({ commit }) => {
    const result = JSON.parse(localStorage.getItem("teams") || "[]");
    result.sort();
    commit(mutationTypes.SET_TEAMS, result);
  },
  addTeam: async ({ commit, state }, { team }) => {
    const existing = Boolean(
      state.teams.find(old => old.toLowerCase() == team.toLowerCase()),
    );
    if (!existing) {
      commit(mutationTypes.ADD_TEAM, team);
    }
  },
  create: async ({ commit, dispatch }, { tournament, onSuccess = () => { } }) => {
    commit(mutationTypes.SET_LOADING, true);
    try {
      const result = await API.graphql({
        query: createTournament,
        variables: { input: tournament.toJson() },
      });
      commit(mutationTypes.NEW_TOURNAMENT, result.data.createTournament);
      successMessage("Tournament saved");
      dispatch("load", { year: tournament.year });
      onSuccess(result.data.createTournament);
    } catch (err) {
      notifyException(err);
    }
    commit(mutationTypes.SET_LOADING, false);
  },
  update: async ({ commit, dispatch }, { tournament, onSuccess = () => { } }) => {
    commit(mutationTypes.SET_LOADING, true);
    try {
      const result = await API.graphql({
        query: updateTournament,
        variables: { input: tournament.toJson() },
      });
      commit(mutationTypes.UPDATE_TOURNAMENT, result.data.updateTournament);
      commit(mutationTypes.SET_WIP, null);
      dispatch("load", { year: tournament.year });
      successMessage("Tournament updated");
      onSuccess(result.data.updateTournament);
    } catch (err) {
      notifyException(err);
    }
    commit(mutationTypes.SET_LOADING, false);
  },
  setFilter: ({ commit, dispatch }, { filter }) => {
    commit(mutationTypes.SET_FILTER, filter);
    dispatch("filter");
  },
  reset: ({ commit }) => {
    commit(mutationTypes.SET_TOURNAMENTS, []);
    commit(mutationTypes.SET_FILTERED, []);
    commit(mutationTypes.SET_WIP, {});
  },
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
    debug: state => state.debug,
  },
  mutations,
  actions,
};
export default tournaments;
