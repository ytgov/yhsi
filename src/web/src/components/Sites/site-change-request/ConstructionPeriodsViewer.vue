<template lang="pug">
.px-5.py-3
	h3 Construction Periods
	template(v-if="constructionPeriods.length === 0")
		span No construction periods
	template(v-else)
		v-row(
			v-for="(constructionPeriod, i) in constructionPeriods",
			:key="i"
		)
			v-col
				ConstructionPeriodSelect(
					:value="constructionPeriod.type"
					readonly
				)
</template>

<script>
import ConstructionPeriodSelect from '@/components/Sites/site-forms/ConstructionPeriodSelect';

export default {
	name: 'ConstructionPeriodsViewer',
	components: { ConstructionPeriodSelect },
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
