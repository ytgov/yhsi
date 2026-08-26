<template>
	<v-text-field
		v-model="revisedByTerm"
		label="Revised By"
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
	name: 'RevisedByContainsFilter',
	restoreFilter: { model: 'revisedByTerm', key: 'revisedByContains' },
	mixins: [restorableFilterMixin],
	data: () => ({
		revisedByTerm: '',
	}),
	computed: {
		filter() {
			if (isEmpty(this.revisedByTerm)) return {}

			return {
				'revisedByContains': this.revisedByTerm,
			};
		},
	},
};
</script>
