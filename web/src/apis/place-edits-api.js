import http from '@/apis/http-client';

const placeEditsUrl = '/api/place-edits';

export default {
	getAll(params) {
		return http
			.get(placeEditsUrl, { params })
			.then((response) => response.data)
			.catch((error) => {
				console.error(error);
				return Promise.reject(error);
			});
	},
	get(id) {
		return http
			.get(`${placeEditsUrl}/${id}`)
			.then((response) => response.data)
			.catch((error) => {
				console.error(error);
				return Promise.reject(error);
			});
	},
	post(data) {
		return http
			.post(placeEditsUrl, data)
			.then((response) => response.data)
			.catch((error) => {
				console.error(error);
				return Promise.reject(error);
			});
	},
	delete(id) {
		return http
			.delete(`${placeEditsUrl}/${id}`)
			.then((response) => response.data)
			.catch((error) => {
				console.error(error);
				return Promise.reject(error);
			});
	},
};
