<template lang="pug">
v-select(
	label="CRHP category",
	:items="categoryTypeOptions",
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
import api from '@/apis/category-types-api';

export default {
	name: 'CategoryTypesSelect',
	data: () => ({
		categoryTypeOptions: [],
		loading: false,
	}),
	computer: {
		isEditing() {
			return this.$route.path.includes('/edit');
		},
	},
	mounted() {
		this.getCategoryTypes();
	},
	methods: {
		getCategoryTypes() {
			this.loading = true;
			return api
				.getAll()
				.then(({ data }) => {
					this.categoryTypeOptions = data;
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
