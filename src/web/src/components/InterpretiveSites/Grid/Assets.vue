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
					<template v-slot:item="{ item, index }">
						<tr>
							<td class="parent-row">
								{{ item.Category }}
							</td>
							<td class="child-row">{{ item.Type }}</td>
							<td class="child-row">{{ item.Size }}</td>
							<td class="child-row">{{ item.Description }}</td>
							<td class="child-row">{{ item.SignText }}</td>
							<td class="child-row">{{ item.InstallDate }}</td>
							<td class="child-row">{{ item.DecommissionDate }}</td>
							<td class="child-row">{{ item.DecommissionNotes }}</td>
							<td class="child-row">
								{{ item.Status === 'Yes' ? 'Active' : 'Inactive' }}
							</td>
							<td class="child-row">
								<AssetDialog
									:mode="'edit'"
									:type="'grid'"
									:dataToEdit="{ item, index }"
									@gridAssetEdited="editAsset"
								/>
							</td>
						</tr>
					</template>
				</v-data-table>
			</v-col>
		</v-row>
	</v-container>
</template>

<script>
import AssetDialog from '../Dialogs/AssetDialog.vue';
import interpretiveSites from '../../../controllers/interpretive-sites';
export default {
	name: 'assetsGrid',
	components: { AssetDialog },
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
			{ text: '', value: 'actions' },
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
		formatDate(date) {
			return date.split('T')[0].split('-').reverse().join('-');
		},
		editAsset() {
			this.$router.go();
		},
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
			this.list = data.body.map((x) => {
				x.DecommissionDate = this.formatDate(x.DecommissionDate);
				x.InstallDate = this.formatDate(x.InstallDate);
				return x;
			});
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
		selectedFilters() {
			return this.$store.getters['interpretiveSites/selectedAssetFilters'];
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
		selectedFilters: {
			handler(newv) {
				this.filterOptions = newv;
				this.getDataFromApi();
			},
			deep: true,
		},
		search(newv, oldv) {
			//this.search = newv;
			this.getDataFromApi();
		} /* eslint-enable */,
	},
};
</script>
