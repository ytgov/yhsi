<template lang="pug">
v-select(
	label="Construction period",
	:items="constructionPeriodOptions",
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
import api from '@/apis/construction-period-types-api';

export default {
	name: 'ConstructionPeriodTypesSelect',
	data: () => ({
		constructionPeriodOptions: [],
		loading: false,
	}),
	computed: {
		isEditing() {
			return this.$route.path.includes('/edit');
		},
	},
	mounted() {
		this.getConstructionPeriods();
	},
	methods: {
		getConstructionPeriods() {
			this.loading = true;
			return api
				.getAll()
				.then(({ data }) => {
					this.constructionPeriodOptions = data;
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
