import http from '@/apis/http-client';

const jurisdictionTypesUrl = '/api/jurisdiction-types';

export default {
	getAll() {
		return http
			.get(jurisdictionTypesUrl)
			.then((response) => response.data)
			.catch((error) => {
				console.error(error);
				return Promise.reject(error);
			});
	},
};
