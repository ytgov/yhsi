import {
	api,
	apiP
} from './config';

export default {
	async getAll(page, textToMatch) {
		return await api
			.get(`photos`, {
				crossdomain: true,
				params: {
					page: page,
					limit: 6,
					textToMatch,
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
	async getGeneral(photoType, itemId){
		return await api 
        .get(`photos/${photoType}/${itemId}`)
        .then((resp) => {
			//console.log("data",resp);
			return resp;     
        })
        .catch((error) => console.error(error))
        ;  
	},
	async postGeneral(photoType, data){
		return await apiP
			.post(`photos/${photoType}`, data)
			.then((res) => {
				return res;
			})
			.catch((error) => {
				// handle error
				console.error(error);
			});
	},
	async linkGeneral(photoType, itemId, data){
		return await api
			.post(`photos/${photoType}/link/${itemId}`, data)
			.then((res) => {
				return res;
			})
			.catch((error) => {
				// handle error
				console.error(error);
			});
	},
	// Boats
	async getByBoatId(id) {
		return await api
			.get(`photos/boat/${id}`)
			.then((res) => {
				return res.data;
			})
			.catch((error) => {
				// handle error
				console.error(error);
			});
	},
	async postBoatPhoto(data) {
		return await apiP
			.post(`photos/boat`, data)
			.then((res) => {
				return res.data;
			})
			.catch((error) => {
				// handle error
				console.error(error);
			});
	},
	// Aircrashes
	async getByYACSINumber(yacsinumber) {
		return await api
			.get(`photos/aircrash/${yacsinumber}`)
			.then((res) => {
				return res.data;
			})
			.catch((error) => {
				// handle error
				console.error(error);
			});
	},
	async postAirCrashPhoto(data) {
		return await apiP
			.post(`photos/aircrash`, data)
			.then((res) => {
				return res.data;
			})
			.catch((error) => {
				// handle error
				console.error(error);
			});
	},
	async linkAirCrashPhotos(yacsinumber, data) {
		return await api
			.post(`photos/aircrash/link/${yacsinumber}`, data)
			.then((res) => {
				return res.data;
			})
			.catch((error) => {
				// handle error
				console.error(error);
			});
	},
	async linkBoatPhotos(id, data) {
		return await api
			.post(`photos/boat/link/${id}`, data)
			.then((res) => {
				return res.data;
			})
			.catch((error) => {
				// handle error
				console.error(error);
			});
	},

	//PEOPLE PHOTOS
	async linkPersonPhotos(id, data) {
		return await api
			.post(`photos/people/link/${id}`, data)
			.then((res) => {
				return res.data;
			})
			.catch((err) => {
				console.error(err);
			});
	},
	async getByPersonId(id) {
		return await api
			.get(`photos/people/${id}`)
			.then((res) => {
				return res.data;
			})
			.catch((error) => {
				// handle error
				console.error(error);
			});
		// Yt Places
	},
	async getByPlaceId(id) {
		return await api
			.get(`extras/photos/ytplace/${id}`)
			.then((res) => {
				return res.data;
			})
			.catch((error) => {
				// handle error
				console.error(error);
			});
	},
	async postPlacePhoto(data) {
		return await apiP
			.post(`extras/photos/ytplace`, data)
			.then((res) => {
				return res.data;
			})
			.catch((error) => {
				// handle error
				console.error(error);
			});
	},
	async linkPlacePhotos(id, data) {
		return await api
			.post(`extras/photos/ytplace/link/${id}`, data)
			.then((res) => {
				return res.data;
			})
			.catch((error) => {
				// handle error
				console.error(error);
			});
	},
	async postPersonPhoto(data) {
		return await apiP
			.post(`photos/people`, data)
			.then((res) => {
				return res.data;
			})
			.catch((error) => {
				// handle error
				console.error(error);
			});
	},
	//BURIALS
	async getByBurialId(id) {
		return await api
			.get(`photos/burial/${id}`)
			.then((res) => {
				return res.data;
			})
			.catch((error) => {
				// handle error
				console.error(error);
			});
	},
	async postBurialPhoto(id,data) {
		return await apiP
			.post(`photos/burial/${id}`, data)
			.then((res) => {
				return res.data;
			})
			.catch((error) => {
				// handle error
				console.error(error);
			});
	},
	async linkBurialPhotos(id, data) {
		return await api
			.post(`photos/burial/link/${id}`, data)
			.then((res) => {
				return res.data;
			})
			.catch((error) => {
				// handle error
				console.error(error);
			});
	},
	
};
