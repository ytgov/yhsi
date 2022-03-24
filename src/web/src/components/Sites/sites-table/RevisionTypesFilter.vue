<template>
	<v-autocomplete
		v-model="revisionTypeValues"
		:items="revisionTypes"
		:loading="loading"
		label="Revision Type"
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
import { isEmpty } from 'lodash'

import api from '@/apis/revision-log-types-api';

export default {
	name: 'RevisionTypesFilter',
	data: () => ({
		revisionTypes: [],
		revisionTypeValues: [],
		includeFilter: true,
		loading: false,
	}),
	computed: {
		filter() {
			if (isEmpty(this.revisionTypeValues)) return {}

			return {
				[this.queryName]: this.revisionTypeValues,
			};
		},
		queryName () {
			return this.includeFilter ? 'includingRevisionTypes' : 'excludingRevisionTypes'
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
				this.revisionTypes = data;
			})
			.finally(() => {
				this.loading = false;
			});
	},
	methods: {
		toggleFilterType() {
			this.includeFilter = !this.includeFilter
			this.$emit('input', this.filter)
		},
	},
};
</script>
