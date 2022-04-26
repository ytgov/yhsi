<template lang="pug">
v-select(
	label="Historical pattern",
	:items="historicalPatternTypeOptions",
	:loading="loading"
	v-bind="$attrs"
	v-on="$listeners"
)
	template(
		v-for="(_, slot) of $scopedSlots"
		v-slot:[slot]="scope"
	)
		slot(
			:name="slot"
			v-bind="scope"
		)
</template>

<script>
import api from '@/apis/historical-pattern-types-api';

export default {
	name: 'HistoricalPatternTypesSelect',
	data: () => ({
		historicalPatternTypeOptions: [],
		loading: false,
	}),
	mounted() {
		this.getHistoricalPatternTypes();
	},
	methods: {
		getHistoricalPatternTypes() {
			this.loading = true;
			return api
				.getAll()
				.then(({ data }) => {
					this.historicalPatternTypeOptions = data;
					return data;
				})
				.finally(() => {
					this.loading = false;
				});
		},
	},
};
</script>

<style scoped></style>
