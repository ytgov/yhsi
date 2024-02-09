<template lang="pug">
v-select(
	:readonly="!isEditing"
	label="Owner Consent",
	:items="ownerConsentTypeOptions"
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
import api from '@/apis/owner-consent-types-api';

export default {
	name: 'OwnerConsentTypeSelect',
	data: () => ({
		ownerConsentTypeOptions: [],
		loading: false,
	}),
	computed: {
		isEditing() {
			return this.$route.path.includes('/edit');
		},
	},
	mounted() {
		this.getOwnerConsentTypeOptions();
	},
	methods: {
		getOwnerConsentTypeOptions() {
			this.loading = true;
			return api
				.getAll()
				.then(({ data }) => {
					this.ownerConsentTypeOptions = data;
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
