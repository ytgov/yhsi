import http from '@/apis/http-client';

const placeEditsUrl = '/api/place-edits';

export default {
	getAll(params) {
		return http
			.get(placeEditsUrl, { params })
			.then((response) => response.data)
			.catch(console.error);
	},
	get(id) {
		return http
			.get(`${placeEditsUrl}/${id}`)
			.then((response) => response.data)
			.catch(console.error);
	},
};
