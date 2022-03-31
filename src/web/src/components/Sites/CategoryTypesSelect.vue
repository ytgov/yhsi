<template lang="pug">
v-select(
	v-bind="$attrs",
	:items="categoryTypeOptions",
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
import api from '@/apis/category-types-api';

export default {
	name: 'CategoryTypesSelect',
	data: () => ({
		categoryTypeOptions: [],
		loading: false,
	}),
	mounted() {
		this.getCategoryTypes();
	},
	methods: {
		getCategoryTypes() {
			this.loading = true;
			api
				.getAll()
				.then(({ data }) => {
					this.categoryTypeOptions = data;
				})
				.finally(() => {
					this.loading = false;
				});
		},
	},
};
</script>

<style scoped></style>
