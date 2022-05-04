import { api } from './config';

export default {
	async getCommunities(page, limit, textToMatch, sortBy, sort) {
		return await api
			.get(`catalogs/community`, {
				crossdomain: true,
				params: {
					page,
					limit,
					textToMatch,
					sortBy,
					sort,
				},
			})
			.then((res) => {
				return res.data;
			})
			.catch((error) => {
				// handle error
				console.error(error);
			});
	},
	async postCommunity(data) {
		return await api
			.post(`catalogs/community`, data)
			.then((res) => {
				return res.data;
			})
			.catch((error) => {
				// handle error
				console.error(error);
			});
	},
	async putCommunity(id, data) {
		return await api
			.put(`catalogs/community/${id}`, data)
			.then((res) => {
				return res.data;
			})
			.catch((error) => {
				// handle error
				console.error(error);
			});
	},
	async getPhotoOwners(page, limit, textToMatch, sortBy, sort) {
		return await api
			.get(`catalogs/photo-owner`, {
				crossdomain: true,
				params: {
					page,
					limit,
					textToMatch,
					sortBy,
					sort,
				},
			})
			.then((res) => {
				return res.data;
			})
			.catch((error) => {
				// handle error
				console.error(error);
			});
	},
	async getOriginalMedia() {
		return await api
			.get(`catalogs/originalmedia`)
			.then((res) => {
				return res.data;
			})
			.catch((error) => {
				// handle error
				console.error(error);
			});
	},
	async getVesselTypes(page, limit, textToMatch, sortBy, sort) {
		return await api
			.get(`catalogs/vesseltype`, {
				crossdomain: true,
				params: {
					page,
					limit,
					textToMatch,
					sortBy,
					sort,
				},
			})
			.then((res) => {
				return res.data;
			})
			.catch((error) => {
				// handle error
				console.error(error);
			});
	},
	async postVesselType(data) {
		return await api
			.post(`catalogs/vesseltype`, data)
			.then((res) => {
				return res.data;
			})
			.catch((error) => {
				// handle error
				console.error(error);
			});
	},
	async postPlaceType(data) {
		return await api
			.post(`catalogs/placetype`, data)
			.then((res) => {
				return res.data;
			})
			.catch((error) => {
				// handle error
				console.error(error);
			});
	},
	async putVesselType(id, data) {
		return await api
			.put(`catalogs/vesseltype/${id}`, data)
			.then((res) => {
				return res.data;
			})
			.catch((error) => {
				// handle error
				console.error(error);
			});
	},
	async getPlaceTypes(page, limit, textToMatch, sortBy, sort) {
		return await api
			.get(`catalogs/placetype`, {
				crossdomain: true,
				params: {
					page,
					limit,
					textToMatch,
					sortBy,
					sort,
				},
			})
			.then((res) => {
				return res.data;
			})
			.catch((error) => {
				// handle error
				console.error(error);
			});
	},

	async putPlaceType(id, data) {
		return await api
			.put(`catalogs/placetype/${id}`, data)
			.then((res) => {
				return res.data;
			})
			.catch((error) => {
				// handle error
				console.error(error);
			});
	},
	//CAUSES
	async getCauses() {
		return await api
			.get(`catalogs/cause`)
			.then((res) => {
				return res.data;
			})
			.catch((error) => {
				// handle error
				console.error(error);
			});
	},
	async putCauses(id, data) {
		return await api
			.put(`catalogs/cause/${id}`, data)
			.then((res) => {
				return res.data;
			})
			.catch((error) => {
				// handle error
				console.error(error);
			});
	},
	async postCauses(data) {
		return await api
			.post(`catalogs/cause`, data)
			.then((res) => {
				return res.data;
			})
			.catch((error) => {
				// handle error
				console.error(error);
			});
	},
	async searchCauses(page, limit, textToMatch, sortBy, sort) {
		return await api
			.get(`catalogs/cause/search`, {
				params: {
					page,
					limit,
					textToMatch,
					sortBy,
					sort,
				},
			})
			.then((res) => {
				return res.data;
			})
			.catch((error) => {
				// handle error
				console.error(error);
			});
	},
	//RELIGIONS
	async getReligions() {
		return await api
			.get(`catalogs/religion`)
			.then((res) => {
				return res.data;
			})
			.catch((error) => {
				// handle error
				console.error(error);
			});
	},
	async putReligion(id, data) {
		return await api
			.put(`catalogs/religion/${id}`, data)
			.then((res) => {
				return res.data;
			})
			.catch((error) => {
				// handle error
				console.error(error);
			});
	},
	async postReligion(data) {
		return await api
			.post(`catalogs/religion`, data)
			.then((res) => {
				return res.data;
			})
			.catch((error) => {
				// handle error
				console.error(error);
			});
	},
	async searchReligions(page, limit, textToMatch, sortBy, sort) {
		return await api
			.get(`catalogs/religion/search`, {
				params: {
					page,
					limit,
					textToMatch,
					sortBy,
					sort,
				},
			})
			.then((res) => {
				return res.data;
			})
			.catch((error) => {
				// handle error
				console.error(error);
			});
	},
	//CEMETARIES
	async getCemetaries() {
		return await api
			.get(`catalogs/cemetary`)
			.then((res) => {
				return res.data;
			})
			.catch((error) => {
				// handle error
				console.error(error);
			});
	},
	async putCemetary(id, data) {
		return await api
			.put(`catalogs/cemetary/${id}`, data)
			.then((res) => {
				return res.data;
			})
			.catch((error) => {
				// handle error
				console.error(error);
			});
	},
	async postCemetary(data) {
		return await api
			.post(`catalogs/cemetary`, data)
			.then((res) => {
				return res.data;
			})
			.catch((error) => {
				// handle error
				console.error(error);
			});
	},
	async searchCemetaries(page, limit, textToMatch, sortBy, sort) {
		return await api
			.get(`catalogs/cemetary/search`, {
				params: {
					page,
					limit,
					textToMatch,
					sortBy,
					sort,
				},
			})
			.then((res) => {
				return res.data;
			})
			.catch((error) => {
				// handle error
				console.error(error);
			});
	},
	//OCCUPATIONS
	async getOccupations() {
		return await api
			.get(`catalogs/occupation`)
			.then((res) => {
				return res.data;
			})
			.catch((error) => {
				// handle error
				console.error(error);
			});
	},
	async putOccupation(id, data) {
		return await api
			.put(`catalogs/occupation/${id}`, data)
			.then((res) => {
				return res.data;
			})
			.catch((error) => {
				// handle error
				console.error(error);
			});
	},
	async postOccupation(data) {
		return await api
			.post(`catalogs/occupation`, data)
			.then((res) => {
				return res.data;
			})
			.catch((error) => {
				// handle error
				console.error(error);
			});
	},
	async searchOccupations(page, limit, textToMatch, sortBy, sort) {
		return await api
			.get(`catalogs/occupation/search`, {
				params: {
					page,
					limit,
					textToMatch,
					sortBy,
					sort,
				},
			})
			.then((res) => {
				return res.data;
			})
			.catch((error) => {
				// handle error
				console.error(error);
			});
	},
	//MEMBERSHIPS
	async getMemberships() {
		return await api
			.get(`catalogs/membership`)
			.then((res) => {
				return res.data;
			})
			.catch((error) => {
				// handle error
				console.error(error);
			});
	},
	async putMembership(id, data) {
		return await api
			.put(`catalogs/membership/${id}`, data)
			.then((res) => {
				return res.data;
			})
			.catch((error) => {
				// handle error
				console.error(error);
			});
	},
	async postMembership(data) {
		return await api
			.post(`catalogs/membership`, data)
			.then((res) => {
				return res.data;
			})
			.catch((error) => {
				// handle error
				console.error(error);
			});
	},
	async searchMemberships(page, limit, textToMatch, sortBy, sort) {
		return await api
			.get(`catalogs/membership/search`, {
				params: {
					page,
					limit,
					textToMatch,
					sortBy,
					sort,
				},
			})
			.then((res) => {
				return res.data;
			})
			.catch((error) => {
				// handle error
				console.error(error);
			});
	},
	//RELATIONSHIPS
	async getRelationships() {
		return await api
			.get(`catalogs/relationship`)
			.then((res) => {
				return res.data;
			})
			.catch((error) => {
				// handle error
				console.error(error);
			});
	},
	async putRelationship(id, data) {
		return await api
			.put(`catalogs/relationship/${id}`, data)
			.then((res) => {
				return res.data;
			})
			.catch((error) => {
				// handle error
				console.error(error);
			});
	},
	async postRelationship(data) {
		return await api
			.post(`catalogs/relationship`, data)
			.then((res) => {
				return res.data;
			})
			.catch((error) => {
				// handle error
				console.error(error);
			});
	},
	async searchRelationships(page, limit, textToMatch, sortBy, sort) {
		return await api
			.get(`catalogs/relationship/search`, {
				params: {
					page,
					limit,
					textToMatch,
					sortBy,
					sort,
				},
			})
			.then((res) => {
				return res.data;
			})
			.catch((error) => {
				// handle error
				console.error(error);
			});
	},
	//ROUTES
	async getRoutes() {
		return await api
			.get(`catalogs/route`)
			.then((res) => {
				return res.data;
			})
			.catch((error) => {
				// handle error
				console.error(error);
			});
	},
	//ASSET TYPES
	async getAssetType() {
		return await api
			.get(`catalogs/asset-type`)
			.then((res) => {
				return res.data;
			})
			.catch((error) => {
				// handle error
				console.error(error);
			});
	},
	//CATEGORIES
	async getCategories() {
		return await api
			.get(`catalogs/categories`)
			.then((res) => {
				return res.data;
			})
			.catch((error) => {
				// handle error
				console.error(error);
			});
	},
	//MAINTAINERs
	async getMaintainers() {
		return await api
			.get(`catalogs/maintainer`)
			.then((res) => {
				return res.data;
			})
			.catch((error) => {
				// handle error
				console.error(error);
			});
	},
};
