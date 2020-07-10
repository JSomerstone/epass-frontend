// import axios from "axios";
import { ToastProgrammatic as Toast } from 'buefy'

const year = new Date().getFullYear();
const state = {
  year,
};

const mutationTypes = {
  SET_YEAR: "set-year",
};

const mutations = {
  [mutationTypes.SET_YEAR](state, year) {
    state.year = year;
  },
};

const actions = {
  setYear({ commit }, { year }) {
    const firstAllowed = 2019,
      lastAllowed = new Date().getFullYear();
    if (year < firstAllowed || year > lastAllowed) {
      Toast.open({
        message: `No tournaments for ${year}`,
        type: "is-error"
      });
    } else {
      commit(mutationTypes.setYear, year);
    }

  },
};

const general = {
  namespaced: true,
  state,
  getters: {
    year: state => state.year
  },
  mutations,
  actions,
};
export default general;
