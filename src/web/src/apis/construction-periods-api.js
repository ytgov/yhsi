import http from '@/apis/http-client';

const constructionPeriodsUrl = '/api/construction-periods';

export default {
	getAll() {
		return http
			.get(constructionPeriodsUrl)
			.then((response) => response.data)
			.catch(console.error);
	},
};
