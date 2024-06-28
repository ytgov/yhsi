<template lang="pug">
v-card.default.mb-0(tag="section")
	v-card-title.mb-0.text-h6(tag="h3")
		| Previous Ownerships
	v-card-text(tag="form")
		v-row.row(
			v-for="(previousOwnership, i) in previousOwnerships",
			:key="i"
		)
			v-col(cols="5")
				v-text-field(
					:readonly="!isEditing"
					v-model="previousOwnership.ownershipDate"
					label="Dates"
					dense
					outlined
					background-color="white"
					hide-details
				)
			v-col(cols="5")
				v-text-field(
					:readonly="!isEditing"
					v-model="previousOwnership.ownershipNumber"
					label="Title number"
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
					@click="removePreviousOwner(i)"
				)
					v-icon mdi-close
			v-col(cols="12")
				v-text-field(
					:readonly="!isEditing"
					v-model="previousOwnership.ownershipName"
					label="Names"
					dense
					outlined
					background-color="white"
					hide-details
				)
			v-col(
				v-if="i < previousOwnerships.length - 1"
				cols="12"
			)
				v-divider.black
	v-card-actions
		v-btn.my-0(
			v-if="isEditing"
			color="primary"
			@click="addPreviousOwner"
		)
			| Add Previous Ownership
</template>

<script>
export default {
	name: 'PreviousOwnershipsEditor',
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
		previousOwnerships() {
			return this.value;
		},
		isEditing() {
			return this.$route.path.includes('/edit');
		},
	},
	methods: {
		addPreviousOwner() {
			this.previousOwnerships.push({
				ownershipDate: '',
				ownershipNumber: '',
				ownershipName: '',
				placeId: this.placeId,
			});
		},
		removePreviousOwner(index) {
			this.previousOwnerships.splice(index, 1);
		},
	},
};
</script>

<style scoped></style>
