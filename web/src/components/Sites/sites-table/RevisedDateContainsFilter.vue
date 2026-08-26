<template>
	<v-text-field
		v-model="revisedDateTerm"
		label="Revised Date"
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
	name: 'RevisedDateContainsFilter',
	restoreFilter: { model: 'revisedDateTerm', key: 'revisedDateContains' },
	mixins: [restorableFilterMixin],
	data: () => ({
		revisedDateTerm: '',
	}),
	computed: {
		filter() {
			if (isEmpty(this.revisedDateTerm)) return {}

			return {
				'revisedDateContains': this.revisedDateTerm,
			};
		},
	},
};
</script>
