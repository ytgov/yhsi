import { isEmpty } from 'lodash';

import api from '@/apis/places-api';

export default {
  namespaced: true,
  state: () => ({ place: {}, loading: false }),
  getters: {
    hasPendingChanges: (state) => state.place.hasPendingChanges,
    historicalPatterns: (state) => state.place.historicalPatterns || [],
    loading: (state) => state.loading,
    names: (state) => state.place.names || [],
    place: (state) => state.place,
    primaryName: (state) => state.place.primaryName,
  },
  mutations: {
    setLoading: (state, value) => {
      state.loading = value;
    },
    setPlace: (state, value) => {
      state.place = value;
    },
  },
  actions: {
    get({ state, commit }, placeId) {
      commit('setLoading', true);
      return api
        .get(placeId)
        .then(({ data, relationships }) => {
          data.names = relationships.names.data;
          data.historicalPatterns = relationships.historicalPatterns.data;
          commit('setPlace', data);
          return state.place;
        })
        .finally(() => {
          commit('setLoading', false);
        });
    },
    initialize({ dispatch }, placeId) {
      return dispatch('get', placeId);
    },
    refresh({ dispatch }, placeId) {
      return dispatch('get', placeId);
    },
    initializeOrGetCached({ dispatch, state }, placeId) {
      if (
        !isEmpty(state.place) &&
        !state.loading &&
        state.place.id == placeId
      ) {
        return state.place;
      }
      return dispatch('get', placeId);
    },
  },
};
