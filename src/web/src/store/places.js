import { get } from 'lodash';

import { UserRoles } from '@/authorization';
import api from '@/apis/places-api';

// This function can go away when the back-end serves the
// relationship data as part of the data directly.
// e.g. { data: { names: [{ id: 1, placeId: 1, description: "SomeName" }] } }
// instead of { data: {}, relationships: { names: { data: [{ id: 1, placeId: 1, description: "SomeName" }] } } }
function injectRelationshipData(data, relationships) {
  Object.keys(relationships).forEach((key) => {
    if (key in data) {
      console.error('Relationship data conflicts with source data.');
      return;
    }

    data[key] = get(relationships, `${key}.data`, []);
  });
}

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
          injectRelationshipData(data, relationships);
          commit('setPlace', data);
          return state.place;
        })
        .finally(() => {
          commit('setLoading', false);
        });
    },
    initialize({ dispatch }, placeId) {
      return dispatch('profile/loadProfile', null, { root: true }).then(() => {
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
    saveAsChangeRequest({ commit, dispatch, state }, data) {
      commit('setLoading', true);
      return dispatch(
        'placeEdits/save',
        {
          ...state.place,
          ...data,
          placeId: state.placeId,
        },
        { root: true }
      ).then(() => {
        return dispatch('refresh', state.place.id);
      });
    },
    saveDirectly({ commit, state }, data) {
      commit('setLoading', true);
      return api
        .patch(state.place.id, data)
        .then(({ data }) => {
          commit('setPlace', data);
          return state.place;
        })
        .finally(() => {
          commit('setLoading', false);
        });
    },
  },
};
