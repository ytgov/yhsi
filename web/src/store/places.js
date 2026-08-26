import { get, isArray } from 'lodash';

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
		isEditor: (state, getters, rootState) => {
			{
				const roles = isArray(rootState.auth.user.roles)
					? rootState.auth.user.roles
					: rootState.auth.user.roles.split(',').map((role) => role.trim());

				const hasIt = roles.some((role) =>
					[
						UserRoles.ADMINISTRATOR,
						UserRoles.SITE_EDITOR,
						UserRoles.SITE_ADMIN,
					].includes(role)
				);

				return hasIt;
			}
		},
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
					placeId: state.place.id,
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
		create({ commit, state }, data) {
			commit('setLoading', true);
			return api
				.post(data)
				.then(({ data }) => {
					commit('setPlace', data);
					return state.place;
				})
				.finally(() => {
					commit('setLoading', false);
				});
		},
		async savePhotos({ commit, state }, data) {
			commit('setLoading', true);

			for (const photo of data) {
				if (photo.rowId) continue;

				const formData = new FormData();
				formData.append('caption', photo.caption || '');
				formData.append('comments', photo.comments || '');
				formData.append('creditLine', photo.creditLine || '');
				formData.append('featureName', photo.featureName || '');
				formData.append('yhsiRecord', state.place.yHSIId);
				formData.append('ntsMapNumber', state.place.nTSMapSheet);
				formData.append('file', photo.file);
				formData.append('location', photo.location || '');
				formData.append('communityId', state.place.communityId);
				formData.append('isOtherRecord', false);
				formData.append('originalMediaId', 1); // ditital
				formData.append('mediaStorage', 4); // database
				formData.append('copyright', 6); // incomplete
				formData.append('ownerId', 1); // historic sites
				formData.append('photoProjectId', 79); // none selected
				formData.append('program', 4); // YHSI
				formData.append('isComplete', false);
				formData.append('rating', 1);
				formData.append('isSiteDefault', false);

				await api
					.uploadPhoto(state.place.id, formData)
					.then((resp) => {
						console.log(resp);
					})
					.catch((err) => {
						console.log('ERRROR', err);
					});
			}

			commit('setLoading', false);
		},
		async savePhoto({ commit, state }, data) {
			commit('setLoading', true);

			const formData = new FormData();
			formData.append('caption', data.caption || '');
			formData.append('comments', data.comments || '');
			formData.append('creditLine', data.creditLine || '');
			formData.append('featureName', data.featureName || '');
			formData.append('yhsiRecord', state.place.yHSIId);
			formData.append('ntsMapNumber', state.place.nTSMapSheet);
			formData.append('file', data.file);
			formData.append('location', data.location || '');
			formData.append('communityId', state.place.communityId);
			formData.append('isOtherRecord', false);
			formData.append('originalMediaId', 1); // ditital
			formData.append('mediaStorage', 4); // database
			formData.append('copyright', 6); // incomplete
			formData.append('ownerId', 1); // historic sites
			formData.append('photoProjectId', 79); // none selected
			formData.append('program', 4); // YHSI
			formData.append('isComplete', false);
			formData.append('rating', 1);
			formData.append('isSiteDefault', false);
			formData.append('isPrivate', data.isPrivate || false);

			await api
				.uploadPhoto(state.place.id, formData)
				.then((resp) => {
					console.log(resp);
				})
				.catch((err) => {
					console.log('ERRROR', err);
				});

			commit('setLoading', false);
		},
		delete({ commit }, placeId) {
			commit('setLoading', true);
			return api
				.delete(placeId)
				.then(({ data }) => {
					commit('setPlace', {});
					return data;
				})
				.finally(() => {
					commit('setLoading', false);
				});
		},
	},
};
