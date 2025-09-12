import http from '@/apis/http-client';

const associationTypesUrl = '/api/association-types';

export default {
	getAll() {
		return http
			.get(associationTypesUrl)
			.then((response) => response.data)
			.catch((error) => {
				console.error(error);
				return Promise.reject(error);
			});
	},
};
