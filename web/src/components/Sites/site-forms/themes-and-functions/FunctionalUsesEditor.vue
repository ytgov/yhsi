<template>
	<v-card
		class="default mb-0"
		tag="section"
	>
		<v-card-text tag="form">
			<h3>Functional Uses</h3>
			<div v-if="!functionalUses.length">No functional uses found.</div>
			<v-row
				v-for="(functionalUse, i) in functionalUses"
				:key="i"
			>
				<v-col cols="10">
					<v-row>
						<v-col cols="4">
							<FunctionalUseTypeSelect
								v-model="functionalUse.functionalUseType"
								dense
								outlined
								hide-details
								background-color="white"
							/>
						</v-col>
						<v-col cols="8">
							<FunctionalTypeSelect
								v-model="functionalUse.functionalTypeId"
								dense
								outlined
								hide-details
								background-color="white"
							/>
						</v-col>
					</v-row>
				</v-col>
				<v-col cols="2">
					<v-btn
						class="my-0 float-right"
						v-if="isEditing"
						color="warning"
						x-small
						fab
						title="Remove"
						@click="removeUse(i)"
					>
						<v-icon>mdi-close</v-icon>
					</v-btn>
				</v-col>
			</v-row>
		</v-card-text>
		<v-card-actions v-if="isEditing">
			<v-btn
				class="my-0"
				color="primary"
				@click="addUse"
			>
				Add Functional Use
			</v-btn>
		</v-card-actions>
	</v-card>
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
		isEditing() {
			return this.$route.path.includes('/edit');
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
