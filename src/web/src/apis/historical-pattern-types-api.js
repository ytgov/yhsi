import http from '@/apis/http-client';

const historicalPatternTypesUrl = '/api/historical-pattern-types';

export default {
	getAll() {
		return http
			.get(historicalPatternTypesUrl)
			.then((response) => response.data)
			.catch((error) => {
				console.error(error);
				return Promise.reject(error);
			});
	},
};
