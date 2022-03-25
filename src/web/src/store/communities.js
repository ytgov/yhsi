import { isEmpty, keyBy } from 'lodash';

import api from '@/apis/communities-api';

const state = {
	communities: [],
	loading: false,
};

const getters = {
	communities: (state) => state.communities,
	communitiesKeyedById() {
		return keyBy(state.communities, 'id');
	},
	getById: (state, getters) => (id) => {
		return getters.communitiesKeyedById[id];
	},
	loading: (state) => state.loading,
};

const mutations = {
	getAll() {
		state.loading = true;
		return api
			.getAll()
			.then(({ data }) => {
				state.communities = data;
				return state.communities;
			})
			.finally(() => {
				state.loading = false;
			});
	},
};

const actions = {
	initialize({ commit }) {
		if (!isEmpty(state.communities) && !state.loading) return;

		return commit('getAll');
	},
	refresh({ commit }) {
		return commit('getAll');
	},
};

export default {
	namespaced: true,
	state,
	getters,
	mutations,
	actions,
};
