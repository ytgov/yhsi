import http from '@/apis/http-client';

const placeThemesUrl = '/api/place-themes';

export default {
	getAll() {
		return http
			.get(placeThemesUrl)
			.then((response) => response.data)
			.catch((error) => {
				console.error(error);
				return Promise.reject(error);
			});
	},
};
