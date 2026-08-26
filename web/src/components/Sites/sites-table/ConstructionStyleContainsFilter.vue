<template>
	<v-text-field
		v-model="constructionStyleTerm"
		label="Construction Style"
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
	name: 'ConstructionStyleContainsFilter',
	restoreFilter: { model: 'constructionStyleTerm', key: 'constructionStyleContains' },
	mixins: [restorableFilterMixin],
	data: () => ({
		constructionStyleTerm: '',
	}),
	computed: {
		filter() {
			if (isEmpty(this.constructionStyleTerm)) return {}

			return {
				'constructionStyleContains': this.constructionStyleTerm,
			};
		},
	},
};
</script>
