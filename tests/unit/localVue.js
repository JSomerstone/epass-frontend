import { createLocalVue } from "@vue/test-utils";
import Vuex from "vuex";
import Router from "vue-router";

const localVue = createLocalVue();
localVue.use(Vuex);
localVue.use(Router)

export default localVue;
