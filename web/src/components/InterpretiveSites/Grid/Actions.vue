<template>
	<v-data-table :items="filteredData" :headers="headers" :loading="loading" :search="search" :options.sync="options"
		:server-items-length="totalLength" @click:row="handleClick"
		:footer-props="{ 'items-per-page-options': [10, 30, 50, 100] }">

		<template #item.actions="{ item }">
			<ActionDialog :mode="'edit'" :type="'grid'" :dataToEdit="{ item }" @gridActionEdited="editAction" />
		</template>
		<template #item.ActionCompleteDate="{ item }">
			{{ formatDate(item.ActionCompleteDate) }}
		</template>

	</v-data-table>
</template>

<script>
import ActionDialog from '../Dialogs/ActionDialog.vue';
import interpretiveSites from '../../../controllers/interpretive-sites';
export default {
	name: 'actionGrid',
	components: { ActionDialog },
	data: () => ({
		loading: false,
		list: [],
		headers: [
			{ text: 'Action Required', value: 'ActionDesc' },
			{ text: 'To be Completed by', value: 'CompletedBy' },
			{ text: 'Priority', value: 'Priority' },
			{ text: 'Completed date', value: 'ActionCompleteDate' },
			{ text: 'Completion Notes', value: 'CompletionDesc' },
			{ text: '', value: 'actions' },
		],
		filterOptions: [
			{ text: 'Action Required', value: '', dataAccess: 'ActionDesc' },
			{ text: 'To be Completed by', value: '', dataAccess: 'CompletedBy' },
			{ text: 'Priority', value: '', dataAccess: 'Priority' },
			{ text: 'Completed date', value: '', dataAccess: 'ActionCompleteDate' },
			{ text: 'Completion Notes', value: '', dataAccess: 'CompletionDesc' },
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
		editAction() {
			this.$router.go();
		},
		newAction() { },
		handleClick() {
			//Redirects the user to the edit user form
			// this.$router.push({
			// 	name: 'ownerView',
			// 	params: { name: value.OwnerName, id: value.id },
			// });
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
			let data = await interpretiveSites.getActions(
				textToMatch,
				prefilters.ToBeCompleteDate,
				prefilters.ActionCompleteDate,
				prefilters.CompletionDesc,
				prefilters.Priority,
				prefilters.CreatedBy,
				prefilters.CreatedDate,
				prefilters.CompletedBy,
				sortBy[0],
				sortDesc[0] ? 'desc' : 'asc',
				page,
				itemsPerPage
			);

			this.list = data.body.map((x) => {
				if (x.ToBeCompleteDate) x.ToBeCompleteDate = x.ToBeCompleteDate.split('T')[0];
				if (x.CreatedDate) x.CreatedDate = x.CreatedDate.split('T')[0];
				if (x.ActionCompleteDate) x.ActionCompleteDate = x.ActionCompleteDate.split('T')[0];
				return x;
			});
			this.totalLength = data.count;
			this.$store.commit(
				'interpretiveSites/setActionTableOptions',
				this.options
			);
			this.loading = false;
		},
		formatDate(date) {
			if (!date) return '';
			return date.split('T')[0];
		},
	},
	computed: {
		search() {
			return this.$store.getters['interpretiveSites/actionSearch'];
		},
		filteredData() {
			// returns a filtered users array depending on the selected filters
			return this.list;
		},
		selectedFilters() {
			return this.$store.getters['interpretiveSites/selectedActionFilters'];
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
			//this.searchText = newv;
			this.getDataFromApi();
		} /* eslint-enable */,
	},
};
</script>
