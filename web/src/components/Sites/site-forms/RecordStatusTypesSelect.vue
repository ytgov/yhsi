<template lang="pug">
v-select(
	label="Record status",
	:items="recordStatusTypeOptions",
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
import api from '@/apis/record-status-types-api';

export default {
	name: 'RecordStatusTypesSelect',
	data: () => ({
		recordStatusTypeOptions: [],
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
		this.getRecordStatusTypes();
	},
	methods: {
		getRecordStatusTypes() {
			this.loading = true;
			return api
				.getAll()
				.then(({ data }) => {
					this.recordStatusTypeOptions = data;
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
