<template>
	<v-autocomplete
		v-model="constructionPeriodValues"
		:items="constructionPeriods"
		:loading="loading"
		label="Construction Period"
		:prepend-icon="filterTypeIcon"
		clearable
		dense
		outlined
		small-chips
		deletable-chips
		multiple
		background-color="white"
		@click:prepend="toggleFilterType"
		@change="$emit('input', filter)"
	/>
</template>

<script>
import { isEmpty } from 'lodash';

import api from '@/apis/construction-period-types-api';

export default {
	name: 'ConstructionPeriodsFilter',
	data: () => ({
		constructionPeriods: [],
		constructionPeriodValues: [],
		includeFilter: true,
		loading: false,
	}),
	computed: {
		filter() {
			if (isEmpty(this.constructionPeriodValues)) return {};

			return {
				[this.queryName]: this.constructionPeriodValues,
			};
		},
		queryName() {
			return this.includeFilter
				? 'includingConstructionPeriodValues'
				: 'excludingConstructionPeriodValues';
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
				this.constructionPeriods = data;
			})
			.finally(() => {
				this.loading = false;
			});
	},
	methods: {
		toggleFilterType() {
			this.includeFilter = !this.includeFilter;
			this.$emit('input', this.filter);
		},
	},
};
</script>
