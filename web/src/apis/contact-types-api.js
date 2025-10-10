import http from '@/apis/http-client';

const contactTypesUrl = '/api/contact-types';

export default {
	getAll() {
		return http
			.get(contactTypesUrl)
			.then((response) => response.data)
			.catch((error) => {
				console.error(error);
				return Promise.reject(error);
			});
	},
};
