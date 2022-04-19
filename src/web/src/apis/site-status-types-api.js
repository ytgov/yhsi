import http from '@/apis/http-client';

const siteStatusTypesUrl = '/api/site-status-types';

export default {
	getAll() {
		return http
			.get(siteStatusTypesUrl)
			.then((response) => response.data)
			.catch((error) => {
				console.error(error);
				return Promise.reject(error);
			});
	},
};
