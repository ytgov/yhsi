import { isEmpty } from 'lodash';

import api from '@/apis/nts-map-sheets-api';

const state = {
	ntsMapSheets: [],
	loading: false,
};

const getters = {
	ntsMapSheets: (state) => state.ntsMapSheets,
	loading: (state) => state.loading,
};

const mutations = {
	getAll() {
		state.loading = true;
		return api
			.getAll()
			.then(({ data }) => {
				state.ntsMapSheets = data;
				return state.ntsMapSheets;
			})
			.finally(() => {
				state.loading = false;
			});
	},
};

const actions = {
	initialize({ commit }) {
		if (!isEmpty(state.ntsMapSheets) && !state.loading) return;

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
