<template lang="pug">
v-select(
	label="Condition",
	:items="conditionTypeOptions",
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
import api from '@/apis/condition-types-api';

export default {
	name: 'ConditionTypesSelect',
	data: () => ({
		conditionTypeOptions: [],
		loading: false,
	}),
	mounted() {
		this.getConditionTypes();
	},
	methods: {
		getConditionTypes() {
			this.loading = true;
			return api
				.getAll()
				.then(({ data }) => {
					this.conditionTypeOptions = data;
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
