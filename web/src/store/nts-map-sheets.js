import { isEmpty } from 'lodash';

import api from '@/apis/nts-map-sheets-api';

export default {
	namespaced: true,
	state: () => ({
		ntsMapSheets: [],
		loading: false,
	}),
	getters: {
		ntsMapSheets: (state) => state.ntsMapSheets,
		loading: (state) => state.loading,
	},
	mutations: {
		setLoading: (state, value) => {
			state.loading = value;
		},
		setNtsMapSheets: (state, value) => {
			state.ntsMapSheets = value;
		},
	},
	actions: {
		getAll({ state, commit }) {
			commit('setLoading', true);
			return api
				.getAll()
				.then(({ data }) => {
					commit('setNtsMapSheets', data);
					return state.ntsMapSheets;
				})
				.finally(() => {
					commit('setLoading', false);
				});
		},
		initialize({ state, dispatch }) {
			if (!isEmpty(state.ntsMapSheets) && !state.loading) return;

			return dispatch('getAll');
		},
		refresh({ dispatch }) {
			return dispatch('getAll');
		},
	},
};
