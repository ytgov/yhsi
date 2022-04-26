<template lang="pug">
v-card.default.mb-4(tag="section")
	v-card-title.mb-0.text-h6(tag="h3")
		| Construction Periods
	v-card-text(tag="form")
		template(v-if="constructionPeriods.length === 0")
			span No construction periods
		template(v-else)
			v-row(
				v-for="(constructionPeriod, i) in constructionPeriods",
				:key="i"
			)
				v-col
					ConstructionPeriodTypesSelect(
						:value="constructionPeriod.type"
						readonly
						label=""
						dense
						outlined
						hide-details
						background-color="white"
					)
</template>

<script>
import ConstructionPeriodTypesSelect from '@/components/Sites/site-forms/ConstructionPeriodTypesSelect';

export default {
	name: 'ConstructionPeriodsViewer',
	components: { ConstructionPeriodTypesSelect },
	props: {
		value: {
			type: Array,
			default: () => [],
		},
	},
	computed: {
		constructionPeriods() {
			return this.value;
		},
	},
};
</script>

<style scoped></style>
