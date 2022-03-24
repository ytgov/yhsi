<template>
	<v-autocomplete
		v-model="firstNationAssociationTypeValues"
		:items="firstNationAssociationTypes"
		:loading="loading"
		label="First Nation Association Type"
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

import api from '@/apis/first-nation-association-types-api';

export default {
	name: 'FirstNationAssociationTypesFilter',
	data: () => ({
		firstNationAssociationTypes: [],
		firstNationAssociationTypeValues: [],
		includeFilter: true,
		loading: false,
	}),
	computed: {
		filter() {
			if (isEmpty(this.firstNationAssociationTypeValues)) return {}

			return {
				[this.queryName]: this.firstNationAssociationTypeValues,
			};
		},
		queryName () {
			return this.includeFilter ? 'includingFirstNationAssociationTypes' : 'excludingFirstNationAssociationTypes'
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
				this.firstNationAssociationTypes = data;
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
