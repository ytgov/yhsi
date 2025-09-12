<template lang="pug">
v-select(
	:label="$attrs.label || 'Condition'",
	:items="conditionTypeOptions",
	:loading="loading"
	v-bind="$attrs"
	v-on="$listeners",
	:readonly="!isEditing"
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
	computed: {
		isEditing() {
			return this.$route.path.includes('/edit') ||  this.$route.path.includes('/create');
		},
	},
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
