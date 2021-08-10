import Vue from "vue";
import Vuex from "vuex";

import auth from "./auth";
import profile from "./profile";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    loadingClass: "d-none"
  },
  mutations: {
    SET_LOADING(state, value) {
      state.isLoading = value;
      state.loadingClass = value ? "block" : "d-none";
    },
  },
  actions: {
    load({ commit }) {
      commit('SET_LOADING', true);
      window.setTimeout(() => { commit('SET_LOADING', false); }, 3000)

    }
  },
  modules: { auth, profile }
});
