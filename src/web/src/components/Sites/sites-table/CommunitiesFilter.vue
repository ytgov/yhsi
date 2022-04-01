<template>
	<v-autocomplete
		v-model="communityIds"
		:items="communities"
		:loading="loading"
		label="Communities"
		item-text="name"
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
		@change="$emit('input', communitiesFilter)"
	/>
</template>

<script>
import { isEmpty } from 'lodash';
import { mapGetters } from 'vuex';

export default {
	name: 'CommunitiesFilter',
	data: () => ({
		communityIds: [],
		includeFilter: true,
	}),
	computed: {
		...mapGetters('communities', ['communities', 'loading']),
		communitiesFilter() {
			if (isEmpty(this.communityIds)) return {};

			return {
				[this.queryName]: this.communityIds,
			};
		},
		queryName() {
			return this.includeFilter
				? 'includingCommunityIds'
				: 'excludingCommunityIds';
		},
		filterTypeIcon() {
			return this.includeFilter
				? 'mdi-filter-plus-outline'
				: 'mdi-filter-minus-outline';
		},
	},
	methods: {
		toggleFilterType() {
			this.includeFilter = !this.includeFilter;
			this.$emit('input', this.communitiesFilter);
		},
	},
};
</script>
