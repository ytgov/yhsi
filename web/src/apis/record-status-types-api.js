import http from '@/apis/http-client';

const recordStatusTypesUrl = '/api/record-status-types';

export default {
	getAll() {
		return http
			.get(recordStatusTypesUrl)
			.then((response) => response.data)
			.catch((error) => {
				console.error(error);
				return Promise.reject(error);
			});
	},
};
