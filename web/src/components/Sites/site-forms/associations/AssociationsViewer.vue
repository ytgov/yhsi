<template lang="pug">
v-card.default.mb-5(tag="section")
	v-card-title.mb-0.text-h6(tag="h3")
		| Associations
	v-card-text(tag="form")
		template(v-if="associations.length === 0")
			span No associations
		template(v-else)
			v-row(
				v-for="(association, i) in associations",
				:key="i"
			)
				v-col(cols="6")
					AssociationTypesSelect(
						:value="association.type"
						readonly
						dense
						outlined
						hide-details
						background-color="white"
					)
				v-col(cols="6")
					v-text-field(
						:value="association.description"
						label="Association name"
						readonly
						dense
						outlined
						hide-details
						background-color="white"
						required
					)
</template>

<script>
import AssociationTypesSelect from '@/components/Sites/site-forms/associations/AssociationTypesSelect';

export default {
	name: 'AssociationsViewer',
	components: {
		AssociationTypesSelect,
	},
	props: {
		value: {
			type: Array,
			default: () => [],
		},
	},
	computed: {
		associations() {
			return this.value;
		},
	},
};
</script>

<style scoped></style>
