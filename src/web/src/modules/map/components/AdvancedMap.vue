<template>
	<div style="height: 100%">
		<v-navigation-drawer
			absolute
			temporary
			v-model="sidebarVisible"
			width="400"
		>
			<v-tabs v-model="tab" background-color="#fff2d5" color="primary">
				<v-tab key="0">Layers</v-tab>
				<v-tab key="1">Basemap</v-tab>
				<v-tab key="2">Legend</v-tab>
			</v-tabs>
			<v-tabs-items v-model="tab" style="padding: 20px">
				<v-tab-item key="0" eager>
					<div id="list"></div>
				</v-tab-item>
				<v-tab-item key="1" eager>
					<div id="gallery"></div>
				</v-tab-item>
				<v-tab-item key="2" eager>
					<div id="legend"></div>
				</v-tab-item>
			</v-tabs-items>
		</v-navigation-drawer>

		<div class="map" id="map"></div>
	</div>
</template>

<style scoped>
.map {
	height: 100%;
	border: 1px #ddd solid;
}
.esri-layer-list {
	background-color: white;
}
.esri-layer-list ul {
	background-color: green;
	padding-left: 0;
}
.esri-layer-list__item-container {
	padding-left: 0;
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
		...mapActions('maps', ['loadToken']),
		showSidebar() {
			this.sidebarVisible = true;
		},
	},
	mounted: function () {
		let parent = this;

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
				]) => {
					IdentityManager.registerToken({
						server: 'https://yukon.maps.arcgis.com',
						token: resp.access_token,
					});
					IdentityManager.registerToken({
						server: `${MAPS_URL}/sites`,
						token: resp.access_token,
					});

					const webmap = new WebMap({
						portalItem: { id: '5e6f859dadad41e5894b33a506c67f0a' },
					});

					const view = new MapView({
						container: 'map',
						map: webmap,
						zoom: 5,
					});

					var element = document.createElement('div');
					element.title="Map settings";
					element.className =
						'esri-icon-drag-horizontal esri-widget--button esri-widget esri-interactive';
					element.addEventListener('click', function () {
						//parent.showSidebar = true;
						parent.showSidebar();
					});
					view.ui.add(element, 'top-right');

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
						};

						var sites = new FeatureLayer({
							url: 'http://localhost:3000/api/maps/sites/0',
							popupTemplate: YHSIpopup,
							outFields: ['YHSI_ID'],
						});

						view.when(function () {
							webmap.add(sites);
						});
					}

					if (this.userInRole([UserRoles.AIRPLANE_CRASH_EDITOR])) {
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
						};

						var crash = new FeatureLayer({
							url: 'http://localhost:3000/api/maps/sites/1',
							popupTemplate: CrashPopup
						});

						view.when(function () {
							webmap.add(crash);
						});
					}
				}
			);
		});
	},
};
</script>
