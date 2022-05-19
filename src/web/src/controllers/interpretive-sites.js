import { api, apiP } from './config';
import axios from 'axios';

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
	//INSPECTIONS
	async getInspections(
		InspectionDate,
		Description,
		InspectedBy,
		sortBy,
		sort,
		page,
		limit
	) {
		return await api
			.get(`/inspections`, {
				crossdomain: true,
				params: {
					InspectionDate,
					Description,
					InspectedBy,
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
	async putInspection(id, data) {
		return await api
			.put(`interpretive-sites/inspection/${id}`, data)
			.then((res) => {
				return res.data;
			})
			.catch((error) => {
				return error;
			});
	},
	async postInspection(data) {
		return await api
			.post(`interpretive-sites/inspection`, data)
			.then((res) => {
				return res.data;
			})
			.catch((error) => {
				return error;
			});
	},
	//ACTIONS
	async getActionsByInspectID(id) {
		return await api
			.get(`actions/inspection/${id}`)
			.then((res) => {
				return res.data;
			})
			.catch((error) => {
				// handle error
				console.error(error);
			});
	},
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
	async getActionsExport(
		ActionDesc,
		ToBeCompleteDate,
		ActionCompleteDate,
		CompletionDesc,
		Priority,
		CreatedBy,
		CreatedDate,
		CompletedBy,
		sortBy,
		sort
	) {
		return await api
			.post('actions/export', {
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
				page: 0,
				limit: 0,
			})
			.then((res) => {
				return res.data;
			})
			.catch((err) => {
				return err;
			});
	},
	async getActionsGridPdf(
		ActionDesc,
		ToBeCompleteDate,
		ActionCompleteDate,
		CompletionDesc,
		Priority,
		CreatedBy,
		CreatedDate,
		CompletedBy,
		sortBy,
		sort
	) {
		return await api({
			url: 'actions/pdf',
			method: 'POST',
			responseType: 'blob',
			data: {
				page: 0,
				limit: 0,
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
			},
		})
			.then((res) => {
				return res.data;
			})
			.catch((err) => {
				return err;
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
	async getAssetsExport(
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
		sort
	) {
		return await api
			.post('assets/export', {
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
				page: 0,
				limit: 0,
			})
			.then((res) => {
				return res.data;
			})
			.catch((err) => {
				return err;
			});
	},
	async getAssetsGridPdf(
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
		sort
	) {
		return await api({
			url: 'assets/pdf',
			method: 'POST',
			responseType: 'blob',
			data: {
				page: 0,
				limit: 0,
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
			},
		})
			.then((res) => {
				return res.data;
			})
			.catch((err) => {
				return err;
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
	async newDocumment(data) {
		return await apiP
			.post(`interpretive-sites/file/upload`, data)
			.then((res) => {
				return res;
			})
			.catch((error) => {
				// handle error
				console.error(error);
			});
	},
	async getDocumentsGeneral(docType, itemId) {
		return await api
			.get(`${docType}/docs/${itemId}`)
			.then((resp) => {
				//console.log("data",resp);
				return resp;
			})
			.catch((error) => console.error(error));
	},
	async removeAsset(id) {
		return await api
			.delete(`assets/${id}`)
			.then((res) => {
				return res;
			})
			.catch((err) => {
				console.error(err);
			});
	},
	async removeAction(id) {
		return await api
			.delete(`actions/${id}`)
			.then((res) => {
				return res;
			})
			.catch((err) => {
				console.error(err);
			});
	},
	async removeInspection(id) {
		return await api
			.delete(`inspections/${id}`)
			.then((res) => {
				return res;
			})
			.catch((err) => {
				console.error(err);
			});
	},
	async removeDocummentGeneral(docType, itemId) {
		return await api
			.delete(`${docType}/docs/${itemId}`)
			.then((resp) => {
				//console.log("data",resp);
				return resp;
			})
			.catch((error) => console.error(error));
	},
	async downloadDocByID(itemId) {
		const response = await api.get(`interpretive-sites/file/${itemId}`, { responseType: 'json' });
		return response;
	},
};
