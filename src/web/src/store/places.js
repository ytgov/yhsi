import { isEmpty } from 'lodash';

import api from '@/apis/places-api';

const state = {
  place: {},
  loading: false,
};

const getters = {
  hasPendingChanges: (state) => state.place.hasPendingChanges,
  historicalPatterns: (state) => state.place.historicalPatterns || [],
  loading: (state) => state.loading,
  names: (state) => state.place.names || [],
  place: (state) => state.place,
  primaryName: (state) => state.place.primaryName,
};

const mutations = {
  get(state, placeId) {
    state.loading = true;
    return api
      .get(placeId)
      .then(({ data, relationships }) => {
        state.place = data;
        state.place.names = relationships.names.data;
        state.place.historicalPatterns = relationships.historicalPatterns.data;
        return state.place;
      })
      .finally(() => {
        state.loading = false;
      });
  },
};

const actions = {
  initialize({ commit }, placeId) {
    return commit('get', placeId);
  },
  initializeOrGetCached({ commit }, placeId) {
    if (!isEmpty(state.place) && !state.loading && state.place.id == placeId)
      return;

    return commit('get', placeId);
  },
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};
