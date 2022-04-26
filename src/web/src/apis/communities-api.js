import http from '@/apis/http-client';

const communitiesUrl = '/api/communities';

export default {
	getAll() {
		return http
			.get(communitiesUrl)
			.then((response) => response.data)
			.catch((error) => {
				console.error(error);
				return Promise.reject(error);
			});
	},
};
