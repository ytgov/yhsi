import http from '@/apis/http-client';

const revisionlogTypesUrl = '/api/revision-log-types';

export default {
	getAll() {
		return http
			.get(revisionlogTypesUrl)
			.then((response) => response.data)
			.catch((error) => {
				console.error(error);
				return Promise.reject(error);
			});
	},
};
