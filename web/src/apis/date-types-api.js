import http from '@/apis/http-client';

const dateTypesUrl = '/api/date-types';

export default {
	getAll() {
		return http
			.get(dateTypesUrl)
			.then((response) => response.data)
			.catch((error) => {
				console.error(error);
				return Promise.reject(error);
			});
	},
};
