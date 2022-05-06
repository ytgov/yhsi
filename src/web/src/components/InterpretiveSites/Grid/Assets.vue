<template>
	<v-container fluid>
		<v-row>
			<v-col cols="12">
				<h2>{{ filteredData.length }} results out of {{ totalLength }}</h2>
				<!-- value doesnt get modified by the search filter, this is due to the automated search that the vuetify datatable provides -->
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
				</v-data-table>
			</v-col>
		</v-row>
	</v-container>
</template>

<script>
import interpretiveSites from '../../../controllers/interpretive-sites';
export default {
	name: 'boatsGrid',
	data: () => ({
		loading: false,
		list: [],
		headers: [
			{ text: 'Category', value: 'Category' },
			{ text: 'Type', value: 'Type' },
			{ text: 'Size', value: 'Size' },
			{ text: 'Description', value: 'Description' },
			{ text: 'SignText', value: 'SignText' },
			{ text: 'InstallDate', value: 'InstallDate' },
			{ text: 'DecommissionDate', value: 'DecommissionDate' },
			{ text: 'DecommissionNotes', value: 'DecommissionNotes' },
			{ text: 'Status', value: 'Status' },
		],
		filterOptions: [
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
		//table options
		page: 0,
		pageCount: 6,
		options: { itemsPerPage: 50 },
		totalLength: 100,
	}),
	mounted() {
		this.getDataFromApi();
	},
	methods: {
		handleClick(value) {
			//Redirects the user to the edit user form
			// this.$router.push({
			// 	name: 'ownerView',
			// 	params: { name: value.OwnerName, id: value.id },
			// });
			console.log(value);
		},
		async getDataFromApi() {
			this.loading = true;
			let { page, itemsPerPage, sortBy, sortDesc } = this.options;
			page = page > 0 ? page - 1 : 0;
			itemsPerPage = itemsPerPage === undefined ? 10 : itemsPerPage;
			const prefilters = {};
			this.filterOptions.map((x) => {
				prefilters[x.dataAccess] = x.value;
			});
			let data = await interpretiveSites.getAssets(
				prefilters.Category,
				prefilters.Type,
				prefilters.Size,
				//	prefilters.Description,
				this.search,
				prefilters.SignText,
				prefilters.InstallDate,
				prefilters.DecommissionDate,
				prefilters.DecommissionNotes,
				prefilters.Status,
				sortBy[0],
				sortDesc[0] ? 'desc' : 'asc',
				page,
				itemsPerPage
			);
			console.log(data.body);
			this.list = data.body;
			this.totalLength = data.count;
			//console.log(data);
			//this.$store.commit("boats/setOwners", this.owners);
			this.$store.commit(
				'interpretiveSites/setAssetTableOptions',
				this.options
			);
			this.loading = false;
		},
	},
	computed: {
		search() {
			return this.$store.getters['interpretiveSites/assetSearch'];
		},
		filteredData() {
			// returns a filtered users array depending on the selected filters
			return this.list;
		},
	},
	watch: {
		options: {
			handler() {
				this.getDataFromApi();
			},
			deep: true,
		},
		/* eslint-disable */
		selectedFilters(newv, oldv) {
			////console.log(oldv,newv);
		},
		search(newv, oldv) {
			//this.search = newv;
			this.getDataFromApi();
		} /* eslint-enable */,
	},
};
</script>
