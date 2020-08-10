import Referee from "../models/RefereeClass";
import Association from "../models/Association";
import { successMessage, notifyException, warningMessage } from "../../utils/notificationUtils";
import { createReferee, updateReferee, createAssociation, updateAssociation } from "../../graphql/mutations";
import { listReferees, getReferee, listAssociations } from "../../graphql/queries";
import { API } from "aws-amplify";
const courseConductors = require("../../assets/course-conductors.json");

const state = {
  loading: 0,
  referees: [],
  queryResult: [],
  current: {},
  conductors: courseConductors,
  associations: [],
  debug: false,
};

const mutationTypes = {
  SET_LOADING: "set-loading",
  SET_REFEREES: "set-referees",
  ADD_REFEREE: "add-referee",
  UPDATE_REFEREE: "update-referee",
  SET_CURRENT: "set-current",
  SET_ASSOCIATIONS: "set-associations",
  ADD_ASSOCIATION: "add-association",
  UPDATE_ASSOCIATION: "update-association",
  QUERY_RESULT: "set-query-result",
};

const mutations = {
  [mutationTypes.SET_LOADING](state, loading) {
    state.loading = state.loading + (loading ? 1 : -1);
    if (state.loading < 0) {
      state.loading = 0;
    }
  },
  [mutationTypes.SET_REFEREES](state, referees) {
    state.referees = referees;
  },
  [mutationTypes.SET_ASSOCIATIONS](state, list) {
    state.associations = list;
  },
  [mutationTypes.ADD_ASSOCIATION](state, item) {
    state.associations.push(item);
  },
  [mutationTypes.UPDATE_ASSOCIATION](state, item) {
    const index = state.associations.find(r => r.id == item.id);
    state.associations[index] = item;
  },
  [mutationTypes.ADD_REFEREE](state, referee) {
    state.referees.push(referee);
  },
  [mutationTypes.UPDATE_REFEREE](state, referee) {
    const index = state.referees.find(r => r.id == referee.id);
    state.referees[index] = referee;
  },
  [mutationTypes.SET_CURRENT](state, referee) {
    state.current = new Referee(referee);
  },
  [mutationTypes.QUERY_RESULT](state, refereeList) {
    state.queryResult = refereeList;
  },
};

const actions = {
  setLoading({ commit }, { loading }) {
    commit(mutationTypes.SET_LOADING, loading);
  },

  setCurrent: async ({ commit }, { id }) => {
    API.graphql({
      query: getReferee,
      variables: { id },
    })
      .then(
        result => {
          const referee = result.data.getReferee;
          commit(mutationTypes.SET_CURRENT, referee);
        }
      )
      .catch(notifyException)
      .finally(() => {
        commit(mutationTypes.SET_LOADING, false);
      });
  },
  load: async ({ commit }) => {
    commit(mutationTypes.SET_LOADING, true);
    API.graphql({
      query: listReferees,
    }).then(
      result => {
        const referees = result.data.listReferees.items;
        commit(mutationTypes.SET_REFEREES, referees);
      }
    )
      .catch(notifyException)
      .finally( () => { commit(mutationTypes.SET_LOADING, false); }
    );
  },
  loadCurrent: async (
    { commit, rootGetters },
    { onSuccess = () => { }, onFailure = () => { } }
  ) => {
    const { userId = null } = rootGetters["auth/user"];
    if (null == userId) {
      warningMessage("Unable to load user profile");
      onFailure();
      return;
    }
    commit(mutationTypes.setLoading, true);
    API.graphql({
      query: listReferees,
      variables: {
        filter: {
          userId: { eq: userId },
        },
      },
    }).then(
      result => {
        const { items } = result.data.listReferees;
        console.log({ items });
        if (items.length == 0) {
          onFailure();
        } else {
          commit(mutationTypes.SET_CURRENT, items[0]);
          onSuccess(items[0]);
        }
      }
    )
      .catch(notifyException)
      .finally(() => {
        commit(mutationTypes.setLoading, false)
      });
  },
  create: async ({ commit, dispatch }, { referee, onSuccess = () => {} }) => {
    commit(mutationTypes.SET_LOADING, true);
    delete referee.clinic;
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
      dispatch('setCurrent', result.data.updateReferee);
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
        onSuccess(referees);
        commit(mutationTypes.QUERY_RESULT, referees);
      })
      .catch(notifyException)
      .finally(() => {
        commit(mutationTypes.SET_LOADING, false);
      });
  },
  async loadAssociations({ commit }) {
    commit(mutationTypes.SET_LOADING, true);
    API.graphql({
      query: listAssociations
    }).then(result => {
      commit(mutationTypes.SET_ASSOCIATIONS, result.data.listAssociations.items)
    }).catch(notifyException)
      .finally(() => {
        commit(mutationTypes.SET_LOADING, false);
    })
  },
  async createAssociation({ commit }, { association, onSuccess = () => { } }) {
    commit(mutationTypes.SET_LOADING, true);
    delete association.id;
    API.graphql({
        query: createAssociation,
        variables: {  input: new Association(association) }
    }).then(result => {
      onSuccess(result.data.createAssociation);
      commit(mutationTypes.ADD_ASSOCIATION, result.data.createAssociation);
    }).catch(notifyException)
    .finally(() => {
      commit(mutationTypes.SET_LOADING, false);
    });
  },
  async updateAssociation({ commit }, { association, onSuccess = () => { } }) {
    commit(mutationTypes.SET_LOADING, true);
    API.graphql({
        query: updateAssociation,
        variables: { input: new Association(association) }
      }).then(result => {
        onSuccess(result.data.updateAssociation);
        commit(mutationTypes.UPDATE_ASSOCIATION, result.data.updateAssociation);
      })
      .catch(notifyException)
      .finally(() => {
        commit(mutationTypes.SET_LOADING, false);
      });
  },
  reset({ commit }) {
    commit(mutationTypes.SET_REFEREES, []);
    commit(mutationTypes.SET_CURRENT, {});
    commit(mutationTypes.SET_ASSOCIATIONS, []);
  }
};

const referees = {
  namespaced: true,
  state,
  getters: {
    debug: (state) => state.debug,
    loading: (state) => state.loading > 0,
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
    conductors: state => state.conductors,
    nationalAssociations: state => state.associations,
    association: (state) => (id) => {
      return state.associations.find((r) => r.id === id);
    },
    associationCountry: (state) => (country) => {
      return state.associations.filter(
        a => a.country.toLowerCase().includes(country.toLowerCase())
      );
    }
  },
  mutations,
  actions,
};
export default referees;
