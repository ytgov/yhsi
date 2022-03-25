import http from '@/apis/http-client';

const siteStatusesUrl = '/api/site-statuses';

export default {
	getAll() {
		return http
			.get(siteStatusesUrl)
			.then((response) => response.data)
			.catch(console.error);
	},
};
