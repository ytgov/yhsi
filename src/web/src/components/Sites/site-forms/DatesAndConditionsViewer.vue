<template lang="pug">
v-card.mb-0(
	tag="section"
	outlined
	tile
)
	v-card-title.mb-0.text-h4(tag="h2")
		| Dates &amp; Condition
	v-card-text
		DatesViewer(:value="place.dates")
		ConstructionPeriodsViewer(:value="place.constructionPeriods")
		v-card.default(tag="section")
			v-card-title.mb-0.text-h6(tag="h3")
				| Conditions
			v-card-text
				v-row
					v-col(cols="6")
						ConditionTypesSelect(
							:value="place.floorCondition"
							label="Floor condition"
							readonly
							dense
							outlined
							background-color="white"
						)
						ConditionTypesSelect(
							:value="place.roofCondition"
							label="Roof condition"
							readonly
							dense
							outlined
							background-color="white"
						)
						ConditionTypesSelect(
							:value="place.wallCondition"
							label="Wall condition"
							readonly
							dense
							outlined
							background-color="white"
						)
						ConditionTypesSelect(
							:value="place.doorCondition"
							label="Door condition"
							readonly
							dense
							outlined
							background-color="white"
						)
					v-col(cols="6")
						SiteStatusTypesSelect(
							:value="place.siteStatus"
							readonly
							dense
							outlined
							background-color="white"
						)
						v-text-field(
							:value="place.buildingSize"
							readonly
							label="Building size"
							dense
							outlined
							background-color="white"
						)
						v-text-field(
							:value="place.resourceType"
							readonly
							label="All other resource types"
							dense
							outlined
							background-color="white"
						)
						v-textarea(
							:value="place.conditionComment"
							readonly
							label="Condition notes"
							dense
							outlined
							background-color="white"
						)
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
			span There are pending site change requests against this site's dates and conditions.
	map-dialog(ref="map")
</template>

<script>
import { mapGetters } from 'vuex';

import ConditionTypesSelect from '@/components/Sites/site-forms/ConditionTypesSelect';
import ConstructionPeriodsViewer from '@/components/Sites/site-forms/dates-and-conditions/ConstructionPeriodsViewer';
import DatesViewer from '@/components/Sites/site-forms/dates-and-conditions/DatesViewer';
import SiteStatusTypesSelect from '@/components/Sites/site-forms/SiteStatusTypesSelect';

export default {
	name: 'DatesAndConditionsViewer',
	components: {
		ConditionTypesSelect,
		ConstructionPeriodsViewer,
		DatesViewer,
		SiteStatusTypesSelect,
	},
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
