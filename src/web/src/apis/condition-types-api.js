import http from '@/apis/http-client';

const conditionTypesUrl = '/api/condition-types';

export default {
	getAll() {
		return http
			.get(conditionTypesUrl)
			.then((response) => response.data)
			.catch((error) => {
				console.error(error);
				return Promise.reject(error);
			});
	},
};
