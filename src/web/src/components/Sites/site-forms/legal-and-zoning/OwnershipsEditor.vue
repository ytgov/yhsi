<template>
	<v-card
		class="default mb-0"
		tag="section"
	>
		<v-card-text tag="form">
			<h3>Ownerships</h3>
			<div v-if="ownerships.length === 0">No ownerships found</div>
			<v-row
				v-for="(ownership, i) in ownerships"
				:key="i"
			>
				<v-col cols="5">
					<OwnershipTypesSelect
						v-model="ownership.ownershipType"
						dense
						outlined
						background-color="white"
						hide-details
					/>
				</v-col>
				<v-col cols="5">
					<v-text-field
						:readonly="!isEditing"
						v-model="ownership.comments"
						label="Comments"
						dense
						outlined
						background-color="white"
						hide-details
					/>
				</v-col>
				<v-col cols="2">
					<v-btn
						class="my-0 float-right"
						v-if="isEditing"
						color="warning"
						x-small
						fab
						title="Remove"
						@click="removeOwner(i)"
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
				@click="addOwner"
			>
				Add Ownership
			</v-btn>
		</v-card-actions>
	</v-card>
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
		isEditing() {
			return this.$route.path.includes('/edit');
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
