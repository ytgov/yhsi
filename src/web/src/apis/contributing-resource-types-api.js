import http from '@/apis/http-client';

const contributingResourceTypesUrl = '/api/contributing-resource-types';

export default {
	getAll() {
		return http
			.get(contributingResourceTypesUrl)
			.then((response) => response.data)
			.catch(console.error);
	},
};
