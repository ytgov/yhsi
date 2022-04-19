import http from '@/apis/http-client';

const contributingResourceTypesUrl = '/api/contributing-resource-types';

export default {
	getAll() {
		return http
			.get(contributingResourceTypesUrl)
			.then((response) => response.data)
			.catch((error) => {
				console.error(error);
				return Promise.reject(error);
			});
	},
};
