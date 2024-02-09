<template lang="pug">
v-autocomplete(
	:readonly="!isEditing"
	label="Functional Category / Type",
	:items="functionalTypeOptions"
	item-value="id"
	item-text="description",
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
import api from '@/apis/functional-types-api';

export default {
	name: 'FunctionalTypeSelect',
	data: () => ({
		functionalTypeOptions: [],
		loading: false,
	}),
	computed: {
		isEditing() {
			return this.$route.path.includes('/edit');
		},
	},
	mounted() {
		this.getFunctionalTypes();
	},
	methods: {
		getFunctionalTypes() {
			this.loading = true;
			return api
				.getAll()
				.then(({ data }) => {
					this.functionalTypeOptions = data;
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
