import http from '@/apis/http-client';

const functionalUseTypesUrl = '/api/functional-use-types';

export default {
	getAll() {
		return http
			.get(functionalUseTypesUrl)
			.then((response) => response.data)
			.catch((error) => {
				console.error(error);
				return Promise.reject(error);
			});
	},
};
