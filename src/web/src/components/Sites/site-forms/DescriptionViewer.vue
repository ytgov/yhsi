<template lang="pug">
v-card(
	tag="section"
	outlined
	tile
)
	v-card-title.mb-0.text-h4(tag="h2")
		| Description
	v-card-text(tag="section")
		DescriptionsViewer(:value="place.descriptions")
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
			span There are pending site change requests against this site's description information.
</template>

<script>
import { mapGetters } from 'vuex';

import DescriptionsViewer from '@/components/Sites/site-forms/descriptions/DescriptionsViewer';

export default {
	name: 'DescriptionViewer',
	components: { DescriptionsViewer },
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
