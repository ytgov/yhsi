import Vue from "vue";
import Vuex from "vuex";

import auth from "./auth";
import profile from "./profile";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    loadingClass: "d-none",
    siteHistory: [],
    search: ""
  },
  mutations: {
    SET_LOADING(state, value) {
      state.isLoading = value;
      state.loadingClass = value ? "block" : "d-none";
    },
    ADD_SITEHISTORY(state, value) {
      state.siteHistory.unshift(value);
    },
    SET_SEARCH(state, value) {
      state.search = value;
    }
  },
  actions: {
    load({ commit }) {
      commit('SET_LOADING', true);
      window.setTimeout(() => { commit('SET_LOADING', false); }, 3000)
    },
    addSiteHistory({ commit }, site) {
      commit('ADD_SITEHISTORY', site);
    },
    setSearch({ commit }, value) {
      commit("SET_SEARCH", value)
    }
  },
  getters: {
    siteHistory: state => state.siteHistory,
    search: state => state.search,
  },
  modules: { auth, profile }
});
