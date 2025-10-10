import api from '@/apis/place-edits-api';

export default {
	namespaced: true,
	state: () => ({
		placeEdit: {},
		loading: false,
	}),
	getters: {
		placeEdit: (state) => state.placeEdit,
		loading: (state) => state.loading,
	},
	mutations: {
		setLoading: (state, value) => {
			state.loading = value;
		},
		setPlaceEdit: (state, value) => {
			state.placeEdit = value;
		},
	},
	actions: {
		get({ state, commit }, placeEditId) {
			commit('setLoading', true);
			return api
				.get(placeEditId)
				.then(({ data }) => {
					commit('setPlaceEdit', data);
					return state.placeEdit;
				})
				.finally(() => {
					commit('setLoading', false);
				});
		},
		initialize({ dispatch }, placeEditId) {
			return dispatch('get', placeEditId);
		},
		save({ state, commit }, data) {
			commit('setLoading', true);
			return api
				.post(data)
				.then(({ data }) => {
					commit('setPlaceEdit', data);
					return state.placeEdit;
				})
				.finally(() => {
					commit('setLoading', false);
				});
		},
		delete({ state, commit }, placeEditId) {
			commit('setLoading', true);
			return api
				.delete(placeEditId)
				.then(({ data }) => {
					commit('setPlaceEdit', data);
					return state.placeEdit;
				})
				.finally(() => {
					commit('setLoading', false);
				});
		},
	},
};
