<template>
	<v-autocomplete
		v-model="nstMapSheetValue"
		:items="ntsMapSheets"
		:loading="loading"
		label="NTS Map Sheet"
		item-text="name"
		item-value="name"
		:prepend-icon="filterTypeIcon"
		clearable
		dense
		outlined
		small-chips
		deletable-chips
		multiple
		background-color="white"
		@click:prepend="toggleFilterType"
		@change="$emit('input', ntsMapSheetsFilter)"
	/>
</template>

<script>
import api from '@/apis/nts-map-sheets-api';

export default {
	name: 'NtsMapSheetsFilter',
	data: () => ({
		ntsMapSheets: [],
		nstMapSheetValue: [],
		includeFilter: true,
		loading: false,
	}),
	computed: {
		ntsMapSheetsFilter() {
			return {
				field: 'NTSMapSheet',
				operator: this.filterOperator,
				value: this.nstMapSheetValue,
			};
		},
		filterOperator() {
			return this.includeFilter ? 'in' : 'notin';
		},
		filterTypeIcon() {
			return this.includeFilter
				? 'mdi-filter-plus-outline'
				: 'mdi-filter-minus-outline';
		},
	},
	mounted() {
		this.loading = true;
		api
			.getAll()
			.then(({ data }) => {
				this.ntsMapSheets = data;
			})
			.finally(() => {
				this.loading = false;
			});
	},
	methods: {
		toggleFilterType() {
			this.includeFilter = !this.includeFilter;
		},
	},
};
</script>
