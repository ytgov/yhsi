import Vue from "vue";
import Vuex from "vuex";

import auth from "./auth";
import profile from "./profile";
import boats from "./boats";
import alerts from "./alerts";
Vue.use(Vuex);

export default new Vuex.Store({
  state: {},
  mutations: {},
  actions: {},
  modules: { auth, profile, boats, alerts}
});
