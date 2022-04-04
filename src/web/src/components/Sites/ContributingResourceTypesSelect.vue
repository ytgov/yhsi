<template lang="pug">
v-select(
	label="Contributing resources"
	v-bind="$attrs",
	:items="contributingResourceTypeOptions",
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
import api from '@/apis/contributing-resource-types-api';

export default {
	name: 'ContributingResourceTypesSelect',
	data: () => ({
		contributingResourceTypeOptions: [],
		loading: false,
	}),
	mounted() {
		this.getRecordTypes();
	},
	methods: {
		getRecordTypes() {
			this.loading = true;
			api
				.getAll()
				.then(({ data }) => {
					this.contributingResourceTypeOptions = data;
				})
				.finally(() => {
					this.loading = false;
				});
		},
	},
};
</script>

<style scoped></style>
