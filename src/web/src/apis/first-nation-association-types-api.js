import http from '@/apis/http-client';

const firstNationAssociationTypesUrl = '/api/first-nation-association-types';

export default {
	getAll() {
		return http
			.get(firstNationAssociationTypesUrl)
			.then((response) => response.data)
			.catch(console.error);
	},
};
