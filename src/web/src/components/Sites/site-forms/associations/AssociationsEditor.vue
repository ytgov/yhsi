<template lang="pug">
v-card.default.mb-5(tag="section")
	v-card-title.mb-0.text-h6(tag="h3")
		| Associations
	v-card-text(tag="form")
		v-row(
			v-for="(association, i) in associations",
			:key="i"
		)
			v-col(cols="5")
				AssociationTypesSelect(
					v-model="association.type"
					dense
					outlined
					hide-details
					background-color="white"
				)
			v-col(cols="5")
				v-text-field(
					v-model="association.description"
					label="Association name"
					dense
					outlined
					hide-details
					background-color="white"
					required
				)
			v-col(cols="2")
				v-btn.my-0.float-right(
					color="warning"
					x-small
					fab
					title="Remove"
					@click="removeAssociation(i)"
				)
					v-icon mdi-close
	v-card-actions
		v-btn.my-0(
			color="primary"
			@click="addAssociation"
		)
			| Add Association
</template>

<script>
import AssociationTypesSelect from '@/components/Sites/site-forms/associations/AssociationTypesSelect';

export default {
	name: 'AssociationsEditor',
	components: {
		AssociationTypesSelect,
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
		associations() {
			return this.value;
		},
	},
	methods: {
		addAssociation() {
			this.associations.push({ placeId: this.placeId, type: 1 });
		},
		removeAssociation(index) {
			this.associations.splice(index, 1);
		},
	},
};
</script>

<style scoped></style>
