import http from '@/apis/http-client';

const ownershipTypesUrl = '/api/ownership-types';

export default {
	getAll() {
		return http
			.get(ownershipTypesUrl)
			.then((response) => response.data)
			.catch(console.error);
	},
};
