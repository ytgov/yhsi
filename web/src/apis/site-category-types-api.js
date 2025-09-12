import http from '@/apis/http-client';

const siteCategoryTypesUrl = '/api/site-category-types';

export default {
	getAll() {
		return http
			.get(siteCategoryTypesUrl)
			.then((response) => response.data)
			.catch((error) => {
				console.error(error);
				return Promise.reject(error);
			});
	},
};
