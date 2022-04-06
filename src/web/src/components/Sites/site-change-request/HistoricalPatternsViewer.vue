<template lang="pug">
.px-5.py-3
	h3 Historical Patterns
	template(v-if="historicalPatterns.length === 0")
		span No patterns
	template(v-else)
		v-row(
			v-for="(historicalPattern, i) in historicalPatterns",
			:key="i"
		)
			v-col
				HistoricalPatternTypesSelect(
					:value="historicalPattern.historicalPatternType"
					readonly
				)
				v-text-field(
					:value="historicalPattern.comments"
					label="Comments"
					readonly
				)
			v-spacer(v-if="i < historicalPatterns.length - 1")
</template>

<script>
import HistoricalPatternTypesSelect from '@/components/Sites/HistoricalPatternTypesSelect';

export default {
	name: 'HistoricalPatternsViewer',
	components: { HistoricalPatternTypesSelect },
	props: {
		value: {
			type: Array,
			default: () => [],
		},
	},
	computed: {
		historicalPatterns() {
			return this.value;
		},
	},
};
</script>

<style scoped></style>
