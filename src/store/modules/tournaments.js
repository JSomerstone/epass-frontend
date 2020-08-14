import { listTournaments, getTournament } from "../../graphql/queries";
import { API } from "aws-amplify";
import { createTournament, updateTournament, createComment, deleteComment, deleteTournament } from '../../graphql/mutations';
import { notifyException, successMessage, warningMessage } from '../../utils/notificationUtils';


const state = {
  loading: false,
  tournaments: [],
  filteredTournaments: [],
  selectedTournaments: [],
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
  SET_SELECTED_TOURNAMENTS: "set-selected-tournaments",
  SET_WIP: "set-wip",
  SET_SHOW_FORM: "set-show-form",
  SET_TEAMS: "set-teams",
  ADD_TEAM: "add-team",
  ADD_COMMENT: "add-comment",
  DELETE_COMMENT: "delete-comment",
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
    state.tournaments[index] = tournament;
  },
  [mutationTypes.SET_TOURNAMENTS](state, tournaments) {
    state.tournaments = tournaments;
  },
  [mutationTypes.SET_SELECTED_TOURNAMENTS](state, tournaments) {
    state.selectedTournaments = tournaments;
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
  [mutationTypes.ADD_COMMENT](state, comment) {
    console.log({ wip: state.wip, comment });
  },
  [mutationTypes.DELETE_COMMENT](state, comment) {
    const index = state.wip.comments.findIndex(
      c => c.id == comment.id
    );
    state.wip.comments.splice(index, 1);
  },
  [mutationTypes.SET_WIP](state, tournament) {
    state.wip = tournament;
  },
  [mutationTypes.SET_SHOW_FORM](state, show) {
    state.showTournamentForm = Boolean(show);
  },
  [mutationTypes.SET_FILTER](state, show) {
    state.filter = show;
  },
};

const actions = {
  setLoading({ commit }, { loading }) {
    commit(mutationTypes.SET_LOADING, loading);
  },
  addComment: async ({ commit }, { comment, onSuccess = () => { } } ) => {
    API.graphql({
      query: createComment,
      variables: { input: comment },
    })
      .then(result => {
        commit(mutationTypes.ADD_COMMENT, result.data.createComment);
        console.log({ action: 'AddComment', ...result.data.createComment });
        onSuccess(result.data.createComment);
      })
      .catch(notifyException);
  },
  deleteComment: async ({ commit }, { id, onSuccess = () => { } }) => {
    commit(mutationTypes.SET_LOADING, true);
    API.graphql({
      query: deleteComment,
      variables: { input: { id } },
    })
      .then(result => {
        console.log({ action: 'RemoveComment', ...result.data });
        onSuccess(result);
      })
      .catch(notifyException)
      .finally(() => commit(mutationTypes.SET_LOADING, false));
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
  loadRefereesTournaments: async ({ commit }, { refereeId, year }) => {
    commit(mutationTypes.SET_LOADING, true);
    API.graphql({
      query: listTournaments,
      variables: {
        filter: { year: { eq: year } },
      },
    })
      .then(
        result => result.data.listTournaments.items.filter(
          t => t.td == refereeId || t.referees.find(r => r.id == refereeId)
        )
      )
      .then(
        tournaments => commit(mutationTypes.SET_SELECTED_TOURNAMENTS, tournaments)
    )
      .catch(notifyException)
      .finally(() => commit(mutationTypes.SET_LOADING, false));
  },
  loadTournament: ({ commit }, { id, onSuccess = () => {}, onFailure = () => {} }) => {
    commit(mutationTypes.SET_LOADING, true);
    API.graphql({
      query: getTournament,
      variables: { id },
    })
      .then((result) => {
        if (!result.data.getTournament) {
          throw { message: "Tournament not found!" };
        }
        commit(mutationTypes.SET_WIP, result.data.getTournament);
        onSuccess(result.data.getTournament);
      })
      .catch(e => {
        notifyException(e);
        onFailure();
      })
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
  create: async ({ commit, dispatch, rootGetters }, { tournament, onSuccess = () => { } }) => {
    commit(mutationTypes.SET_LOADING, true);
    try {
      tournament.createdBy = rootGetters["referees/current"].id || null;
      const { comments } = tournament;
      delete tournament.comments;
      const result = await API.graphql({
        query: createTournament,
        variables: { input: tournament.toJson() },
      });
      const { id } = result.data.createTournament;
      commit(mutationTypes.NEW_TOURNAMENT, result.data.createTournament);
      successMessage("Tournament saved");
      dispatch("load", { year: tournament.year, force: true });
      comments.items.forEach(comment => {
        dispatch("addComment", {
          comment: { ...comment, commentTournamentId: id }
        });
      });
      onSuccess(result.data.createTournament);
    } catch (err) {
      notifyException(err);
    }
    commit(mutationTypes.SET_LOADING, false);
  },
  update: async ({ commit, dispatch , rootGetters}, { tournament, onSuccess = () => { } }) => {
    commit(mutationTypes.SET_LOADING, true);
    try {
      if (!tournament.createdBy) {
        tournament.createdBy = rootGetters["referees/current"].id || null;
      }
      const result = await API.graphql({
        query: updateTournament,
        variables: { input: tournament.toJson() },
      });
      commit(mutationTypes.UPDATE_TOURNAMENT, result.data.updateTournament);
      commit(mutationTypes.SET_WIP, null);
      dispatch("load", { year: tournament.year, force: true });
      successMessage("Tournament updated");
      onSuccess(result.data.updateTournament);
    } catch (err) {
      notifyException(err);
    }
    commit(mutationTypes.SET_LOADING, false);
  },
  delete: async ({ commit, dispatch, rootGetters }, { tournament, onSuccess = () => { } }) => {
    const { id, year, createdBy, td } = tournament;
    const refereeId = rootGetters["referees/current"].id || false;
    if (createdBy !== refereeId && td !== refereeId) {
      warningMessage("Only original creator or TD can delete a tournament");
      return;
    }
    commit(mutationTypes.SET_LOADING, true);
    API.graphql({
      query: deleteTournament,
      variables: { input: { id } },
    }).then(
      result => {
        dispatch("load", { year, force: true });
        onSuccess(result);
      }
    )
      .catch(notifyException)
      .finally(() => commit(mutationTypes.SET_LOADING, false));
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
    refereesTournaments: state => state.selectedTournaments,
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
