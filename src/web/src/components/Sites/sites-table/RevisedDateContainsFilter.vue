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

export default {
	name: 'RevisedDateContainsFilter',
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
