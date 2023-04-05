<template>
	<div class="">
		<h1>Airplane Crash Sites</h1>
		<Breadcrumbs />
		<v-row>
			<v-col
				cols="6"
				class="d-flex"
			>
				<v-text-field
					flat
					prepend-icon="mdi-magnify"
					class="mx-4"
					hide-details
					label="Search"
					v-model="search"
					v-on:input="crashsiteSearchChange()"
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
					<v-list>
						<v-list-item
							v-for="(item, i) in filterOptions"
							:key="i"
							link
						>
							<v-text-field
								clearable
								@blur="getDataFromApi"
								v-model="item.value"
								:label="item.name"
							></v-text-field>
						</v-list-item>
					</v-list>
				</v-menu>
			</v-col>
			<v-spacer></v-spacer>
			<v-col
				cols="auto"
				class="d-flex"
			>
				<v-btn
					class="black--text mx-1"
					@click="addNewBoat"
				>
					<v-icon class="mr-1">mdi-plus-circle-outline</v-icon>
					Add Crash Site
				</v-btn>

				<v-btn
					@click="exportData()"
					class="black--text mx-1"
					:loading="loadingExport"
				>
					<v-icon class="mr-1"> mdi-export </v-icon>
					Export
				</v-btn>

				<v-btn
					@click="downloadPdf()"
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
				<v-container fluid>
					<v-row>
						<v-col cols="12">
							<h2
								v-if="crashsites"
								class="ma-2"
							>
								{{ filteredData.length }} results out of {{ totalLength }}
							</h2>
						</v-col>
					</v-row>
					<v-divider
						inset
						class="mb-4"
					></v-divider>
					<v-row>
						<v-col>
							<v-data-table
								:items="filteredData"
								:headers="headers"
								:loading="loading"
								:search="search"
								:options.sync="options"
								:server-items-length="totalLength"
								@click:row="handleClick"
								:footer-props="{ 'items-per-page-options': [10, 30, 50, 100] }"
							>
								<template v-slot:item.crashlocation="{ item }">
									<div style="width: 200px">
										{{ item.crashlocation }}
									</div>
								</template>
							</v-data-table>
						</v-col>
					</v-row>
				</v-container>
			</v-card>
		</div>
	</div>
</template>

<script>
import Breadcrumbs from '../../Breadcrumbs';
import downloadCsv from '../../../utils/dataToCsv';
import _ from 'lodash';
import aircrash from '../../../controllers/aircrash';
export default {
	name: 'boatsgrid-index',
	components: { Breadcrumbs },
	data: () => ({
		route: '',
		loading: false,
		crashsites: [],
		search: '',
		headers: [
			{ text: 'YACSI Number', value: 'yacsinumber' },
			{ text: 'Crash Date', value: 'crashdate' },
			{ text: 'Aircraft Type', value: 'aircrafttype' },
			{ text: 'Aircraft Registration', value: 'aircraftregistration' },
			{ text: 'Country of Registration', value: 'nation' },
			{ text: 'Registration Type', value: 'militarycivilian' },
			{ text: 'Location Description', value: 'crashlocation' },
			{ text: 'Pilot First Name', value: 'pilotfirstname' },
			{ text: 'Pilot Last Name', value: 'pilotlastname' },
			{ text: 'Souls Onboard', value: 'soulsonboard' },
			{ text: 'Injuries', value: 'injuries' },
			{ text: 'Fatalities', value: 'fatalities' },
		],
		//table options
		page: 0,
		pageCount: 6,
		totalLength: 0,
		options: { itemsPerPage: 50 },
		filterOptions: [
			{ name: 'Crash Date', value: '', dataAccess: 'crashdate' },
			{ name: 'Maker', value: '', dataAccess: 'aircrafttype' },
			{
				name: 'Aircraft Registration',
				value: '',
				dataAccess: 'aircraftregistration',
			},
			{ name: 'Country of Registration', value: '', dataAccess: 'nation' },
			{ name: 'Registration Type', value: '', dataAccess: 'militarycivilian' },
			{ name: 'Pilot', value: '', dataAccess: 'pilot' },
			{ name: 'Souls Onboard', value: '', dataAccess: 'soulsonboard' },
			{ name: 'Injuries', value: '', dataAccess: 'injuries' },
			{ name: 'Fatalities', value: '', dataAccess: 'fatalities' },
		],
		selectedItem: 1,
		items: [
			{ text: 'Real-Time', icon: 'mdi-clock' },
			{ text: 'Audience', icon: 'mdi-account' },
			{ text: 'Conversions', icon: 'mdi-flag' },
		],
		aircrashesData: [],
		loadingPdf: false,
		loadingExport: false,
	}),
	mounted() {
		this.getDataFromApi();
	},
	methods: {
		addNewBoat() {
			this.$router.push(`/airplane/new`);
		},
		crashsiteSearchChange: _.debounce(function () {
			this.getDataFromApi();
		}, 400),
		handleClick(value) {
			//Redirects the user to the airplane form component
			this.$router.push({
				name: 'airplaneView',
				params: { name: value.yacsinumber, yacsinumber: value.yacsinumber },
			});
		},
		async getDataFromApi() {
			this.loading = true;
			let { page, itemsPerPage, sortBy, sortDesc } = this.options;
			page = page > 0 ? page - 1 : 0;
			itemsPerPage = itemsPerPage === undefined ? 10 : itemsPerPage;
			let textToMatch = this.search;
			const prefilters = {};
			this.filterOptions.map((x) => {
				prefilters[x.dataAccess] = x.value;
			});

			//Looks like it's checking against an array with an offset error of 1
			//ex: when searching injuries=3, actually get souldsonboard=3

			let data = await aircrash.get(
				page,
				itemsPerPage,
				textToMatch,
				sortBy[0],
				sortDesc[0] ? 'desc' : 'asc',
				prefilters.crashdate,
				prefilters.aircrafttype,
				prefilters.aircraftregistration,
				prefilters.nation,
				prefilters.militarycivilian,
				prefilters.crashlocation,
				prefilters.pilot,
				prefilters.soulsonboard,
				prefilters.injuries,
				prefilters.fatalities
			);
			this.crashsites = data.body;
			this.totalLength = data.count;
			this.crashsites.map((x) => {
				x.crashdate = this.formatDate(x.crashdate);
			});
			this.loading = false;
		},
		formatDate(date) {
			if (!date) return null;
			date = date.substr(0, 10);
			const [year, month, day] = date.split('-');
			return `${month}/${day}/${year}`;
		},
		//if its needed
		getPilot(name, lastname) {
			if (!name || !lastname) return '';

			return `${name}, ${lastname}`;
		},
		async exportData() {
			this.loadingExport = true;
			let { sortBy, sortDesc } = this.options;
			let textToMatch = this.search;
			const prefilters = {};
			this.filterOptions.map((x) => {
				prefilters[x.dataAccess] = x.value;
			});

			let data = await aircrash.getExport(
				textToMatch,
				sortBy[0] ? sortBy[0] : 'YACSINumber',
				sortDesc[0] ? 'desc' : 'asc',
				prefilters.crashdate,
				prefilters.aircrafttype,
				prefilters.aircraftregistration,
				prefilters.nation,
				prefilters.militarycivilian,
				prefilters.crashlocation,
				prefilters.pilot,
				prefilters.soulsonboard,
				prefilters.injuries,
				prefilters.fatalities
			);
			downloadCsv(data, 'aircrashes');
			this.loadingExport = false;
		},
		async downloadPdf() {
			this.loadingPdf = true;
			let { sortBy, sortDesc } = this.options;
			let textToMatch = this.search;
			const prefilters = {};
			this.filterOptions.map((x) => {
				prefilters[x.dataAccess] = x.value;
			});

			let res = await aircrash.getGridPdf(
				textToMatch,
				sortBy[0] ? sortBy[0] : 'YACSINumber',
				sortDesc[0] ? 'desc' : 'asc',
				prefilters.crashdate,
				prefilters.aircrafttype,
				prefilters.aircraftregistration,
				prefilters.nation,
				prefilters.militarycivilian,
				prefilters.crashlocation,
				prefilters.pilot,
				prefilters.soulsonboard,
				prefilters.injuries,
				prefilters.fatalities
			);
			let blob = new Blob([res], { type: 'application/octetstream' });
			let url = window.URL || window.webkitURL;
			let link = url.createObjectURL(blob);
			let a = document.createElement('a');
			a.setAttribute('download', 'Aircrashes.pdf');
			a.setAttribute('href', link);
			document.body.appendChild(a);
			a.click();
			document.body.removeChild(a);
			this.loadingPdf = false;
		},
		filterPilot(data, filter) {
			let { pilotfirstname, pilotlastname } = data;
			if (!pilotfirstname && !pilotlastname) return false;

			if (pilotfirstname.toLowerCase().includes(filter.toLowerCase()))
				return true;

			if (pilotlastname.toLowerCase().includes(filter.toLowerCase()))
				return true;

			return false;
		},
	},
	computed: {
		selectedFilters() {
			return this.$store.getters['boats/selectedFilters'];
		},
		filteredData() {
			return this.crashsites;
		},
	},
	watch: {
		/* eslint-disable */
		options: {
			handler() {
				this.getDataFromApi();
			},
			deep: true,
		},
	},
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
