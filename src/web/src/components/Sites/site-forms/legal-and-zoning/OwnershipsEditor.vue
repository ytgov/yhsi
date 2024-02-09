<template lang="pug">
v-card.default.mb-0(tag="section")
	v-card-title.mb-0.text-h6(tag="h3")
		| Ownerships
	v-card-text(tag="form")
		v-row(
			v-for="(ownership, i) in ownerships",
			:key="i"
		)
			v-col(cols="5")
				OwnershipTypesSelect(
					v-model="ownership.ownershipType"
					dense
					outlined
					background-color="white"
					hide-details
				)
			v-col(cols="5")
				v-text-field(
					:readonly="!isEditing"
					v-model="ownership.comments"
					label="Comments"
					dense
					outlined
					background-color="white"
					hide-details
				)
			v-col(cols="2")
				v-btn.my-0.float-right(
					v-if="isEditing"
					color="warning"
					x-small
					fab
					title="Remove"
					@click="removeOwner(i)"
				)
					v-icon mdi-close
	v-card-actions
		v-btn.my-0(
			v-if="isEditing"
			color="primary"
			@click="addOwner"
		)
			| Add Ownership
</template>

<script>
import OwnershipTypesSelect from '@/components/Sites/site-forms/legal-and-zoning/OwnershipTypesSelect';

export default {
	name: 'OwnershipsEditor',
	components: {
		OwnershipTypesSelect,
	},
	props: {
		value: {
			type: Array,
			default: () => [],
		},
		placeId: {
			type: [String, Number],
			required: true,
		},
	},
	computed: {
		ownerships() {
			return this.value;
		},
		computed: {
			isEditing() {
				return this.$route.path.includes('/edit');
			},
		},
	},
	methods: {
		addOwner() {
			this.ownerships.push({
				ownershipType: 1,
				placeId: this.placeId,
			});
		},
		removeOwner(index) {
			this.ownerships.splice(index, 1);
		},
	},
};
</script>

<style scoped></style>
