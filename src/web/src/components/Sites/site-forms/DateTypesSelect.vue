<template lang="pug">
v-select(
	label="Date type",
	:items="dateTypeOptions",
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
import api from '@/apis/date-types-api';

export default {
	name: 'DateTypesSelect',
	data: () => ({
		dateTypeOptions: [],
		loading: false,
	}),
	computed: {
		isEditing() {
			return this.$route.path.includes('/edit');
		},
	},
	mounted() {
		this.getDateTypes();
	},
	methods: {
		getDateTypes() {
			this.loading = true;
			return api
				.getAll()
				.then(({ data }) => {
					this.dateTypeOptions = data;
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
