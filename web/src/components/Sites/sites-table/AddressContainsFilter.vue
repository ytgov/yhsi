<template>
	<v-text-field
		v-model="addressTerm"
		label="Address"
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
	name: 'AddressContainsFilter',
	data: () => ({
		addressTerm: '',
	}),
	computed: {
		filter() {
			if (isEmpty(this.addressTerm)) return {}

			return {
				'addressContains': this.addressTerm,
			};
		},
	},
};
</script>
