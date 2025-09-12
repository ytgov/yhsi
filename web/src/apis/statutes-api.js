import http from '@/apis/http-client';

const statutesUrl = '/api/statutes';

export default {
	getAll() {
		return http
			.get(statutesUrl)
			.then((response) => response.data)
			.catch((error) => {
				console.error(error);
				return Promise.reject(error);
			});
	},
};
