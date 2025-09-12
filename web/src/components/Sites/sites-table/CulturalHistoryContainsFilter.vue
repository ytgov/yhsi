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

export default {
	name: 'CulturalHistoryContainsFilter',
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
