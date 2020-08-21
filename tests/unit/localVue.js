import { createLocalVue } from "@vue/test-utils";
import Buefy from 'buefy';
import Vuex from "vuex";

const localVue = createLocalVue();
localVue.use(Vuex);
localVue.use(Buefy);

export default localVue;