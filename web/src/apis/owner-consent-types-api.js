import http from '@/apis/http-client';

const ownerConsentTypesUrl = '/api/owner-consent-types';

export default {
	getAll() {
		return http
			.get(ownerConsentTypesUrl)
			.then((response) => response.data)
			.catch((error) => {
				console.error(error);
				return Promise.reject(error);
			});
	},
};
