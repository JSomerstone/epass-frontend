import { successMessage, notifyException } from "../../utils/notificationUtils";
import { createReferee, updateReferee } from "../../graphql/mutations";
import { listReferees } from "../../graphql/queries";
import { API } from "aws-amplify";

const state = {
  loading: false,
  referees: [],
  queryResult: [],
  current: {},
};

const mutationTypes = {
  SET_LOADING: "set-loading",
  SET_REFEREES: "set-referees",
  SET_CURRENT: "set-current",
  QUERY_RESULT: "set-query-result",
  ADD_REFEREE: "add-referee",
  UPDATE_REFEREE: "update-referee",
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
  [mutationTypes.UPDATE_REFEREE](state, referee) {
    const index = state.referees.find(r => r.id == referee.id);
    state.referees[index] = referee;
    localStorage.setItem("referees", JSON.stringify(state.referees));
  },
  [mutationTypes.SET_CURRENT](state, referee) {
    state.current = referee;
    localStorage.setItem("currentReferee", JSON.stringify(referee));
  },
  [mutationTypes.QUERY_RESULT](state, refereeList) {
    state.queryResult = refereeList;
  },
};

const actions = {
  setLoading({ commit }, { loading }) {
    commit(mutationTypes.SET_LOADING, loading);
  },

  setCurrent({ commit }, { referee }) {
    commit(mutationTypes.SET_CURRENT, referee);
  },
  load: async ({ commit, rootGetters }) => {
    commit(mutationTypes.SET_LOADING, true);
    const result = await API.graphql({
      query: listReferees,
    });
    const referees = result.data.listReferees.items.map((r) => {
      return { ...r };
    });
    commit(mutationTypes.SET_REFEREES, referees);
    const { userId = null } = rootGetters["auth/user"];
    const currentReferee = referees.find((r) => r.userId == userId) || {};
    commit(mutationTypes.SET_CURRENT, currentReferee);
    commit(mutationTypes.SET_LOADING, false);
  },
  create: async ({ commit, dispatch }, { referee, onSuccess = () => {} }) => {
    commit(mutationTypes.SET_LOADING, true);
    try {
      const result = await API.graphql({
        query: createReferee,
        variables: { input: referee },
      });
      commit(mutationTypes.ADD_REFEREE, result.data.createReferee);
      successMessage("Referee added");
      onSuccess(result.data.createReferee);
      dispatch("load");
    } catch (err) {
      notifyException(err);
    }
    commit(mutationTypes.SET_LOADING, false);
  },
  async update({ commit, dispatch }, { referee, onSuccess = () => {} }) {
    try {
      const result = await API.graphql({
        query: updateReferee,
        variables: {
          input: referee,
        },
      });
      commit(mutationTypes.UPDATE_REFEREE, result.data.updateReferee);
      onSuccess(result.data.updateReferee);
      successMessage("Updated");
      dispatch("load");
    } catch (err) {
      notifyException(err);
    }
  },
  async findByEmail({ commit }, { email, onSuccess = () => {} }) {
    commit(mutationTypes.SET_LOADING, true);
    API.graphql({
      query: listReferees,
      variables: {
        filter: {
          email: { eq: email },
        },
      },
    })
      .then((result) => {
        const referees = result.data.listReferees.items.map((r) => {
          return { ...r };
        });
        console.log("findByEmail", referees);
        onSuccess(referees);
        commit(mutationTypes.QUERY_RESULT, referees);
      })
      .catch(notifyException)
      .finally(() => {
        commit(mutationTypes.SET_LOADING, false);
      });
  },
};

const referees = {
  namespaced: true,
  state,
  getters: {
    loading: (state) => state.loading,
    all: (state) => state.referees,
    current: (state) => state.current,
    search: (state) => (query) => {
      const all = state.referees;
      return query == ""
        ? all
        : all
            .filter((ref) => {
              const { firstName, lastName, country, email = "" } = ref;
              const match = [firstName, lastName, country, email].find((prop) =>
                prop.toLowerCase().includes(query.toString().toLowerCase())
              );
              return Boolean(match);
            })
            .sort((r0, r1) => r0.firstName > r1.firstName);
    },
    byId: (state) => (id) => {
      return state.referees.find((r) => r.id === id);
    },

    byUserId: (state) => (userId) => {
      return state.referees.find((r) => r.userId === userId);
    },
  },
  mutations,
  actions,
};
export default referees;
