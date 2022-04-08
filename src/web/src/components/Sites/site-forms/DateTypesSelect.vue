<template lang="pug">
v-select(
	label="Date type",
	:items="dateTypeOptions",
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
import api from '@/apis/date-types-api';

export default {
	name: 'DateTypesSelect',
	data: () => ({
		dateTypeOptions: [],
		loading: false,
	}),
	mounted() {
		this.getDateTypes();
	},
	methods: {
		getDateTypes() {
			this.loading = true;
			api
				.getAll()
				.then(({ data }) => {
					this.dateTypeOptions = data;
				})
				.finally(() => {
					this.loading = false;
				});
		},
	},
};
</script>

<style scoped></style>
