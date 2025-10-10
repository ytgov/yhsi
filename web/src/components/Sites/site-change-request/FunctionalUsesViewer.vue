<template lang="pug">
.px-5.py-3
	h3 Functional Uses
	template(v-if="functionalUses.length === 0")
		span No functional uses
	template(v-else)
		v-row(
			v-for="(functionalUse, i) in functionalUses",
			:key="i"
		)
			v-col(cols="4")
				FunctionalUseTypeSelect(
					v-model="functionalUse.functionalUseType"
					readonly
					dense
					outlined
					hide-details
					background-color="white"
				)
			v-col(cols="8")
				FunctionalTypeSelect(
					v-model="functionalUse.functionalTypeId"
					readonly
					dense
					outlined
					hide-details
					background-color="white"
				)
</template>

<script>
import FunctionalTypeSelect from '@/components/Sites/site-forms/themes-and-functions/FunctionalTypeSelect';
import FunctionalUseTypeSelect from '@/components/Sites/site-forms/themes-and-functions/FunctionalUseTypeSelect';

export default {
	name: 'FunctionalUsesViewer',
	components: {
		FunctionalTypeSelect,
		FunctionalUseTypeSelect,
	},
	props: {
		value: {
			type: Array,
			default: () => [],
		},
	},
	computed: {
		functionalUses() {
			return this.value;
		},
	},
};
</script>

<style scoped></style>
