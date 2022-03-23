<template>
	<v-autocomplete
		v-model="ownershipTypeValues"
		:items="ownershipTypes"
		:loading="loading"
		label="Category of Property"
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

import api from '@/apis/ownership-types-api';

export default {
	name: 'OwnershipTypesFilter',
	data: () => ({
		ownershipTypes: [],
		ownershipTypeValues: [],
		includeFilter: true,
		loading: false,
	}),
	computed: {
		filter() {
			if (isEmpty(this.ownershipTypeValues)) return {}

			return {
				[this.queryName]: this.ownershipTypeValues,
			};
		},
		queryName () {
			return this.includeFilter ? 'includingOwnershipTypes' : 'excludingOwnershipTypes'
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
				this.ownershipTypes = data;
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
