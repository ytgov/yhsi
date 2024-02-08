<template lang="pug">
v-card.mb-0(
	tag="section"
	outlined
	tile
)
	v-card-title.mb-0.text-h4(tag="h2")
		| Associations
	v-card-text
		AssociationsViewer(:value="place.associations")
		FirstNationAssociationsViewer(:value="place.firstNationAssociations")
	v-card-actions
		v-spacer
		v-tooltip(left)
			template(#activator="{ on, attrs }")
				div(v-on="on")
					v-btn.my-0(
						v-if="isEditing"
						color="primary"
						disabled
					) Save
			span There are pending site change requests against this site's associations.
</template>

<script>
import { mapGetters } from 'vuex';

import AssociationsViewer from '@/components/Sites/site-forms/associations/AssociationsViewer';
import FirstNationAssociationsViewer from '@/components/Sites/site-forms/associations/FirstNationAssociationsViewer';

export default {
	name: 'AssociationsSiteFormViewer',
	components: { AssociationsViewer, FirstNationAssociationsViewer },
	props: {
		placeId: {
			type: [Number, String],
			required: true,
		},
	},
	computed: {
		...mapGetters({
			place: 'places/place',
		}),
	},
};
</script>
