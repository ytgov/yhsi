<template lang="pug">
v-select(
	:readonly="!isEditing"
	label="Link Type",
	:items="webLinkTypeOptions"
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
import api from '@/apis/web-link-types-api';

export default {
	name: 'WebLinkTypeSelect',
	data: () => ({
		webLinkTypeOptions: [],
		loading: false,
	}),
	computed: {
		isEditing() {
			return this.$route.path.includes('/edit');
		},
	},
	mounted() {
		this.getWebLinkTypeOptions();
	},
	methods: {
		getWebLinkTypeOptions() {
			this.loading = true;
			return api
				.getAll()
				.then(({ data }) => {
					this.webLinkTypeOptions = data;
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
