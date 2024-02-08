<template lang="pug">
v-select(
	label="Coordinate determination",
	:items="coordinateDeterminationTypeOptions",
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
import api from '@/apis/coordinate-determination-types-api';

export default {
	name: 'CoordinateDeterminationTypesSelect',
	data: () => ({
		coordinateDeterminationTypeOptions: [],
		loading: false,
	}),
	computed: {
		isEditing() {
			return this.$route.path.includes('/edit');
		},
	},
	mounted() {
		this.getCoordinateDeterminationTypes();
	},
	methods: {
		getCoordinateDeterminationTypes() {
			this.loading = true;
			return api
				.getAll()
				.then(({ data }) => {
					this.coordinateDeterminationTypeOptions = data;
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
