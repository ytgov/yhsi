<template>
	<v-text-field
		v-model="culturalHistoryTerm"
		label="Cultural History"
		prepend-icon="mdi-magnify"
		dense
		outlined
		clearable
		background-color="white"
		@change="$emit('input', filter)"
	/>
</template>

<script>
import { isEmpty } from 'lodash'

import restorableFilterMixin from '@/components/Sites/sites-table/restorable-filter-mixin';

export default {
	name: 'CulturalHistoryContainsFilter',
	restoreFilter: { model: 'culturalHistoryTerm', key: 'culturalHistoryContains' },
	mixins: [restorableFilterMixin],
	data: () => ({
		culturalHistoryTerm: '',
	}),
	computed: {
		filter() {
			if (isEmpty(this.culturalHistoryTerm)) return {}

			return {
				'culturalHistoryContains': this.culturalHistoryTerm,
			};
		},
	},
};
</script>
