<template lang="pug">
v-card.default.mb-0(tag="section")
	v-card-title.mb-0.text-h6(tag="h3")
		| Functional Uses
	v-card-text(tag="form")
		v-row(
			v-for="(functionalUse, i) in functionalUses",
			:key="i"
		)
			v-col(cols="10")
				v-row
					v-col(cols="4")
						FunctionalUseTypeSelect(
							v-model="functionalUse.functionalUseType"
							dense
							outlined
							hide-details
							background-color="white"
						)
					v-col(cols="8")
						FunctionalTypeSelect(
							v-model="functionalUse.functionalTypeId"
							dense
							outlined
							hide-details
							background-color="white"
						)
			v-col(cols="2")
				v-btn.my-0.float-right(
					color="warning"
					x-small
					fab
					title="Remove"
					@click="removeUse(i)"
				)
					v-icon mdi-close
	v-card-actions
		v-btn.my-0(
			color="primary"
			@click="addUse"
		)
			| Add Functional Use
</template>

<script>
import FunctionalTypeSelect from '@/components/Sites/site-forms/themes-and-functions/FunctionalTypeSelect';
import FunctionalUseTypeSelect from '@/components/Sites/site-forms/themes-and-functions/FunctionalUseTypeSelect';

export default {
	name: 'FunctionalUsesEditor',
	components: {
		FunctionalTypeSelect,
		FunctionalUseTypeSelect,
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
		functionalUses() {
			return this.value;
		},
	},
	methods: {
		addUse() {
			this.functionalUses.push({
				placeId: this.placeId,
				functionalUseType: 2,
				functionalTypeId: 1,
			});
		},
		removeUse(index) {
			this.functionalUses.splice(index, 1);
		},
	},
};
</script>

<style scoped></style>
