<template lang="pug">
v-select(
	label="Construction period",
	:items="constructionPeriodOptions",
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
import api from '@/apis/construction-periods-api';

export default {
	name: 'ConstructionPeriodSelect',
	data: () => ({
		constructionPeriodOptions: [],
		loading: false,
	}),
	mounted() {
		this.getConstructionPeriods();
	},
	methods: {
		getConstructionPeriods() {
			this.loading = true;
			return api
				.getAll()
				.then(({ data }) => {
					this.constructionPeriodOptions = data;
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
