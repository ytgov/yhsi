import http from '@/apis/http-client';

const firstNationsUrl = '/api/first-nations';

export default {
	getAll() {
		return http
			.get(firstNationsUrl)
			.then((response) => response.data)
			.catch((error) => {
				console.error(error);
				return Promise.reject(error);
			});
	},

	create(description) {
		return http
			.post(firstNationsUrl, { description })
			.then((response) => response.data)
			.catch((error) => {
				console.error(error);
				return Promise.reject(error);
			});
	},

	update(id, description) {
		return http
			.put(`${firstNationsUrl}/${id}`, { description })
			.then((response) => response.data)
			.catch((error) => {
				console.error(error);
				return Promise.reject(error);
			});
	},

	remove(id) {
		return http
			.delete(`${firstNationsUrl}/${id}`)
			.catch((error) => {
				console.error(error);
				return Promise.reject(error);
			});
	},
};
