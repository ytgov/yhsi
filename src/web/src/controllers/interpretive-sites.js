import { api } from './config';

export default {
	async get(
		page,
		limit,
		sortBy,
		sort,
		SiteName,
		LocationDesc,
		RouteName,
		KMNum,
		MapSheet,
		Latitude,
		Longitude,
		EstablishedYear,
		AdvancedNotification,
		NotificationDesc
	) {
		return await api
			.get(`interpretive-sites/`, {
				crossdomain: true,
				params: {
					page,
					limit,
					sortBy,
					sort,
					SiteName,
					LocationDesc,
					RouteName,
					KMNum,
					MapSheet,
					Latitude,
					Longitude,
					EstablishedYear,
					AdvancedNotification,
					NotificationDesc,
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
	async getById(id) {
		return await api
			.get(`interpretive-sites/${id}`)
			.then((res) => {
				return res.data;
			})
			.catch((error) => {
				// handle error
				console.error(error);
			});
	},
	async put(id, data) {
		return await api
			.put(`interpretive-sites/${id}`, data)
			.then((res) => {
				return res.data;
			})
			.catch((error) => {
				return error;
			});
	},
	async post(data) {
		return await api
			.post(`interpretive-sites`, data)
			.then((res) => {
				return res.data;
			})
			.catch((error) => {
				return error;
			});
	},
	async getSitesExport(
		sortBy,
		sort,
		SiteName,
		LocationDesc,
		RouteName,
		KMNum,
		MapSheet,
		Latitude,
		Longitude,
		EstablishedYear,
		AdvancedNotification,
		NotificationDesc
	) {
		return await api
			.post('interpretive-sites/export', {
				page: 0,
				limit: 0,
				sortBy,
				sort,
				SiteName,
				LocationDesc,
				RouteName,
				KMNum,
				MapSheet,
				Latitude,
				Longitude,
				EstablishedYear,
				AdvancedNotification,
				NotificationDesc,
			})
			.then((res) => {
				return res.data;
			})
			.catch((err) => {
				return err;
			});
	},
	async getGridPdf(
		sortBy,
		sort,
		SiteName,
		LocationDesc,
		RouteName,
		KMNum,
		MapSheet,
		Latitude,
		Longitude,
		EstablishedYear,
		AdvancedNotification,
		NotificationDesc
	) {
		return await api({
			url: 'interpretive-sites/pdf',
			method: 'POST',
			responseType: 'blob',
			data: {
				page: 0,
				limit: 0,
				sortBy,
				sort,
				SiteName,
				LocationDesc,
				RouteName,
				KMNum,
				MapSheet,
				Latitude,
				Longitude,
				EstablishedYear,
				AdvancedNotification,
				NotificationDesc,
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
			url: `interpretive-sites/pdf/${id}`,
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
	//ACTIONS
	async getActions(
		ActionDesc,
		ToBeCompleteDate,
		ActionCompleteDate,
		CompletionDesc,
		Priority,
		CreatedBy,
		CreatedDate,
		CompletedBy,
		sortBy,
		sort,
		page,
		limit
	) {
		return await api
			.get(`/actions`, {
				crossdomain: true,
				params: {
					// textToMatch,
					// sortBy,
					// sort,

					ActionDesc,
					ToBeCompleteDate,
					ActionCompleteDate,
					CompletionDesc,
					Priority,
					CreatedBy,
					CreatedDate,
					CompletedBy,
					sortBy,
					sort,
					page,
					limit,
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
	async putAction(id, data) {
		return await api
			.put(`actions/${id}`, data)
			.then((res) => {
				return res.data;
			})
			.catch((error) => {
				return error;
			});
	},
	async postAction(data) {
		return await api
			.post(`/actions`, data)
			.then((res) => {
				return res.data;
			})
			.catch((error) => {
				return error;
			});
	},
	//ASSETS
	async getAssets(
		Category,
		Type,
		Size,
		Description,
		SignText,
		InstallDate,
		DecommissionDate,
		DecommissionNotes,
		Status,
		sortBy,
		sort,
		page,
		limit
	) {
		return await api
			.get(`/assets`, {
				crossdomain: true,
				params: {
					Category,
					Type,
					Size,
					Description,
					SignText,
					InstallDate,
					DecommissionDate,
					DecommissionNotes,
					Status,
					sortBy,
					sort,
					page,
					limit,
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
	async putAsset(id, data) {
		return await api
			.put(`assets/${id}`, data)
			.then((res) => {
				return res.data;
			})
			.catch((error) => {
				return error;
			});
	},
	async postAsset(data) {
		return await api
			.post(`assets`, data)
			.then((res) => {
				return res.data;
			})
			.catch((error) => {
				return error;
			});
	},
};
