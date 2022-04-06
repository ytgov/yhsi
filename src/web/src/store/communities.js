import { isEmpty, keyBy } from 'lodash';

import api from '@/apis/communities-api';

export default {
	namespaced: true,
	state: () => ({
		communities: [],
		loading: false,
	}),
	getters: {
		communities: (state) => state.communities,
		communitiesKeyedById(state) {
			return keyBy(state.communities, 'id');
		},
		getById: (state, getters) => (id) => {
			return getters.communitiesKeyedById[id];
		},
		loading: (state) => state.loading,
	},
	mutations: {
		setLoading: (state, value) => {
			state.loading = value;
		},
		setCommunities: (state, value) => {
			state.communities = value;
		},
	},
	actions: {
		getAll({ state, commit }) {
			commit('setLoading', true);
			return api
				.getAll()
				.then(({ data }) => {
					commit('setCommunities', data);
					return state.communities;
				})
				.finally(() => {
					commit('setLoading', false);
				});
		},
		initialize({ state, dispatch }) {
			if (!isEmpty(state.communities) && !state.loading) return;

			return dispatch('getAll');
		},
		refresh({ dispatch }) {
			return dispatch('getAll');
		},
	},
};
