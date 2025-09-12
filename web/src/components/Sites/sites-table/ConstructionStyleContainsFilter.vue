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

export default {
	name: 'ConstructionStyleContainsFilter',
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
