import http from '@/apis/http-client';

const communitiesUrl = '/api/communities';

export default {
	getAll() {
		return http
			.get(communitiesUrl)
			.then((response) => response.data)
			.catch(console.error);
	},
};
