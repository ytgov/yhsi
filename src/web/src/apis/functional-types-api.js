import http from '@/apis/http-client';

const functionalTypesUrl = '/api/functional-types';

export default {
	getAll() {
		return http
			.get(functionalTypesUrl)
			.then((response) => response.data)
			.catch((error) => {
				console.error(error);
				return Promise.reject(error);
			});
	},
};
