<template>
	<v-card
		class="mb-0"
		tag="section"
		outlined
		tile
	>
		<v-card-title
			class="mb-0 text-h4"
			tag="h2"
		>
			Associations
		</v-card-title>
		<v-card-text>
			<AssociationsEditor
				v-model="place.associations"
				:place-id="placeId"
			/>
			<FirstNationAssociationsEditor
				v-model="place.firstNationAssociations"
				:place-id="placeId"
			/>
		</v-card-text>
		<v-card-actions>
			<v-spacer />
			<v-btn
				v-if="isEditing"
				class="my-0"
				color="primary"
				@click="saveChanges"
			>
				Save
			</v-btn>
		</v-card-actions>
	</v-card>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import { pick } from 'lodash';

import AssociationsEditor from '@/components/Sites/site-forms/associations/AssociationsEditor';
import FirstNationAssociationsEditor from '@/components/Sites/site-forms/associations/FirstNationAssociationsEditor';

export default {
	name: 'AssociationsSiteFormEditor',
	components: { AssociationsEditor, FirstNationAssociationsEditor },
	props: {
		placeId: {
			type: [Number, String],
			required: true,
		},
	},
	data: () => ({}),
	computed: {
		...mapGetters({
			place: 'places/place',
		}),
		isEditing() {
			return this.$route.path.includes('/edit');
		},
	},
	mounted() {},
	methods: {
		...mapActions({
			savePlace: 'places/save',
		}),
		saveChanges() {
			const data = pick(this.place, [
				'associations',
				'firstNationAssociations',
			]);

			return this.savePlace(data);
		},
	},
};
</script>
