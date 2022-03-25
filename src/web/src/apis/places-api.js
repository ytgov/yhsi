import http from '@/apis/http-client';

const placeUrl = '/api/place';

export default {
	getAll () {
		return http
			.get(placeUrl)
			.then((response) => response.data)
			.catch(console.error);
	},
	search(data) {
		return http
			.post(`${placeUrl}/search`, data)
			.then((response) => response.data)
			.catch(console.error);
	},
};
