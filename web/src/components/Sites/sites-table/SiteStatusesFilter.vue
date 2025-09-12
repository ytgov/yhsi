<template>
	<v-autocomplete
		v-model="siteStatusIds"
		:items="siteStatuses"
		:loading="loading"
		label="Sites Status"
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

import api from '@/apis/site-status-types-api';

export default {
	name: 'SiteStatusesFilter',
	data: () => ({
		siteStatuses: [],
		siteStatusIds: [],
		includeFilter: true,
		loading: false,
	}),
	computed: {
		filter() {
			if (isEmpty(this.siteStatusIds)) return {};

			return {
				[this.queryName]: this.siteStatusIds,
			};
		},
		queryName() {
			return this.includeFilter
				? 'includingSiteStatusIds'
				: 'excludingSiteStatusIds';
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
				this.siteStatuses = data;
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
