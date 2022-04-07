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
	},
};
