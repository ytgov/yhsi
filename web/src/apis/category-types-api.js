import http from '@/apis/http-client';

const categoryTypesUrl = '/api/category-types';

export default {
	getAll() {
		return http
			.get(categoryTypesUrl)
			.then((response) => response.data)
			.catch((error) => {
				console.error(error);
				return Promise.reject(error);
			});
	},
};
