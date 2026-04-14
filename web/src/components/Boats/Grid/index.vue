<template>
	<div>
		<v-breadcrumbs
			:items="[
				{ text: 'Home', to: '/', exact: true },
				{ text: 'Boats' },
			]"
		></v-breadcrumbs>

		<h1>Boats</h1>

		<div class="mt-2">
			<v-card class="default px-3 py-3">
				<v-card-text>
					<div class="d-flex mb-6">
						<v-text-field
							v-if="$route.path.includes('owner')"
							prepend-inner-icon="mdi-magnify"
							background-color="white"
							outlined
							dense
							label="Search"
							v-model="searchOwner"
							hide-details
							class="mr-5"
							@keyup.enter="ownerSearchChange()"
							v-on:input="ownerSearchChange()"
						/>

						<v-text-field
							v-else
							prepend-inner-icon="mdi-magnify"
							background-color="white"
							outlined
							dense
							label="Search"
							v-model="searchBoat"
							hide-details
							class="mr-5"
							@keyup.enter="boatSearchChange()"
							v-on:input="boatSearchChange()"
						/>

						<v-menu
							v-if="!$route.path.includes('owner')"
							transition="slide-y-transition"
							bottom
							:close-on-content-click="false"
						>
							<template v-slot:activator="{ on, attrs }">
								<v-btn
									color="transparent"
									class="black--text my-0 mr-2"
									style="height: 40px"
									v-bind="attrs"
									v-on="on"
								>
									<v-icon class="black--text mr-1">mdi-filter</v-icon>
									Filter
									<v-icon class="black--text">mdi-chevron-right</v-icon>
								</v-btn>
							</template>
							<v-list>
								<v-list-item
									v-for="(item, i) in filterOptions"
									:key="`filter-list-opt-${i}`"
									link
								>
									<v-text-field
										clearable
										@blur="filterChange"
										v-model="item.value"
										:label="item.name"
									></v-text-field>
								</v-list-item>
							</v-list>
						</v-menu>

						<v-btn
							v-if="userIsEditor && $route.path.includes('owner')"
							color="primary"
							class="my-0 mr-2"
							style="height: 40px"
							@click="addNewOwner"
						>
							Add Owner
						</v-btn>
						<v-btn
							v-if="userIsEditor && !$route.path.includes('owner')"
							color="primary"
							class="my-0 mr-2"
							style="height: 40px"
							@click="addNewBoat"
						>
							Add Boat
						</v-btn>

						<v-btn
							v-if="$route.path.includes('owner')"
							color="info"
							class="my-0 mr-2"
							style="height: 40px"
							@click="downloadPdfOwners()"
							:loading="loadingPdf"
							title="Print"
						>
							<v-icon>mdi-printer</v-icon>
						</v-btn>
						<v-btn
							v-else
							color="info"
							class="my-0 mr-2"
							style="height: 40px"
							@click="downloadPdf()"
							:loading="loadingPdf"
							title="Print"
						>
							<v-icon>mdi-printer</v-icon>
						</v-btn>

						<v-btn
							v-if="$route.path.includes('owner')"
							color="info"
							class="my-0"
							style="height: 40px"
							@click="getOwnerExport()"
							:loading="loadingExport"
							title="Export CSV"
						>
							<v-icon>mdi-export</v-icon>
						</v-btn>
						<v-btn
							v-else
							color="info"
							class="my-0"
							style="height: 40px"
							@click="getBoatExport()"
							:loading="loadingExport"
							title="Export CSV"
						>
							<v-icon>mdi-export</v-icon>
						</v-btn>
					</div>

					<v-tabs v-model="active_tab">
						<v-tab
							key="1"
							:to="{ path: '/boats/' }"
							:class="`${isActive($route.path)}`"
						>
							<v-icon class="mr-1">mdi-ferry</v-icon>
							Boats
						</v-tab>
						<v-tab
							key="2"
							:to="{ path: '/boats/owner' }"
						>
							<v-icon class="mr-1">mdi-account-tie</v-icon>
							Owner
						</v-tab>
					</v-tabs>
					<v-divider class="mb-4"></v-divider>
					<router-view id="rv-boats" />
				</v-card-text>
			</v-card>
		</div>
	</div>
</template>

<script>
import downloadCsv from '../../../utils/dataToCsv';
import downloadPdf from '../../../utils/dataToPdf';
import _ from 'lodash';
import boats from '../../../controllers/boats';
import owners from '../../../controllers/owners';
import { UserRoles } from '../../../authorization';

//import jsPDF from "jspdf";
export default {
	name: 'boatsgrid-index',
	components: {},
	data: () => ({
		route: '',
		active_tab: '',
		searchOwner: '',
		searchBoat: '',
		filterOptions: [
			{ name: 'Owner', value: '', dataAccess: 'Owner' },
			{ name: 'Construction Date', value: '', dataAccess: 'ConstructionDate' },
			{ name: 'Service Start', value: '', dataAccess: 'ServiceStart' },
			{ name: 'Service End', value: '', dataAccess: 'ServiceEnd' },
			{ name: 'Vessel Type', value: '', dataAccess: 'VesselType' },
		],
		selectedItem: 1,
		items: [
			{ text: 'Real-Time', icon: 'mdi-clock' },
			{ text: 'Audience', icon: 'mdi-account' },
			{ text: 'Conversions', icon: 'mdi-flag' },
		],
		boatsData: [],
		ownersData: [],
		loadingPdf: false,
		loadingExport: false,
		boatHeaders: [
			{ text: 'Name', dataAccess: 'Name' },
			{ text: 'Owner', dataAccess: 'owners', sortable: false },
			{ text: 'Vessel Type', dataAccess: 'VesselType' },
			{ text: 'Construction Date', dataAccess: 'ConstructionDate' },
			{ text: 'Service Start Date', dataAccess: 'ServiceStart' },
			{ text: 'Service End Date', dataAccess: 'ServiceEnd' },
			{ text: 'Current Location Description', dataAccess: 'CurrentLocation' },
			{ text: 'Req Number', dataAccess: 'RegistrationNumber' },
		],
	}),
	async mounted() {
		if (this.$route.path.includes('owner')) {
			//shows the buttons for owner
			this.route = 'owner';
		} else {
			//shows the buttons for boats
			this.route = 'boats';
		}
		// await this.getBoatExport();
		// await this.getOwnerExport();
	},
	methods: {
		addNewBoat() {
			this.$router.push(`/boats/new`);
		},
		addNewOwner() {
			this.$router.push(`/boats/owner/new`);
		},
		ownerSearchChange: _.debounce(function () {
			this.$store.commit('boats/setOwnerSearch', this.searchOwner);
			//this.getOwnerExport();
		}, 400),
		boatSearchChange: _.debounce(function () {
			this.$store.commit('boats/setBoatSearch', this.searchBoat);
			//this.getBoatExport();
		}, 400),
		filterChange() {
			this.$store.commit('boats/setSelectedFilters', this.filterOptions);
			//this.getBoatExport();
		},
		isActive(route) {
			//this function helps to show certain classes depending on the route
			return route.includes('owner') ? 'notActive' : '';
		},
		async getOwnerExport() {
			this.loadingExport = true;
			let o = this.ownerTableOptions;
			let data = await owners.getExport(
				this.searchOwner,
				o.sortBy[0] ? o.sortBy[0] : 'OwnerName',
				o.sortDesc[0] ? 'desc' : 'asc'
			);
			downloadCsv(data, 'owners');
			this.loadingExport = false;
		},
		async getBoatExport() {
			this.loadingExport = true;
			let textToMatch = this.searchBoat;
			const prefilters = {};
			let b = this.boatTableOptions;
			this.filterOptions.map((x) => {
				prefilters[x.dataAccess] = x.value;
			});
			let data = await boats.getExport(
				textToMatch,
				b.sortBy[0] ? b.sortBy[0] : 'Name',
				b.sortDesc[0] ? 'desc' : 'asc',
				prefilters.Owner,
				prefilters.ConstructionDate,
				prefilters.ServiceStart,
				prefilters.ServiceEnd,
				prefilters.VesselType
			);

			downloadCsv(data, 'boats');
			this.loadingExport = false;
		},
		async downloadPdf() {
			this.loadingPdf = true;
			let b = this.boatTableOptions;

			let res = await boats.getGridPdf(
				this.searchBoat,
				b.sortBy[0] ? b.sortBy[0] : 'Name',
				b.sortDesc[0] ? 'desc' : 'asc'
			);
			downloadPdf(res, 'Boats');
			this.loadingPdf = false;
		},
		async downloadPdfOwners() {
			this.loadingPdf = true;
			let o = this.ownerTableOptions;
			let res = await owners.getGridPdf(
				this.searchOwner,
				o.sortBy[0] ? o.sortBy[0] : 'OwnerName',
				o.sortDesc[0] ? 'desc' : 'asc'
			);
			downloadPdf(res, 'Owners');
			this.loadingPdf = false;
		},
	},
	computed: {
		userIsEditor() {
			return this.$store.getters.userInRole([UserRoles.BOATS_EDITOR]);
		},
		boatTableOptions() {
			return this.$store.getters['boats/boatTableOptions'];
		},
		ownerTableOptions() {
			return this.$store.getters['boats/ownerTableOptions'];
		},
	},
	watch: {},
};
</script>
