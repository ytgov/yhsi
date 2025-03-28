<template>
	<v-card
		class="default mb-0"
		tag="section"
	>
		<v-card-text tag="form">
			<h3>Previous Ownerships</h3>
			<div v-if="!previousOwnerships.length">No previous ownerships found</div>
			<v-row
				v-for="(previousOwnership, i) in previousOwnerships"
				:key="i"
				class="row"
			>
				<v-col cols="5">
					<v-text-field
						:readonly="!isEditing"
						v-model="previousOwnership.ownershipDate"
						label="Dates"
						dense
						outlined
						background-color="white"
						hide-details
					/>
				</v-col>
				<v-col cols="5">
					<v-text-field
						:readonly="!isEditing"
						v-model="previousOwnership.ownershipNumber"
						label="Title number"
						dense
						outlined
						background-color="white"
						hide-details
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
						@click="removePreviousOwner(i)"
					>
						<v-icon>mdi-close</v-icon>
					</v-btn>
				</v-col>
				<v-col cols="12">
					<v-text-field
						:readonly="!isEditing"
						v-model="previousOwnership.ownershipName"
						label="Names"
						dense
						outlined
						background-color="white"
						hide-details
					/>
				</v-col>
				<v-col
					v-if="i < previousOwnerships.length - 1"
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
				@click="addPreviousOwner"
			>
				Add Previous Ownership
			</v-btn>
		</v-card-actions>
	</v-card>
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
