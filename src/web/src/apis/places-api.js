import http from '@/apis/http-client';

const placeUrl = '/api/place';

export default {
	getAll() {
		return http
			.get(placeUrl)
			.then((response) => response.data)
			.catch((error) => {
				console.error(error);
				return Promise.reject(error);
			});
	},
	get(id) {
		return http
			.get(`${placeUrl}/${id}`)
			.then((response) => response.data)
			.catch((error) => {
				console.error(error);
				return Promise.reject(error);
			});
	},
	patch(id, data) {
		return http
			.patch(`${placeUrl}/${id}`, data)
			.then((response) => response.data)
			.catch((error) => {
				console.error(error);
				return Promise.reject(error);
			});
	},
	search(data) {
		return http
			.post(`${placeUrl}/search`, data)
			.then((response) => response.data)
			.catch((error) => {
				console.error(error);
				return Promise.reject(error);
			});
	},
};
