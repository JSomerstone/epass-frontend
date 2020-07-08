import Vue from "vue";
import Vuex from "vuex";

import axios from "axios";
import config from "../config/index";

import tournaments from "./modules/tournaments";

axios.defaults.baseURL = config.backendUrl;
Vue.use(Vuex);

const store = new Vuex.Store({
  modules: {
    tournaments
  }
});

export default store;