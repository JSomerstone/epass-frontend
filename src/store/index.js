import Vue from "vue";
import Vuex from "vuex";

import axios from "axios";
import config from "../config/index";

import tournaments from "./modules/tournaments";
import referees from "./modules/referees";
import countries from "./modules/countries";
import auth from "./modules/auth";

axios.defaults.baseURL = config.backendUrl;
Vue.use(Vuex);

const store = new Vuex.Store({
  modules: {
    tournaments,
    referees,
    countries,
    auth
  }
});

export default store;