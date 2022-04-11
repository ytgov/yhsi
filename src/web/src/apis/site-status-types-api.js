import http from '@/apis/http-client';

const siteStatusTypesUrl = '/api/site-status-types';

export default {
	getAll() {
		return http
			.get(siteStatusTypesUrl)
			.then((response) => response.data)
			.catch(console.error);
	},
};
