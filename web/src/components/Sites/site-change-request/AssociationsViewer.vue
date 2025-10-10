<template lang="pug">
.px-5.py-3
	h3 Associations
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
				)
			v-col(cols="6")
				v-text-field(
					:value="association.description"
					label="Association name"
					readonly
					dense
					outlined
					hide-details
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
