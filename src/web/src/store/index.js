import Vue from "vue";
import Vuex from "vuex";

import auth from "./auth";
import profile from "./profile";
import boats from "./boats"
Vue.use(Vuex);

export default new Vuex.Store({
  state: {},
  mutations: {},
  actions: {},
  modules: { auth, profile, boats}
});
