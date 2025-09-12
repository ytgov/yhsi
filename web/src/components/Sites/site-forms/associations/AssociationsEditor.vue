<template>
	<v-card
		class="default mb-5"
		tag="section"
	>
		<v-card-text tag="form">
			<h3>Associations</h3>
			<div v-if="associations.length === 0">No associations found.</div>
			<v-row
				v-for="(association, i) in associations"
				:key="i"
			>
				<v-col cols="5">
					<AssociationTypesSelect
						v-model="association.type"
						dense
						outlined
						hide-details
						background-color="white"
					/>
				</v-col>
				<v-col cols="5">
					<v-text-field
						:readonly="!isEditing"
						v-model="association.description"
						label="Association name"
						dense
						outlined
						hide-details
						background-color="white"
						required
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
						@click="removeAssociation(i)"
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
				@click="addAssociation"
			>
				Add Association
			</v-btn>
		</v-card-actions>
	</v-card>
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
		isEditing() {
			return this.$route.path.includes('/edit');
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
