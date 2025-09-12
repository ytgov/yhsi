<template>
	<v-container fluid>
		<v-row>
			<v-col cols="12">
				<h2 v-if="list">{{ list.length }} results out of {{ totalLength }}</h2>
				<!-- value doesnt get modified by the search filter, this is due to the automated search that the vuetify datatable provides -->
			</v-col>
		</v-row>
		<v-divider
			inset
			class="mb-4"
		></v-divider>
		<v-row>
			<v-col cols="12">
				<v-data-table
					:items="list"
					:headers="headers"
					:loading="loading"
					:search="search"
					:options.sync="options"
					:server-items-length="totalLength"
					@click:row="handleClick"
					:footer-props="{ 'items-per-page-options': [10, 30, 50, 100] }"
				>
					<!-- <template v-slot:item.owners="{ item }">
            <div v-if="item.owners.length > 0">
              {{ getCurrentOwner(item.owners) }}
            </div>
          </template> -->
				</v-data-table>
			</v-col>
		</v-row>
	</v-container>
</template>

<script>
import interpretiveSites from '../../../controllers/interpretive-sites';
// import _ from "lodash";
export default {
	name: 'intSitesGrid',
	data: () => ({
		loading: false,
		list: [],
		headers: [
			{ text: 'SiteName', value: 'SiteName' },
			{ text: 'Location Description', value: 'LocationDesc' },
			{ text: 'RouteName', value: 'RouteName' },
			{ text: 'KMNum', value: 'KMNum' },
			{ text: 'MapSheet', value: 'MapSheet' },
			{ text: 'Latitude', value: 'Latitude' },
			{ text: 'Longitude', value: 'Longitude' },
			{ text: 'EstablishedYear', value: 'EstablishedYear' },
			{ text: 'AdvancedNotification', value: 'AdvancedNotification' },
			{ text: 'NotificationDescription', value: 'NotificationDesc' },
		],
		//table options
		page: 0,
		pageCount: 6,
		options: { itemsPerPage: 50 },
		totalLength: 0,
		filterOptions: [
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
	}),
	mounted() {
		this.getDataFromApi();
	},
	methods: {
		handleClick(value) {
			this.$router.push({
				name: 'InterpretiveSitesView',
				params: { id: value.SiteID },
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
			////console.log("TEST",JSON.stringify(prefilters));
			let data = await interpretiveSites.get(
				page,
				itemsPerPage,
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
			this.list = data.body;
			this.totalLength = data.count;

			// this.$store.commit("boats/setBoats", this.boats);
			this.$store.commit('interpretiveSites/setSiteTableOptions', this.options);
			this.loading = false;
		},
		formatDate(date) {
			if (!date) return null;
			date = date.substr(0, 10);
			const [year, month, day] = date.split('-');
			return `${month}/${day}/${year}`;
		},
		getCurrentOwner(owners) {
			if (!owners) return null;
			//let owner = owners.filter( x => x.currentowner === true);
			////console.log(owner);
			return owners[0].OwnerName;
		},
	},
	computed: {
		selectedFilters() {
			return this.$store.getters['interpretiveSites/selectedSiteFilters'];
		},
		search() {
			return this.$store.getters['interpretiveSites/siteSearch'];
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
		selectedFilters: {
			handler(newv) {
				this.filterOptions = newv;
				this.getDataFromApi();
			},
			deep: true,
		},
		search() {
			this.getDataFromApi();
		} /* eslint-enable */,
	},
};
</script>
