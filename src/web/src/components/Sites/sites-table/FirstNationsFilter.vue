<template>
	<v-autocomplete
		v-model="firstNationIds"
		:items="firstNations"
		:loading="loading"
		label="First Nation Association"
		item-text="description"
		item-value="id"
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

import api from '@/apis/first-nations-api';

export default {
	name: 'FirstNationsFilter',
	data: () => ({
		firstNations: [],
		firstNationIds: [],
		includeFilter: true,
		loading: false,
	}),
	computed: {
		filter() {
			if (isEmpty(this.firstNationIds)) return {}

			return {
				[this.queryName]: this.firstNationIds,
			};
		},
		queryName () {
			return this.includeFilter ? 'includingFirstNationIds' : 'excludingFirstNationIds'
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
				this.firstNations = data;
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
