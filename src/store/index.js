import Vue from "vue";
import Vuex from "vuex";

import axios from "axios";
import config from "../config/index";

import tournaments from "./modules/tournaments";
import referees from "./modules/referees";

axios.defaults.baseURL = config.backendUrl;
Vue.use(Vuex);

if (config.stage === "dev") {
  const t = require("../../test/data/tournaments.json"),
    r = require("../../test/data/referee.json");
  if (!localStorage.getItem("tournaments")) {
    localStorage.setItem("tournaments", JSON.stringify(t));
  }
  if (!localStorage.getItem("referees")) {
    localStorage.setItem("referees", JSON.stringify(r));
  }
}

const store = new Vuex.Store({
  modules: {
    tournaments,
    referees
  }
});

export default store;