<template lang="pug">
v-select(
	label="Site Categories",
	:items="siteCategoryTypeOptions",
	:loading="loading"
	multiple
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
import api from '@/apis/site-category-types-api';

export default {
	name: 'SiteCategoryTypesSelect',
	data: () => ({
		siteCategoryTypeOptions: [],
		loading: false,
	}),
	mounted() {
		this.getSiteCategoryTypes();
	},
	methods: {
		getSiteCategoryTypes() {
			this.loading = true;
			return api
				.getAll()
				.then(({ data }) => {
					this.siteCategoryTypeOptions = data;
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
