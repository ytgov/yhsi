import http from '@/apis/http-client';

const placeSummaryUrl = (placeId) => `/api/place/${placeId}/summary`;

export default {
	put(placeId, data) {
		return http
			.put(placeSummaryUrl(placeId), data)
			.then((response) => response.data)
			.catch(console.error);
	},
};
