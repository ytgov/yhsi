import { api } from './config';

export default {
	async get(
		page,
		limit,
		textToMatch,
		sortBy,
		sort,
		crashdate,
		aircrafttype,
		aircraftregistration,
		nation,
		militarycivilian,
		crashlocation,
		pilot,
		soulsonboard,
		injuries,
		fatalities
	) {
		return await api
			.get(`aircrash`, {
				crossdomain: true,
				params: {
					page,
					limit,
					textToMatch,
					sortBy,
					sort,
					crashdate,
					aircrafttype,
					aircraftregistration,
					nation,
					militarycivilian,
					crashlocation,
					pilot,
					soulsonboard,
					injuries,
					fatalities,
				},
			})
			.then((res) => {
				return res.data;
			})
			.catch((error) => {
				// handle error
				console.error(error);
			});
	},
	async getById(aircrashId) {
		return await api
			.get(`aircrash/${aircrashId}`)
			.then((res) => {
				return res.data;
			})
			.catch((error) => {
				// handle error
				console.error(error);
			});
	},
	async put(aircrashId, data) {
		return await api
			.put(`aircrash/${aircrashId}`, data)
			.then((res) => {
				return res.data;
			})
			.catch((error) => {
				// handle error
				console.error(error);
			});
	},
	async post(data) {
		console.log('data', data);
		return await api
			.post(`aircrash/`, data)
			.then((res) => {
				return res.data;
			})
			.catch((error) => {
				// handle error
				console.error(error);
				return error;
			});
	},
	async getAvailableYACSI(data) {
		return await api
			.get(`aircrash/available_yacsi/${data}`)
			.then((res) => {
				return res.data;
			})
			.catch((error) => {
				return error;
			});
	},
	async getExport(
		textToMatch,
		sortBy,
		sort,
		crashdate,
		aircrafttype,
		aircraftregistration,
		nation,
		militarycivilian,
		crashlocation,
		pilot,
		soulsonboard,
		injuries,
		fatalities
	) {
		return await api
			.post('aircrash/export', {
				page: 0,
				limit: 0,
				filters: {
					textToMatch,
					sortBy,
					sort,
					crashdate,
					aircrafttype,
					aircraftregistration,
					nation,
					militarycivilian,
					crashlocation,
					pilot,
					soulsonboard,
					injuries,
					fatalities,
				},
			})
			.then((res) => {
				return res.data;
			})
			.catch((err) => {
				return err;
			});
	},
	async getGridPdf(
		textToMatch,
		sortBy,
		sort,
		crashdate,
		aircrafttype,
		aircraftregistration,
		nation,
		militarycivilian,
		crashlocation,
		pilot,
		soulsonboard,
		injuries,
		fatalities
	) {
		return await api({
			url: 'aircrash/pdf',
			method: 'POST',
			responseType: 'blob',
			data: {
				page: 0,
				limit: 0,
				textToMatch,
				sortBy,
				sort,
				filters: {
					textToMatch,
					sortBy,
					sort,
					crashdate,
					aircrafttype,
					aircraftregistration,
					nation,
					militarycivilian,
					crashlocation,
					pilot,
					soulsonboard,
					injuries,
					fatalities,
				},
			},
		})
			.then((res) => {
				return res.data;
			})
			.catch((err) => {
				return err;
			});
	},
	async getPdf(id) {
		return await api({
			url: `aircrash/pdf/${id}`,
			method: 'POST',
			responseType: 'blob',
		})
			.then((res) => {
				return res.data;
			})
			.catch((err) => {
				return err;
			});
	},
};
