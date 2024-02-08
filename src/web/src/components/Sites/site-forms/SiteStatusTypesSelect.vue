<template lang="pug">
v-select(
	label="Site status",
	:items="siteStatusTypeOptions",
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
import api from '@/apis/site-status-types-api';

export default {
	name: 'SiteStatusTypesSelect',
	data: () => ({
		siteStatusTypeOptions: [],
		loading: false,
	}),
	computed: {
		isEditing() {
			return this.$route.path.includes('/edit');
		},
	},
	mounted() {
		this.getSiteStatusTypes();
	},
	methods: {
		getSiteStatusTypes() {
			this.loading = true;
			return api
				.getAll()
				.then(({ data }) => {
					this.siteStatusTypeOptions = data;
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
