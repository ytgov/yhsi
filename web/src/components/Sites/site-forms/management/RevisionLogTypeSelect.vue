<template lang="pug">
v-select(
	:readonly="!isEditing"
	label="Revision Type",
	:items="revisionLogTypeOptions"
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
import api from '@/apis/revision-log-types-api';

export default {
	name: 'RevisionLogTypeSelect',
	data: () => ({
		revisionLogTypeOptions: [],
		loading: false,
	}),
	computed: {
		isEditing() {
			return this.$route.path.includes('/edit');
		},
	},
	mounted() {
		this.getRevisionLogTypeOptions();
	},
	methods: {
		getRevisionLogTypeOptions() {
			this.loading = true;
			return api
				.getAll()
				.then(({ data }) => {
					this.revisionLogTypeOptions = data;
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
