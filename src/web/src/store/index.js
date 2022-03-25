import Vue from "vue";
import Vuex from "vuex";

import auth from "./auth";
import profile from "./profile";
import boats from "./boats";
import alerts from "./alerts";
import photos from "./photos";
<<<<<<< HEAD
=======
import users from "./users";
>>>>>>> 0cdf0c39d93068ce691cb9c87d8d8dd0e9875eaf

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    loadingClass: "d-none",
    siteHistory: [],
    search: "",
<<<<<<< HEAD
    showAppSidebar: false
=======
>>>>>>> 0cdf0c39d93068ce691cb9c87d8d8dd0e9875eaf
  },
  mutations: {
    SET_LOADING(state, value) {
      state.isLoading = value;
      state.loadingClass = value ? "block" : "d-none";
    },
    ADD_SITEHISTORY(state, value) {
      let exists = state.siteHistory.filter(h => h.id == value.id).length;

      if (exists == 0) state.siteHistory.unshift(value);
    },
    SET_SEARCH(state, value) {
      state.search = value;
<<<<<<< HEAD
    }
=======
    },
>>>>>>> 0cdf0c39d93068ce691cb9c87d8d8dd0e9875eaf
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
    },
<<<<<<< HEAD
    setAppSidebar(state, value) {
      state.state.showAppSidebar = value;
    }
=======
>>>>>>> 0cdf0c39d93068ce691cb9c87d8d8dd0e9875eaf
  },
  getters: {
    siteHistory: state => state.siteHistory,
    search: state => state.search,
<<<<<<< HEAD
    showAppSidebar: state => state.showAppSidebar, 
  },
  modules: { auth, profile, boats, alerts, photos }
=======
  },
  modules: { auth, profile, boats, alerts, photos, users }
>>>>>>> 0cdf0c39d93068ce691cb9c87d8d8dd0e9875eaf
});
