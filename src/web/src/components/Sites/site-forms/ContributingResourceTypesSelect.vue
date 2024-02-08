<template lang="pug">
v-select(
	label="Contributing resources",
	:items="contributingResourceTypeOptions",
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
import api from '@/apis/contributing-resource-types-api';

export default {
	name: 'ContributingResourceTypesSelect',
	data: () => ({
		contributingResourceTypeOptions: [],
		loading: false,
	}),
	computed: {
		isEditing() {
			return this.$route.path.includes('/edit');
		},
	},
	mounted() {
		this.getRecordTypes();
	},
	methods: {
		getRecordTypes() {
			this.loading = true;
			return api
				.getAll()
				.then(({ data }) => {
					this.contributingResourceTypeOptions = data;
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
