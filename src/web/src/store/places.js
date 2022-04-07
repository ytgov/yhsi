import { isEmpty } from 'lodash';

import { UserRoles } from '@/authorization';
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
    async initialize({ dispatch, state }, placeId) {
      return dispatch('profile/loadProfile', null, { root: true }).then(() => {
        if (
          !state.loading &&
          !isEmpty(state.place) &&
          state.place.id == placeId
        ) {
          return state.place;
        }
        return dispatch('get', placeId);
      });
    },
    refresh({ dispatch }, placeId) {
      return dispatch('get', placeId);
    },
    save({ dispatch, rootGetters }, data) {
      if (
        rootGetters['profile/role_list'].some((role) =>
          [UserRoles.SITE_ADMIN, UserRoles.ADMINISTRATOR].includes(role)
        )
      ) {
        return dispatch('saveDirectly', data);
      }

      return dispatch('saveAsChangeRequest', data);
    },
    saveAsChangeRequest({ dispatch, state }, data) {
      return dispatch('placeEdit/save', {
        ...state.place,
        ...data,
        placeId: state.placeId,
      }).then(() => {
        return dispatch('refresh', state.place.id);
      });
    },
    saveDirectly({ commit, state }, data) {
      return api.patch(state.place.id, data).then(({ data }) => {
        commit('setPlace', data);
        return state.place;
      });
    },
  },
};
