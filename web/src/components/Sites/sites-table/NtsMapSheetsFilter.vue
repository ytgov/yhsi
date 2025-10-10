<template>
	<v-autocomplete
		v-model="ntsMapSheetValues"
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
import { isEmpty } from 'lodash';

import api from '@/apis/nts-map-sheets-api';

export default {
	name: 'NtsMapSheetsFilter',
	data: () => ({
		ntsMapSheets: [],
		ntsMapSheetValues: [],
		includeFilter: true,
		loading: false,
	}),
	computed: {
		ntsMapSheetsFilter() {
			if (isEmpty(this.ntsMapSheetValues)) return {}

			return {
				[this.queryName]: this.ntsMapSheetValues,
			};
		},
		queryName() {
			return this.includeFilter ? 'includingNtsMapSheets' : 'excludingNtsMapSheets';
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
			this.$emit('input', this.ntsMapSheetsFilter)
		},
	},
};
</script>
