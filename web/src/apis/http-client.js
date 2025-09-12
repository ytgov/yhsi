import axios from 'axios';
import qs from 'qs';

import { apiBaseUrl as API_BASE_URL } from '@/config';

export default axios.create({
	baseURL: API_BASE_URL,
	withCredentials: true,
	paramsSerializer(params) {
		return qs.stringify(params, { arrayFormat: 'brackets' });
	},
});
