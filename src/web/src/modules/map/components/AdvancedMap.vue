<template>
	<div style="height: 100%">
		<v-navigation-drawer
			absolute
			temporary
			v-model="sidebarVisible"
			width="400"
		>
			<v-tabs
				v-model="tab"
				background-color="#fff2d5"
				color="primary"
			>
				<v-tab key="0">Layers</v-tab>
				<v-tab key="1">Basemap</v-tab>
				<v-tab key="2">Legend</v-tab>
			</v-tabs>
			<v-tabs-items
				v-model="tab"
				style="padding: 20px"
			>
				<v-tab-item
					key="0"
					eager
				>
					<div id="list"></div>
				</v-tab-item>
				<v-tab-item
					key="1"
					eager
				>
					<div id="gallery"></div>
				</v-tab-item>
				<v-tab-item
					key="2"
					eager
				>
					<div id="legend"></div>
				</v-tab-item>
			</v-tabs-items>
		</v-navigation-drawer>

		<div
			class="map"
			id="map"
		></div>
	</div>
</template>

<style>
.map {
	height: 100%;
	border: 1px #ddd solid;
}
.esri-layer-list {
	background-color: white !important;
}
.esri-layer-list__list--root,
.esri-layer-list__item-container {
	padding-left: 0 !important;
	padding-right: 0 !important;
}
.esri-search {
	top: 15px;
	right: 55px;
	border: 1px #6e6e6e solid;
	width: 400px !important;
}
.esri-settings {
	top: 15px;
	right: 15px;
	border: 1px #6e6e6e solid;
}
</style>

<script>
import { loadModules } from 'esri-loader';
import { mapActions, mapGetters } from 'vuex';
import { UserRoles } from '../../../authorization';
import { MAPS_URL } from '@/urls';

export default {
	name: 'Home',
	data: () => ({
		visible: null,
		color: '',
		text: '',
		icon: '',
		map: {},
		sidebarVisible: false,
		tab: 0,

		baseMapGallery: {},
		layerList: {},
	}),
	computed: {
		...mapGetters(['userInRole']),
	},
	methods: {
		...mapActions('maps', ['loadToken', 'searchByYHSIId']),
		showSidebar() {
			this.sidebarVisible = true;
		},
	},
	mounted: function () {
		let parent = this;

		console.log('MOUNT');

		this.loadToken().then((resp) => {
			loadModules(
				[
					'esri/identity/IdentityManager',
					'esri/views/MapView',
					'esri/WebMap',
					'esri/widgets/BasemapGallery',
					'esri/widgets/LayerList',
					'esri/widgets/Legend',
					'esri/layers/FeatureLayer',
					'esri/config',
					'esri/widgets/Search',
				],
				{ css: true }
			).then(
				([
					IdentityManager,
					MapView,
					WebMap,
					BasemapGallery,
					LayerList,
					Legend,
					FeatureLayer,
					config,
					Search,
				]) => {
					console.log('LoadModules Callback');

					IdentityManager.registerToken({
						server: 'https://yukon.maps.arcgis.com',
						token: resp.access_token,
					});
					IdentityManager.registerToken({
						server: `${MAPS_URL}/sites`,
						token: resp.access_token,
					});

					config.request.interceptors.push({
						urls: `${MAPS_URL}/sites`,
						before: function (params) {
							params.requestOptions.withCredentials = true;
						},
						after: function (response) {
							console.log(
								'AFTER',
								response.data.supportedQueryFormats,
								response.data
							);
							response.data.supportedQueryFormats = 'JSON';
						},
					});

					const webmap = new WebMap({
						portalItem: { id: '5e6f859dadad41e5894b33a506c67f0a' },
					});

					const view = new MapView({
						container: 'map',
						map: webmap,
						zoom: 5,
					});

					const searchWidget = new Search({
						view: view,
						includeDefaultSources: false,
						sources: [],
						allPlaceholder: 'Search for site or airplane crash',
					});

					var settingWidget = document.createElement('div');
					settingWidget.title = 'Map settings';
					settingWidget.className =
						'esri-icon-drag-horizontal esri-widget--button esri-widget esri-interactive esri-settings';
					settingWidget.addEventListener('click', function () {
						//parent.showSidebar = true;
						parent.showSidebar();
					});

					view.ui.add([
						{
							component: settingWidget,
							position: 'manual',
						},
						{ component: searchWidget, position: 'manual' },
					]);

					new LayerList({
						view: view,
						container: 'list',
					});

					new BasemapGallery({
						view: view,
						container: 'gallery',
					});

					new Legend({
						view: view,
						container: 'legend',
					});

					if (
						this.userInRole(
							[UserRoles.SITE_VIEWER],
							[UserRoles.SITE_VIEWER_LIMITED],
							[UserRoles.SITE_EDITOR],
							[UserRoles.SITE_ADMIN]
						)
					) {
						let viewSiteAction = {
							title: 'View site details',
							id: 'view-site',
							className: 'esri-icon-visible',
						};

						var YHSIpopup = {
							title: '{YHSI_ID} - {SITE_NAME}',
							content: [
								{
									type: 'fields',
									fieldInfos: [
										{
											fieldName: 'YHSI_ID',
											label: 'YHSI ID',
										},
										{
											fieldName: 'SITE_NAME',
											label: 'Site Name',
										},
										{
											fieldName: 'HISTORIC_THEME',
											label: 'Historic Theme',
										},
										{
											fieldName: 'CURRENT_USE',
											label: 'Current Use',
										},
										{
											fieldName: 'PAST_USE',
											label: 'Past Use',
										},
										{
											fieldName: 'SITE_CATEGORY',
											label: 'Site Category',
										},
										{
											fieldName: 'SITE_STATUS',
											label: 'Site Status',
										},
										{
											fieldName: 'CONDITION',
											label: 'Condition',
										},
										{
											fieldName: 'PLACE_DESCRIPTION',
											label: 'Desciption',
										},
										{
											fieldName: 'CULTURAL_HISTORY',
											label: 'Cultural History',
										},
										{
											fieldName: 'LAST_VISIT_DATE',
											label: 'Last Visited Date',
										},
										{
											fieldName: 'LAST_VISIT_BY',
											label: 'Last Visited By',
										},
										{
											fieldName: 'RECORD_UPDATE_DATE',
											label: 'Record Updated Date',
										},
										{
											fieldName: 'RECORD_UPDATE_BY',
											label: 'Record updated by',
										},
									],
								},
							],
							actions: [viewSiteAction],
						};

						var sites = new FeatureLayer({
							url: `${MAPS_URL}/sites/0`,
							popupTemplate: YHSIpopup,
							outFields: ['YHSI_ID'],
							format: 'json',
						});

						searchWidget.sources.push({
							layer: sites,
							searchFields: ['YHSI_ID', 'SITE_NAME'],
							suggestionTemplate: '{YHSI_ID} - {SITE_NAME}',
							exactMatch: false,
							outFields: ['YHSI_ID', 'SITE_NAME'],
							name: 'Sites',
							placeholder: 'example: 105D/10',
						});

						view.when(function () {
							webmap.add(sites);
						});
					}

					if (this.userInRole([UserRoles.AIRPLANE_CRASH_EDITOR])) {
						let viewCrashAction = {
							title: 'View airplane crash details',
							id: 'view-aircrash',
							className: 'esri-icon-visible',
						};

						var CrashPopup = {
							title: '{YACSI_NUM}',
							content: [
								{
									type: 'fields',
									fieldInfos: [
										{
											fieldName: 'YACSI_NUM',
											label: 'YACSI #',
										},
										{
											fieldName: 'CRASH_DATE',
											label: 'Crash Date',
										},
										{
											fieldName: 'AIRCRAFT_REGISTRATION',
											label: 'Aircraft Registration',
										},
										{
											fieldName: 'AIRCRAFT',
											label: 'Aircraft',
										},
										{
											fieldName: 'AIRCRAFT_TYPE',
											label: 'Aircraft Type',
										},
										{
											fieldName: 'NATION',
											label: 'Nation',
										},
										{
											fieldName: 'PILOT_NAME',
											label: 'Pilot Name',
										},
										{
											fieldName: 'CRASH_LOCATION',
											label: 'Crash Location Description',
										},
										{
											fieldName: 'ACCURACY',
											Label: 'Location Accuracy',
										},
									],
								},
							],
							actions: [viewCrashAction],
						};

						var crash = new FeatureLayer({
							url: `${MAPS_URL}/sites/1`,
							popupTemplate: CrashPopup,
							format: 'json',
						});

						searchWidget.sources.push({
							layer: crash,
							searchFields: ['AIRCRAFT', 'YACSI_NUM', 'PILOT_NAME'],
							displayField: 'YACSI_NUM',
							exactMatch: false,
							outFields: ['AIRCRAFT', 'YACSI_NUM'],
							name: 'Airplane crash',
							placeholder: 'example: 1975-01',
						});

						view.when(function () {
							webmap.add(crash);
						});
					}

					view.popup.on('trigger-action', async (event) => {
						if (event.action.id === 'view-site') {
							let yhsiId = view.popup.selectedFeature.attributes.YHSI_ID;
							let results = await parent.searchByYHSIId(yhsiId);

							if (results.length > 0) {
								let item = results[0];
								window.open(`/sites/${item.id}`, '_blank');
							}
						}
						if (event.action.id === 'view-aircrash') {
							let id = view.popup.selectedFeature.attributes.YACSI_NUM;
							window.open(`/airplane/view/${id}`, '_blank');
						}
					});
				}
			);
		});
	},
};
</script>
