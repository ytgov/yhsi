<template>
	<v-card
		class="default mb-0"
		tag="section"
	>
		<v-card-text tag="form">
			<h3>First Nation Associations</h3>
			<div v-if="!firstNationAssociations.length">No associations found.</div>
			<v-row
				v-for="(firstNationAssociation, i) in firstNationAssociations"
				:key="i"
			>
				<v-col cols="5">
					<FirstNationAssociationTypesSelect
						v-model="firstNationAssociation.firstNationAssociationType"
						:readonly="!isEditing"
						dense
						outlined
						hide-details
						background-color="white"
					/>
				</v-col>
				<v-col cols="5">
					<FirstNationSelect
						v-model="firstNationAssociation.firstNationId"
						:readonly="!isEditing"
						dense
						outlined
						hide-details
						background-color="white"
					/>
				</v-col>
				<v-col cols="2">
					<v-btn
						v-if="isEditing"
						class="my-0 float-right"
						color="warning"
						x-small
						fab
						title="Remove"
						@click="removeFNAssociation(i)"
					>
						<v-icon>mdi-close</v-icon>
					</v-btn>
				</v-col>
				<v-col cols="10">
					<v-text-field
						:readonly="!isEditing"
						v-model="firstNationAssociation.comments"
						label="Comments"
						dense
						outlined
						hide-details
						background-color="white"
					/>
				</v-col>
				<v-col
					v-if="i < firstNationAssociations.length - 1"
					cols="12"
				>
					<v-divider class="black" />
				</v-col>
			</v-row>
		</v-card-text>
		<v-card-actions v-if="isEditing">
			<v-btn
				class="my-0"
				color="primary"
				@click="addFNAssociation"
			>
				Add Association
			</v-btn>
		</v-card-actions>
	</v-card>
</template>

<script>
import FirstNationAssociationTypesSelect from '@/components/Sites/site-forms/associations/FirstNationAssociationTypesSelect';
import FirstNationSelect from '@/components/Sites/site-forms/associations/FirstNationSelect';

export default {
	name: 'FirstNationAssociationsEditor',
	components: { FirstNationAssociationTypesSelect, FirstNationSelect },
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
		firstNationAssociations() {
			return this.value;
		},
		isEditing() {
			return this.$route.path.includes('/edit');
		},
	},
	watch: {},
	mounted() {},
	methods: {
		addFNAssociation() {
			this.firstNationAssociations.push({
				placeId: this.placeId,
				firstNationAssociationType: 1,
				firstNationId: 1,
			});
		},
		removeFNAssociation(index) {
			this.firstNationAssociations.splice(index, 1);
		},
	},
};
</script>

<style scoped></style>
