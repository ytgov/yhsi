import http from '@/apis/http-client';

const constructionPeriodsUrl = '/api/construction-periods';

export default {
	getAll() {
		return http
			.get(constructionPeriodsUrl)
			.then((response) => response.data)
			.catch((error) => {
				console.error(error);
				return Promise.reject(error);
			});
	},
};
