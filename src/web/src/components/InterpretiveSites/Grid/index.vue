<template>
	<div class="">
		<h1>Interpretive Sites</h1>
		<Breadcrumbs />
		<v-row>
			<v-col
				cols="6"
				class="d-flex"
			>
				<v-text-field
					v-if="actionRoute"
					flat
					prepend-icon="mdi-magnify"
					class="mx-4"
					hide-details
					label="Search"
					v-model="searchAction"
					@keyup.enter="actionSearchChange()"
					v-on:input="actionSearchChange()"
				></v-text-field>

				<v-text-field
					v-else-if="assetRoute"
					flat
					prepend-icon="mdi-magnify"
					class="mx-4"
					hide-details
					label="Search by description"
					v-model="searchAsset"
					@keyup.enter="assetSearchChange()"
					v-on:input="assetSearchChange()"
				></v-text-field>

				<v-text-field
					v-else
					flat
					prepend-icon="mdi-magnify"
					class="mx-4"
					hide-details
					label="Search by site name"
					v-model="searchSite"
					@keyup.enter="siteSearchChange()"
					v-on:input="siteSearchChange()"
				></v-text-field>

				<v-menu
					transition="slide-y-transition"
					bottom
					:close-on-content-click="false"
				>
					<template v-slot:activator="{ on, attrs }">
						<v-btn
							color="transparent"
							class="black--text"
							v-bind="attrs"
							v-on="on"
						>
							<v-icon class="black--text mr-1">mdi-filter</v-icon>
							Filter

							<v-icon class="black--text">mdi-chevron-right</v-icon>
						</v-btn>
					</template>
					<v-list v-if="siteRoute">
						<v-list-item
							v-for="(item, i) in siteFilterOptions"
							:key="`site-filter-list-opt-${i}`"
							link
						>
							<v-text-field
								clearable
								@blur="siteFilterChange"
								v-model="item.value"
								:label="item.text"
							></v-text-field>
						</v-list-item>
					</v-list>
					<v-list v-else-if="actionRoute">
						<v-list-item
							v-for="(item, i) in actionFilterOptions"
							:key="`action-filter-list-opt-${i}`"
							link
						>
							<v-text-field
								clearable
								@blur="actionFilterChange"
								v-model="item.value"
								:label="item.text"
							></v-text-field>
						</v-list-item>
					</v-list>
					<v-list v-else>
						<v-list-item
							v-for="(item, i) in displayAssetOptions"
							:key="`asset-filter-list-opt-${i}`"
							link
						>
							<v-text-field
								clearable
								@blur="assetFilterChange"
								v-model="item.value"
								:label="item.text"
							></v-text-field>
						</v-list-item>
						<v-list-item>
							<v-select
								@blur="assetFilterChange"
								:items="[
									{ text: 'Active', value: 'Yes' },
									{ text: 'Inactive', value: 'No' },
								]"
								label="Status"
								name="Status"
								item-text="text"
								item-value="value"
								v-model="assetFilterOptions[8].value"
							>
							</v-select>
						</v-list-item>
						<v-list-item>
							<v-select
								@blur="assetFilterChange"
								:items="assetTypes"
								label="Type"
								name="Type"
								item-text="Type"
								item-value="Type"
								v-model="assetFilterOptions[1].value"
							>
							</v-select>
						</v-list-item>
					</v-list>
				</v-menu>
			</v-col>
			<v-spacer></v-spacer>
			<v-col
				cols="auto"
				v-if="actionRoute"
				class="d-flex"
			>
				<ActionDialog
					:type="'grid'"
					:mode="'new'"
					@newAction="newAction"
				/>

				<v-btn
					class="black--text mx-1"
					@click="getActionsExport()"
					:loading="loadingExport"
				>
					<v-icon class="mr-1"> mdi-export </v-icon>
					Export
				</v-btn>

				<v-btn
					@click="downloadActionsPdf()"
					class="black--text mx-1"
					:loading="loadingPdf"
				>
					<v-icon class="mr-1"> mdi-printer </v-icon>
					Print
				</v-btn>
			</v-col>
			<v-col
				cols="auto"
				v-else-if="assetRoute"
				class="d-flex"
			>
				<AssetDialog
					:type="'grid'"
					:mode="'new'"
					@gridAssetAdded="gridAssetAdded"
				/>

				<v-btn
					class="black--text mx-1"
					@click="getAssetsExport()"
					:loading="loadingExport"
				>
					<v-icon class="mr-1"> mdi-export </v-icon>
					Export
				</v-btn>

				<v-btn
					@click="downloadAssetsPdf()"
					class="black--text mx-1"
					:loading="loadingPdf"
				>
					<v-icon class="mr-1"> mdi-printer </v-icon>
					Print
				</v-btn>
			</v-col>
			<v-col
				cols="auto"
				v-else
				class="d-flex"
			>
				<v-btn
					class="black--text mx-1"
					@click="addNewSite"
				>
					<v-icon class="mr-1">mdi-plus-circle-outline</v-icon>
					Add Site
				</v-btn>

				<v-btn
					class="black--text mx-1"
					@click="getSitesExport()"
					:loading="loadingExport"
				>
					<v-icon class="mr-1"> mdi-export </v-icon>
					Export
				</v-btn>

				<v-btn
					@click="downloadSitesPdf()"
					class="black--text mx-1"
					:loading="loadingPdf"
				>
					<v-icon class="mr-1"> mdi-printer </v-icon>
					Print
				</v-btn>
			</v-col>
		</v-row>
		<div class="mt-2">
			<v-card>
				<v-tabs v-model="active_tab">
					<v-tab
						key="1"
						:to="{ path: '/interpretive-sites/' }"
						:class="siteRoute ? '' : 'notActive'"
					>
						<v-icon class="mr-1">mdi-clipboard-check</v-icon>
						Sites
					</v-tab>
					<v-tab
						key="2"
						:to="{ path: '/interpretive-sites/actions' }"
					>
						<v-icon class="mr-1">mdi-gesture-tap</v-icon>
						Actions
					</v-tab>
					<v-tab
						key="3"
						:to="{ path: '/interpretive-sites/assets' }"
					>
						<v-icon class="mr-1">mdi-database</v-icon>
						Assets
					</v-tab>
				</v-tabs>
				<v-divider class="mb-4"></v-divider>
				<router-view id="rv-int-sites" />
			</v-card>
		</div>
	</div>
</template>

<script>
import catalogs from '../../../controllers/catalogs';
import Breadcrumbs from '../../Breadcrumbs';
import ActionDialog from '../Dialogs/ActionDialog.vue';
import AssetDialog from '../Dialogs/AssetDialog.vue';
import downloadCsv from '../../../utils/dataToCsv';
import downloadPdf from '../../../utils/dataToPdf';
import _ from 'lodash';
import interpretiveSites from '../../../controllers/interpretive-sites';
//import jsPDF from "jspdf";
export default {
	name: 'int-sites-grid-index',
	components: { Breadcrumbs, ActionDialog, AssetDialog },
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
		isActive(route) {
			//this function helps to show certain classes depending on the route
			//route.includes("sites") ? "notActive" : route.includes("actions") ? : ;
			console.log(route);
			return 'notActive';
		},
		gridAssetAdded(val) {
			console.log(val);
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

<style scoped>
#horizontal-list {
	display: flex;
}
.notActive {
	color: rgba(0, 0, 0, 0.54) !important;
}
</style>
