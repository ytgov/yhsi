<template lang="pug">
v-card.default.mb-0(tag="section")
	v-card-title.mb-0.text-h6(tag="h3")
		| Ownerships
	v-card-text(tag="form")
		template(v-if="ownerships.length === 0")
			span No ownerships
		template(v-else)
			v-row(
				v-for="(ownership, i) in ownerships",
				:key="i"
			)
				v-col(cols="6")
					OwnershipTypesSelect(
						v-model="ownership.ownershipType"
						readonly
						dense
						outlined
						background-color="white"
						hide-details
					)
				v-col(cols="6")
					v-text-field(
						:readonly="!isEditing"
						v-model="ownership.comments"
						label="Comments"
						readonly
						dense
						outlined
						background-color="white"
						hide-details
					)
</template>

<script>
import OwnershipTypesSelect from '@/components/Sites/site-forms/legal-and-zoning/OwnershipTypesSelect';

export default {
	name: 'OwnershipsEditor',
	components: {
		OwnershipTypesSelect,
	},
	props: {
		value: {
			type: Array,
			default: () => [],
		},
	},
	computed: {
		ownerships() {
			return this.value;
		},
	},
};
</script>

<style scoped></style>
