import http from '@/apis/http-client';

const constructionPeriodTypesUrl = '/api/construction-period-types';

export default {
	getAll() {
		return http
			.get(constructionPeriodTypesUrl)
			.then((response) => response.data)
			.catch((error) => {
				console.error(error);
				return Promise.reject(error);
			});
	},
};
