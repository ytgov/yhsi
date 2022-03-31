import http from '@/apis/http-client';

const recordTypesUrl = '/api/record-types';

export default {
	getAll() {
		return http
			.get(recordTypesUrl)
			.then((response) => response.data)
			.catch(console.error);
	},
};
