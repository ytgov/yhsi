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
		@change="$emit('input', filter)"
	/>
</template>

<script>
import { isEmpty } from 'lodash';
import { mapGetters } from 'vuex';

import restorableFilterMixin from '@/components/Sites/sites-table/restorable-filter-mixin';

export default {
	name: 'CommunitiesFilter',
	restoreFilter: { model: 'communityIds', include: 'includingCommunityIds', exclude: 'excludingCommunityIds' },
	mixins: [restorableFilterMixin],
	data: () => ({
		communityIds: [],
		includeFilter: true,
	}),
	computed: {
		...mapGetters('communities', ['communities', 'loading']),
		filter() {
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
			this.$emit('input', this.filter);
		},
	},
};
</script>
