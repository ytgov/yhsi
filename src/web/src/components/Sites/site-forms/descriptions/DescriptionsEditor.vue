<template>
	<v-card class="default">
		<v-card-text tag="form">
			<h3>Descriptions</h3>
			<div v-if="!descriptions.length">No descriptions found.</div>
			<div
				v-for="(description, i) in descriptions"
				:key="`description-${i + 1}`"
			>
				<v-row>
					<v-col cols="6">
						<DescriptionTypeSelect
							v-model="description.type"
							dense
							outlined
							background-color="white"
							hide-details
						/>
					</v-col>
					<v-col cols="6">
						<v-btn
							v-if="isEditing"
							class="my-0 float-right"
							color="warning"
							x-small
							fab
							title="Remove"
							@click="removeDescription(i)"
						>
							<v-icon>mdi-close</v-icon>
						</v-btn>
					</v-col>
				</v-row>
				<v-row>
					<v-col cols="10">
						<v-textarea
							:readonly="!isEditing"
							v-model="description.descriptionText"
							label
							dense
							outlined
							background-color="white"
							hide-details
						/>
					</v-col>
				</v-row>
				<v-row
					v-if="i < descriptions.length - 1"
					class="mt-0"
				>
					<v-col cols="12">
						<v-divider class="my-1 black"></v-divider>
					</v-col>
				</v-row>
			</div>
		</v-card-text>
		<v-card-actions v-if="isEditing">
			<v-btn
				class="my-0"
				color="primary"
				@click="addDescription"
			>
				Add Description
			</v-btn>
		</v-card-actions>
	</v-card>
</template>

<script>
import DescriptionTypeSelect from '@/components/Sites/site-forms/descriptions/DescriptionTypeSelect';

export default {
	name: 'DescriptionsEditor',
	components: { DescriptionTypeSelect },
	props: {
		placeId: {
			type: [Number, String],
			required: true,
		},
		value: {
			type: Array,
			default: () => [],
		},
	},
	computed: {
		descriptions() {
			return this.value;
		},
		isEditing() {
			return this.$route.path.includes('/edit');
		},
	},
	methods: {
		addDescription() {
			this.descriptions.push({ placeId: this.placeId, type: 1 });
		},
		removeDescription(index) {
			this.descriptions.splice(index, 1);
		},
	},
};
</script>

<style scoped></style>
