import http from '@/apis/http-client';

const coordinateDeterminationTypesUrl = '/api/coordinate-determination-types';

export default {
	getAll() {
		return http
			.get(coordinateDeterminationTypesUrl)
			.then((response) => response.data)
			.catch((error) => {
				console.error(error);
				return Promise.reject(error);
			});
	},
};
