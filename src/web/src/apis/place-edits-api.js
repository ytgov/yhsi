import http from '@/apis/http-client';

const placeUrl = '/api/place-edits';

export default {
	getAll(params) {
		return http
			.get(placeUrl, { params })
			.then((response) => response.data)
			.catch(console.error);
	},
};
