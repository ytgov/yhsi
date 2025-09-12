<template lang="pug">
v-card.mb-0(
	tag="section"
	outlined
	tile
)
	v-card-title.mb-0.text-h4(tag="h2")
		| Themes &amp; Function
	v-card-text(tag="section")
		v-col(cols="12")
			v-textarea(
				v-model="place.yHSThemes"
				label="YHS Themes"
				readonly
				dense
				rows="4"
				outlined
				hide-details
				background-color="white"
			)
		v-col(cols="12")
			ThemesViewer(v-model="place.themes")
		v-col(cols="12")
			FunctionalUsesViewer(
				v-model="place.functionalUses",
				:place-id="placeId"
			)
		v-col(cols="6")
			v-textarea(
				v-model="place.currentUseComment"
				label="YHS Current Use"
				readonly
				dense
				outlined
				background-color="white"
				hide-details
			)
		v-col(cols="6")
			v-textarea(
				v-model="place.yHSPastUse"
				label="YHS Past Use"
				readonly
				dense
				outlined
				hide-details
				background-color="white"
			)
	v-card-actions
		v-spacer
		v-tooltip(left)
			template(#activator="{ on, attrs }")
				div(v-on="on")
					v-btn.my-0(
						color="primary"
						disabled
					) Save
			span There are pending site change requests against this site's themes and functions.
</template>

<script>
import { mapGetters } from 'vuex';

import FunctionalUsesViewer from '@/components/Sites/site-forms/themes-and-functions/FunctionalUsesViewer';
import ThemesViewer from '@/components/Sites/site-forms/themes-and-functions/ThemesViewer';

export default {
	name: 'ThemesAndFunctions',
	components: { FunctionalUsesViewer, ThemesViewer },
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
