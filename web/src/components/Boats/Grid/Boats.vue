<template>
	<v-container fluid>
		<v-row>
			<v-col cols="12">
				<h2 v-if="boats">
					{{ boats.length }} results out of {{ totalLength }}
				</h2>
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
					:items="boats"
					:headers="headers"
					:loading="loading"
					:search="search"
					:options.sync="options"
					:server-items-length="totalLength"
					@click:row="handleClick"
					:footer-props="{ 'items-per-page-options': [10, 30, 50, 100] }"
				>
					<template v-slot:item.owners="{ item }">
						<div v-if="item.owners.length > 0">
							{{ getCurrentOwner(item.owners) }}
						</div>
					</template>
				</v-data-table>
			</v-col>
		</v-row>
	</v-container>
</template>

<script>
import boats from '../../../controllers/boats';
import _ from 'lodash';
export default {
	name: 'boatsGrid',
	data: () => ({
		loading: false,
		boats: [],
		headers: [
			{ text: 'Name', value: 'Name' },
			{ text: 'Owner', value: 'owners', sortable: false },
			{ text: 'Vessel Type', value: 'VesselType' },
			{ text: 'Construction Date', value: 'ConstructionDate' },
			{ text: 'Service Start Date', value: 'ServiceStart' },
			{ text: 'Service End Date', value: 'ServiceEnd' },
			{ text: 'Current Location Description', value: 'CurrentLocation' },
			{ text: 'Req Number', value: 'RegistrationNumber' },
		],
		//table options
		page: 0,
		pageCount: 6,
		options: { itemsPerPage: 50 },
		totalLength: 0,
		filterOptions: [
			{ name: 'Owner', value: '', dataAccess: 'Owner' },
			{ name: 'Construction Date', value: '', dataAccess: 'ConstructionDate' },
			{ name: 'Service Start', value: '', dataAccess: 'ServiceStart' },
			{ name: 'Service End', value: '', dataAccess: 'ServiceEnd' },
			{ name: 'Vessel Type', value: '', dataAccess: 'VesselType' },
		],
	}),
	mounted() {
		this.getDataFromApi();
	},
	methods: {
		handleClick(value) {
			//Redirects the user to the edit user form

			this.$router.push({
				name: 'boatView',
				params: { name: value.Name, id: value.Id },
			});
		},
		async getDataFromApi() {
			this.loading = true;
			let { page, itemsPerPage, sortBy, sortDesc } = this.options;
			page = page > 0 ? page - 1 : 0;
			////console.log(this.options);
			itemsPerPage = itemsPerPage === undefined ? 10 : itemsPerPage;
			let textToMatch = this.search;
			const prefilters = {};
			this.filterOptions.map((x) => {
				prefilters[x.dataAccess] = x.value;
			});
			// console.log(page,
			//   itemsPerPage,
			//   textToMatch,
			//   sortBy[0] ? sortBy[0] : "Name",
			//   sortDesc[0] ? "desc" : "asc",
			//   prefilters.Owner,
			//   prefilters.ConstructionDate,
			//   prefilters.ServiceStart,
			//   prefilters.ServiceEnd,
			//   prefilters.VesselType);
			let data = await boats.get(
				page,
				itemsPerPage,
				textToMatch,
				sortBy[0] ? sortBy[0] : 'Name',
				sortDesc[0] ? 'desc' : 'asc',
				prefilters.Owner,
				prefilters.ConstructionDate,
				prefilters.ServiceStart,
				prefilters.ServiceEnd,
				prefilters.VesselType
			);
			this.boats = _.get(data, 'body', []);
			console.log(data);
			this.totalLength = _.get(data, 'count', 0);
			this.boats.map((x) => {
				x.ConstructionDate = this.formatDate(x.ConstructionDate);
				x.ServiceStart = this.formatDate(x.ServiceStart);
				x.ServiceEnd = this.formatDate(x.ServiceEnd);
			});
			this.$store.commit('boats/setBoats', this.boats);
			this.$store.commit('boats/setBoatTableOptions', this.options);
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
			return this.$store.getters['boats/selectedFilters'];
		},
		search() {
			return this.$store.getters['boats/boatSearch'];
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
