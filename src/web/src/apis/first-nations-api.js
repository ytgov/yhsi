import http from '@/apis/http-client';

const firstNationsUrl = '/api/first-nations';

export default {
	getAll() {
		return http
			.get(firstNationsUrl)
			.then((response) => response.data)
			.catch(console.error);
	},
};
