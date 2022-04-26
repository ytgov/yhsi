import Vue from 'vue';
import Vuex from 'vuex';

import auth from './auth';
import communities from '@/store/communities';
import ntsMapSheets from '@/store/nts-map-sheets';
import places from '@/store/places';
import placeEdits from '@/store/place-edits';
import profile from './profile';
import boats from './boats';
import interpretiveSites from './interpretive-sites';
import alerts from './alerts';
import photos from './photos';
import users from './users';

import maps from '@/modules/map/store';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    loadingClass: 'd-none',
    siteHistory: [],
    search: '',
  },
  mutations: {
    SET_LOADING(state, value) {
      state.isLoading = value;
      state.loadingClass = value ? 'block' : 'd-none';
    },
    ADD_SITEHISTORY(state, value) {
      let exists = state.siteHistory.filter((h) => h.id == value.id).length;

      if (exists == 0) state.siteHistory.unshift(value);
    },
    SET_SEARCH(state, value) {
      state.search = value;
    },
  },
  actions: {
    load({ commit }) {
      commit('SET_LOADING', true);
      window.setTimeout(() => {
        commit('SET_LOADING', false);
      }, 3000);
    },
    addSiteHistory({ commit }, site) {
      commit('ADD_SITEHISTORY', site);
    },
    setSearch({ commit }, value) {
      commit('SET_SEARCH', value);
    },
  },
  getters: {
    siteHistory: (state) => state.siteHistory,
    search: (state) => state.search,
  },
  modules: {
    alerts,
    auth,
    boats,
    communities,
    maps,
    ntsMapSheets,
    photos,
    placeEdits,
    places,
    profile,
    users,
    interpretiveSites
  },
});
