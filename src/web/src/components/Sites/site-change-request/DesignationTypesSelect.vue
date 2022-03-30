<template lang="pug">
v-select(
	v-bind="$attrs",
	:items="designationOptions"
	:loading="loading"
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
import api from '@/apis/designation-types-api';

export default {
	name: 'DesignationTypesSelect',
	data: () => ({
		designationOptions: [],
		loading: false,
	}),
	mounted() {
		this.getDesignations();
	},
	methods: {
		getDesignations() {
			this.loading = true;
			api
				.getAll()
				.then(({ data }) => {
					this.designationOptions = data;
				})
				.finally(() => {
					this.loading = false;
				});
		},
	},
};
</script>

<style scoped></style>
