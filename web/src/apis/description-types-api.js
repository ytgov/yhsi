import http from '@/apis/http-client';

const descriptionTypesUrl = '/api/description-types';

export default {
	getAll() {
		return http
			.get(descriptionTypesUrl)
			.then((response) => response.data)
			.catch((error) => {
				console.error(error);
				return Promise.reject(error);
			});
	},
};
