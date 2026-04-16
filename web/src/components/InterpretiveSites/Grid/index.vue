<template>
	<div>
		<v-breadcrumbs :items="[
			{ text: 'Home', to: '/', exact: true },
			{ text: 'Interpretive Sites' },
		]"></v-breadcrumbs>

		<h1>Interpretive Sites</h1>

		<div class="mt-2">
			<v-card class="default">
				<v-tabs v-model="active_tab">
					<v-tab key="1" :to="{ path: '/interpretive-sites/' }" :class="siteRoute ? '' : 'notActive'">
						<v-icon class="mr-1">mdi-clipboard-check</v-icon>
						Sites
					</v-tab>
					<v-tab key="2" :to="{ path: '/interpretive-sites/actions' }">
						<v-icon class="mr-1">mdi-gesture-tap</v-icon>
						Actions
					</v-tab>
					<v-tab key="3" :to="{ path: '/interpretive-sites/assets' }">
						<v-icon class="mr-1">mdi-database</v-icon>
						Assets
					</v-tab>
				</v-tabs>
				<v-divider></v-divider>
				<v-card-text>
					<div class="d-flex mb-6">
						<v-text-field v-if="actionRoute" prepend-inner-icon="mdi-magnify" background-color="white"
							outlined dense hide-details label="Search" v-model="searchAction" class="mr-5"
							@keyup.enter="actionSearchChange()" v-on:input="actionSearchChange()" />

						<v-text-field v-else-if="assetRoute" prepend-inner-icon="mdi-magnify" background-color="white"
							outlined dense hide-details label="Search by description" v-model="searchAsset" class="mr-5"
							@keyup.enter="assetSearchChange()" v-on:input="assetSearchChange()" />

						<v-text-field v-else prepend-inner-icon="mdi-magnify" background-color="white" outlined dense
							hide-details label="Search by site name" v-model="searchSite" class="mr-5"
							@keyup.enter="siteSearchChange()" v-on:input="siteSearchChange()" />

						<v-menu transition="slide-y-transition" bottom :close-on-content-click="false">
							<template v-slot:activator="{ on, attrs }">
								<v-btn color="transparent" class="black--text my-0 mr-2" style="height: 40px"
									v-bind="attrs" v-on="on">
									<v-icon class="black--text mr-1">mdi-filter</v-icon>
									Filter
									<v-icon class="black--text">mdi-chevron-right</v-icon>
								</v-btn>
							</template>
							<v-list v-if="siteRoute">
								<v-list-item v-for="(item, i) in siteFilterOptions" :key="`site-filter-list-opt-${i}`"
									link>
									<v-text-field clearable @blur="siteFilterChange" v-model="item.value"
										:label="item.text"></v-text-field>
								</v-list-item>
							</v-list>
							<v-list v-else-if="actionRoute">
								<v-list-item v-for="(item, i) in actionFilterOptions"
									:key="`action-filter-list-opt-${i}`" link>
									<v-text-field clearable @blur="actionFilterChange" v-model="item.value"
										:label="item.text"></v-text-field>
								</v-list-item>
							</v-list>
							<v-list v-else>
								<v-list-item v-for="(item, i) in displayAssetOptions"
									:key="`asset-filter-list-opt-${i}`" link>
									<v-text-field clearable @blur="assetFilterChange" v-model="item.value"
										:label="item.text"></v-text-field>
								</v-list-item>
								<v-list-item>
									<v-select @blur="assetFilterChange" :items="[
										{ text: 'Active', value: 'Yes' },
										{ text: 'Inactive', value: 'No' },
									]" label="Status" name="Status" item-text="text" item-value="value" v-model="assetFilterOptions[8].value">
									</v-select>
								</v-list-item>
								<v-list-item>
									<v-select @blur="assetFilterChange" :items="assetTypes" label="Type" name="Type"
										item-text="Type" item-value="Type" v-model="assetFilterOptions[1].value">
									</v-select>
								</v-list-item>
							</v-list>
						</v-menu>

						<!-- Sites buttons -->
						<template v-if="siteRoute">
							<v-btn color="primary" class="my-0 mr-2" style="height: 40px" @click="addNewSite">
								Add Site
							</v-btn>
							<v-btn color="info" class="my-0 mr-2" style="height: 40px" @click="downloadSitesPdf()"
								:loading="loadingPdf" title="Print">
								<v-icon>mdi-printer</v-icon>
							</v-btn>
							<v-btn color="info" class="my-0 mr-2" style="height: 40px" @click="getSitesExport()"
								:loading="loadingExport" title="Export">
								<v-icon>mdi-export</v-icon>
							</v-btn>
						</template>

						<!-- Actions buttons -->
						<template v-else-if="actionRoute">
							<ActionDialog :type="'grid'" :mode="'new'" @gridActionAdded="newAction" />
							<v-btn color="info" class="my-0 mr-2" style="height: 40px" @click="downloadActionsPdf()"
								:loading="loadingPdf" title="Print">
								<v-icon>mdi-printer</v-icon>
							</v-btn>
							<v-btn color="info" class="my-0 mr-2" style="height: 40px" @click="getActionsExport()"
								:loading="loadingExport" title="Export">
								<v-icon>mdi-export</v-icon>
							</v-btn>
						</template>

						<!-- Assets buttons -->
						<template v-else-if="assetRoute">
							<AssetDialog :type="'grid'" :mode="'new'" @gridAssetAdded="gridAssetAdded" />
							<v-btn color="info" class="my-0 mr-2" style="height: 40px" @click="downloadAssetsPdf()"
								:loading="loadingPdf" title="Print">
								<v-icon>mdi-printer</v-icon>
							</v-btn>
							<v-btn color="info" class="my-0 mr-2" style="height: 40px" @click="getAssetsExport()"
								:loading="loadingExport" title="Export">
								<v-icon>mdi-export</v-icon>
							</v-btn>
						</template>
					</div>

					<router-view id="rv-int-sites" />
				</v-card-text>
			</v-card>
		</div>
	</div>
</template>

<script>
import catalogs from '../../../controllers/catalogs';
import ActionDialog from '../Dialogs/ActionDialog.vue';
import AssetDialog from '../Dialogs/AssetDialog.vue';
import downloadCsv from '../../../utils/dataToCsv';
import downloadPdf from '../../../utils/dataToPdf';
import _ from 'lodash';
import interpretiveSites from '../../../controllers/interpretive-sites';
//import jsPDF from "jspdf";
export default {
	name: 'int-sites-grid-index',
	components: { ActionDialog, AssetDialog },
	data: () => ({
		route: '',
		active_tab: '',
		searchSite: '',
		searchAction: '',
		searchAsset: '',
		siteFilterOptions: [
			{ text: 'Location Description', value: '', dataAccess: 'LocationDesc' },
			{ text: 'Route Name', value: '', dataAccess: 'RouteName' },
			{ text: 'KMNum', value: '', dataAccess: 'KMNum' },
			{ text: 'MapSheet', value: '', dataAccess: 'MapSheet' },
			{ text: 'Latitude', value: '', dataAccess: 'Latitude' },
			{ text: 'Longitude', value: '', dataAccess: 'Longitude' },
			{ text: 'Established Year', value: '', dataAccess: 'EstablishedYear' },
			{
				text: 'Advanced Notification',
				value: '',
				dataAccess: 'AdvancedNotification',
			},
			{
				text: 'Notification Description',
				value: '',
				dataAccess: 'NotificationDesc',
			},
		],
		actionFilterOptions: [
			//{ text: 'Action Required', value: '', dataAccess: 'ActionDesc' },
			{ text: 'To be Completed by', value: '', dataAccess: 'CompletedBy' },
			{ text: 'Priority', value: '', dataAccess: 'Priority' },
			{ text: 'Completed date', value: '', dataAccess: 'ActionCompleteDate' },
			{ text: 'Completion Notes', value: '', dataAccess: 'CompletionDesc' },
		],
		assetFilterOptions: [
			{ text: 'Category', value: '', dataAccess: 'Category' },
			{ text: 'Type', value: '', dataAccess: 'Type' },
			{ text: 'Size', value: '', dataAccess: 'Size' },
			{ text: 'Description', value: '', dataAccess: 'Description' },
			{ text: 'SignText', value: '', dataAccess: 'SignText' },
			{ text: 'InstallDate', value: '', dataAccess: 'InstallDate' },
			{ text: 'DecommissionDate', value: '', dataAccess: 'DecommissionDate' },
			{ text: 'DecommissionNotes', value: '', dataAccess: 'DecommissionNotes' },
			{ text: 'Status', value: '', dataAccess: 'Status' },
		],
		selectedItem: 1,
		items: [
			{ text: 'Real-Time', icon: 'mdi-clock' },
			{ text: 'Audience', icon: 'mdi-account' },
			{ text: 'Conversions', icon: 'mdi-flag' },
		],
		loadingPdf: false,
		loadingExport: false,
		assetTypes: [],
	}),
	async mounted() {
		this.getTypes();
	},
	methods: {
		async getTypes() {
			this.loadingCatalogs = true;
			this.assetTypes = await catalogs.getAssetType();
			this.loadingCatalogs = false;
		},
		addNewSite() {
			this.$router.push(`/interpretive-sites/new`);
		},
		addNewAction() {
			this.$router.push(`/interpretive-sites/action/new`);
		},
		addNewAsset() {
			this.$router.push(`/interpretive-sites/asset/new`);
		},
		siteSearchChange: _.debounce(function () {
			this.$store.commit('interpretiveSites/setSiteSearch', this.searchSite);
		}, 400),
		actionSearchChange: _.debounce(function () {
			this.$store.commit(
				'interpretiveSites/setActionSearch',
				this.searchAction
			);
		}, 400),
		assetSearchChange: _.debounce(function () {
			this.$store.commit('interpretiveSites/setAssetSearch', this.searchAsset);
		}, 400),
		siteFilterChange() {
			this.$store.commit(
				'interpretiveSites/setSiteFilters',
				this.siteFilterOptions
			);
		},
		actionFilterChange() {
			this.$store.commit(
				'interpretiveSites/setActionFilters',
				this.actionFilterOptions
			);
		},
		assetFilterChange() {
			this.$store.commit(
				'interpretiveSites/setAssetFilters',
				this.assetFilterOptions
			);
		},
		gridAssetAdded() {
			this.$router.go();
		},
		newAction() {
			this.$router.go();
		},
		async getSitesExport() {
			this.loadingExport = true;
			let { sortBy, sortDesc } = this.siteTableOptions;
			let textToMatch = this.searchSite;
			const prefilters = {};
			this.siteFilterOptions.map((x) => {
				prefilters[x.dataAccess] = x.value;
			});
			let data = await interpretiveSites.getSitesExport(
				sortBy[0],
				sortDesc[0] ? 'desc' : 'asc',
				textToMatch, //prefilters.SiteName,
				prefilters.LocationDesc,
				prefilters.RouteName,
				prefilters.KMNum,
				prefilters.MapSheet,
				prefilters.Latitude,
				prefilters.Longitude,
				prefilters.EstablishedYear,
				prefilters.AdvancedNotification,
				prefilters.NotificationDesc
			);
			downloadCsv(data, 'sites');
			this.loadingExport = false;
		},
		async downloadSitesPdf() {
			this.loadingPdf = true;
			let { sortBy, sortDesc } = this.siteTableOptions;
			const prefilters = {};
			this.siteFilterOptions.map((x) => {
				prefilters[x.dataAccess] = x.value;
			});
			let res = await interpretiveSites.getGridPdf(
				sortBy[0],
				sortDesc[0] ? 'desc' : 'asc',
				this.searchSite, //prefilters.SiteName,
				prefilters.LocationDesc,
				prefilters.RouteName,
				prefilters.KMNum,
				prefilters.MapSheet,
				prefilters.Latitude,
				prefilters.Longitude,
				prefilters.EstablishedYear,
				prefilters.AdvancedNotification,
				prefilters.NotificationDesc
			);
			downloadPdf(res, 'sites');
			this.loadingPdf = false;
		},
		async getActionsExport() {
			this.loadingExport = true;
			let { sortBy, sortDesc } = this.actionTableOptions;
			let textToMatch = this.searchAction;
			const prefilters = {};
			this.actionFilterOptions.map((x) => {
				prefilters[x.dataAccess] = x.value;
			});
			let data = await interpretiveSites.getActionsExport(
				textToMatch,
				prefilters.ToBeCompleteDate,
				prefilters.ActionCompleteDate,
				prefilters.CompletionDesc,
				prefilters.Priority,
				prefilters.CreatedBy,
				prefilters.CreatedDate,
				prefilters.CompletedBy,
				sortBy[0],
				sortDesc[0] ? 'desc' : 'asc'
			);
			// let data = await interpretiveSites.getExport(
			// 	sortBy[0],
			// 	sortDesc[0] ? 'desc' : 'asc',
			// 	textToMatch, //prefilters.SiteName,
			// 	prefilters.LocationDesc,
			// 	prefilters.RouteName,
			// 	prefilters.KMNum,
			// 	prefilters.MapSheet,
			// 	prefilters.Latitude,
			// 	prefilters.Longitude,
			// 	prefilters.EstablishedYear,
			// 	prefilters.AdvancedNotification,
			// 	prefilters.NotificationDesc
			// );
			downloadCsv(data, 'actions');
			this.loadingExport = false;
		},
		async downloadActionsPdf() {
			this.loadingPdf = true;
			let { sortBy, sortDesc } = this.actionTableOptions;

			const prefilters = {};
			this.actionFilterOptions.map((x) => {
				prefilters[x.dataAccess] = x.value;
			});
			let res = await interpretiveSites.getActionsGridPdf(
				this.searchAction,
				prefilters.ToBeCompleteDate,
				prefilters.ActionCompleteDate,
				prefilters.CompletionDesc,
				prefilters.Priority,
				prefilters.CreatedBy,
				prefilters.CreatedDate,
				prefilters.CompletedBy,
				sortBy[0],
				sortDesc[0] ? 'desc' : 'asc'
			);
			downloadPdf(res, 'actions');
			this.loadingPdf = false;
		},
		async getAssetsExport() {
			this.loadingExport = true;
			let { sortBy, sortDesc } = this.assetTableOptions;
			let textToMatch = this.searchAsset;
			const prefilters = {};
			this.assetFilterOptions.map((x) => {
				prefilters[x.dataAccess] = x.value;
			});
			let data = await interpretiveSites.getAssetsExport(
				//prefilters.SiteName,
				prefilters.Category,
				prefilters.Type,
				prefilters.Size,
				//	prefilters.Description,
				textToMatch,
				prefilters.SignText,
				prefilters.InstallDate,
				prefilters.DecommissionDate,
				prefilters.DecommissionNotes,
				prefilters.Status,
				sortBy[0],
				sortDesc[0] ? 'desc' : 'asc'
			);
			downloadCsv(data, 'assets');
			this.loadingExport = false;
		},
		async downloadAssetsPdf() {
			this.loadingPdf = true;
			let { sortBy, sortDesc } = this.assetTableOptions;
			const prefilters = {};
			this.assetFilterOptions.map((x) => {
				prefilters[x.dataAccess] = x.value;
			});
			let res = await interpretiveSites.getAssetsGridPdf(
				//prefilters.SiteName,
				prefilters.Category,
				prefilters.Type,
				prefilters.Size,
				//	prefilters.Description,
				this.searchAsset,
				prefilters.SignText,
				prefilters.InstallDate,
				prefilters.DecommissionDate,
				prefilters.DecommissionNotes,
				prefilters.Status,
				sortBy[0],
				sortDesc[0] ? 'desc' : 'asc'
			);
			downloadPdf(res, 'assets');
			this.loadingPdf = false;
		},
	},
	computed: {
		displayAssetOptions() {
			return this.assetFilterOptions.filter(
				(x) => x.dataAccess !== 'Type' && x.dataAccess != 'Status'
			);
		},
		currentRoute() {
			if (this.$route.path.includes('actions')) {
				return 'actions';
			}
			if (this.$route.path.includes('assets')) {
				return 'assets';
			} else {
				return 'sites';
			}
		},
		actionRoute() {
			if (this.$route.path.includes('actions')) {
				//this.route = "actions";
				return true;
			}
			return false;
		},
		assetRoute() {
			if (this.$route.path.includes('assets')) {
				//this.route = "assets";
				return true;
			}
			return false;
		},
		siteRoute() {
			if (
				!this.$route.path.includes('actions') &&
				!this.$route.path.includes('assets')
			) {
				return true;
			}
			return false;
		},
		siteTableOptions() {
			return this.$store.getters['interpretiveSites/siteTableOptions'];
		},
		actionTableOptions() {
			return this.$store.getters['interpretiveSites/actionTableOptions'];
		},
		assetTableOptions() {
			return this.$store.getters['interpretiveSites/assetTableOptions'];
		},
	},
	watch: {},
};
</script>
