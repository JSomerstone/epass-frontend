// import axios from "axios";
//import Referee from "../models/RefereeClass";
import { ToastProgrammatic as Toast } from 'buefy'
import { createReferee } from "../../graphql/mutations";
import { listReferees } from "../../graphql/queries";
import { API } from "aws-amplify";

const state = {
  loading: false,
  referees: [],
  current: null,
};

const mutationTypes = {
  SET_LOADING: "set-loading",
  SET_REFEREES: "set-referees",
  SET_CURRENT: "set-current",
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
  }
};

const actions = {
  setLoading({ commit }, { loading }) {
    commit(mutationTypes.SET_LOADING, loading);
  },
  load: async ({ commit }) => {
    commit(mutationTypes.SET_LOADING, true);
    //const result = JSON.parse(localStorage.getItem("referees"));
    const result = await API.graphql({
      query: listReferees
    });
    console.log(result.data.listReferees.items);
    const referees = result.data.listReferees.items.map(
      r => { return { ...r } }
    )
    commit(mutationTypes.SET_REFEREES, referees);
    commit(mutationTypes.SET_LOADING, false);
  },
  create: async ({ commit, dispatch }, { referee }) => {
    try {
      commit(mutationTypes.SET_LOADING, true);
      const result = await API.graphql({
        query: createReferee,
        variables: {input: referee},
      });
      console.log("created Referee", { ...result });
      commit(mutationTypes.ADD_REFEREE, result.data.cre);
      Toast.open({
        message: `Referee added to system`,
        type: "is-success"
      });
      dispatch("load");
      commit(mutationTypes.SET_LOADING, false);
    } catch (err) {
      Toast.open({
        message: `Saving failed: "${err.message}"`,
        type: "is-danger"
      });
    }
  },
  update({ commit, dispatch }, { referee }) {
    try {
      commit(mutationTypes.UPDATE_REFEREE, referee);
      Toast.open({
        message: `Referee updated`,
        type: "is-success"
      });
      dispatch("load");
    } catch (err) {
      Toast.open({
        message: `Saving failed: "${err.message}"`,
        type: "is-danger"
      });
    }
  }
};

const referees = {
  namespaced: true,
  state,
  getters: {
    loading: state => state.loading,
    all: state => state.referees,
    current: state => state.current,
    search: (state) => (query) => {
      const all = state.referees;
      return query == "" ? all : all.filter(
        ref => {
          const { firstName, lastName, country, email = "" } = ref;
          const match = [firstName, lastName, country, email].find(
            prop => prop.toLowerCase().includes(query.toString().toLowerCase())
          )
          return Boolean(match);
        }
      ).sort( (r0, r1) => r0.firstName > r1.firstName )
    },
    byId: (state) => (id) => {
      return state.referees.find(
        r => r.id === id
      )
    }
  },
  mutations,
  actions,
};
export default referees;
