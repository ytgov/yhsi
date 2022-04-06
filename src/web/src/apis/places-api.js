import http from '@/apis/http-client';
import placesSummaryApi from '@/apis/places-summary-api';

const placeUrl = '/api/place';

export default {
	getAll() {
		return http
			.get(placeUrl)
			.then((response) => response.data)
			.catch(console.error);
	},
	get(id) {
		return http
			.get(`${placeUrl}/${id}`)
			.then((response) => response.data)
			.catch(console.error);
	},
	put(id, data) {
		return Promise.all([placesSummaryApi.put(id, data)]).catch((error) => {
			console.error(error);
			return Promise.reject(error);
		});
	},
	search(data) {
		return http
			.post(`${placeUrl}/search`, data)
			.then((response) => response.data)
			.catch(console.error);
	},
};
