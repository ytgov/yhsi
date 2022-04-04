<template lang="pug">
v-select(
	label="Records"
	v-bind="$attrs",
	:items="recordTypeOptions",
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
import api from '@/apis/record-types-api';

export default {
	name: 'RecordTypesSelect',
	data: () => ({
		recordTypeOptions: [],
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
					this.recordTypeOptions = data;
				})
				.finally(() => {
					this.loading = false;
				});
		},
	},
};
</script>

<style scoped></style>
