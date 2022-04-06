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
        data.names = relationships.names.data;
        data.historicalPatterns = relationships.historicalPatterns.data;
        state.place = data;
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
  initializeOrGetCached({ commit, state }, placeId) {
    if (!isEmpty(state.place) && !state.loading && state.place.id == placeId) {
      return state.place;
    }

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
