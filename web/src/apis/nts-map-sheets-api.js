import http from '@/apis/http-client';

const nstMapSheetsUrl = '/api/nts-map-sheets';

export default {
	getAll() {
		return http
			.get(nstMapSheetsUrl)
			.then((response) => response.data)
			.catch((error) => {
				console.error(error);
				return Promise.reject(error);
			});
	},
};
