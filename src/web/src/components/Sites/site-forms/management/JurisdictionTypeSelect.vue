<template lang="pug">
v-select(
	:readonly="!isEditing"
	label="Jurisdiction",
	:items="jurisdictionTypeOptions"
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
import api from '@/apis/jurisdiction-types-api';

export default {
	name: 'JurisdictionTypeSelect',
	data: () => ({
		jurisdictionTypeOptions: [],
		loading: false,
	}),
	computed: {
		isEditing() {
			return (
				this.$route.path.includes('/edit') ||
				this.$route.path.includes('/create')
			);
		},
	},
	mounted() {
		this.getJurisdictionTypeOptions();
	},
	methods: {
		getJurisdictionTypeOptions() {
			this.loading = true;
			return api
				.getAll()
				.then(({ data }) => {
					this.jurisdictionTypeOptions = data;
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
