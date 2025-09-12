import http from '@/apis/http-client';

const webLinkTypesUrl = '/api/web-link-types';

export default {
	getAll() {
		return http
			.get(webLinkTypesUrl)
			.then((response) => response.data)
			.catch((error) => {
				console.error(error);
				return Promise.reject(error);
			});
	},
};
