<template lang="pug">
v-card.mb-0(
	tag="section"
	outlined
	tile
)
	v-card-title.mb-0.text-h4(tag="h2")
		| Summary
	v-card-text
		v-row
			v-col(cols="6")
				v-text-field(
					v-model="place.yHSIId"
					label="YHSI ID"
					readonly
					dense
					outlined
					required
					append-icon="mdi-lock"
				)
				DesignationTypesSelect(
					v-model="place.designations"
					readonly
					dense
					outlined
				)
				CategoryTypesSelect(
					v-model="place.category"
					readonly
					dense
					outlined
				)
				SiteCategoryTypesSelect(
					v-model="place.siteCategories"
					readonly
					dense
					outlined
				)
				RecordTypesSelect(
					v-model="place.records"
					readonly
					dense
					outlined
				)
				ContributingResourceTypesSelect(
					v-model="place.contributingResources"
					readonly
					dense
					outlined
					required
				)
				v-checkbox(
					v-model="place.showInRegister"
					readonly
					dense
					outlined
					label="Show in Register?"
				)
			v-col(cols="6")
				v-text-field(
					v-model="place.primaryName"
					label="Primary name"
					readonly
					dense
					outlined
					required
				)
				v-card.default.mb-5
					v-card-title.mb-0.text-h6(tag="h3")
						| Secondary Names
					v-card-text(v-if="names.length === 0")
						span No names
					v-card-text(v-else)
						v-row(
							v-for="(item, i) in names",
							:key="i"
						)
							v-col
								v-text-field(
									v-model="item.description"
									readonly
									dense
									outlined
									background-color="white"
									label="Secondary name"
									hide-details
								)
				v-card.default.mb-5
					v-card-title.mb-0.text-h6(tag="h3")
						| Historical Patterns
					v-card-text(v-if="historicalPatterns.length === 0")
						span No patterns
					v-card-text(v-else)
						v-row.row(
							v-for="(item, i) of historicalPatterns",
							:key="i"
						)
							v-col
								HistoricalPatternTypesSelect(
									v-model="item.historicalPatternType"
									readonly
									dense
									outlined
									background-color="white"
								)
								v-text-field(
									v-model="item.comments"
									readonly
									dense
									outlined
									background-color="white"
									label="Comments"
									required
									hide-details
								)
							v-col(
								v-if="i < historicalPatterns.length - 1"
								cols="12"
							)
								hr
	v-card-actions
		v-spacer
		v-tooltip(left)
			template(#activator="{ on, attrs }")
				div(v-on="on")
					v-btn.my-0(
						color="primary"
						disabled
					) Save
			span There are pending site change requests against this site summary.
</template>

<script>
import { mapGetters } from 'vuex';

import CategoryTypesSelect from '@/components/Sites/site-forms/CategoryTypesSelect';
import ContributingResourceTypesSelect from '@/components/Sites/site-forms/ContributingResourceTypesSelect';
import DesignationTypesSelect from '@/components/Sites/site-forms/DesignationTypesSelect';
import HistoricalPatternTypesSelect from '@/components/Sites/site-forms/HistoricalPatternTypesSelect';
import RecordTypesSelect from '@/components/Sites/site-forms/RecordTypesSelect';
import SiteCategoryTypesSelect from '@/components/Sites/site-forms/SiteCategoryTypesSelect';

export default {
	name: 'Summary',
	components: {
		CategoryTypesSelect,
		ContributingResourceTypesSelect,
		DesignationTypesSelect,
		HistoricalPatternTypesSelect,
		RecordTypesSelect,
		SiteCategoryTypesSelect,
	},
	props: {
		placeId: {
			type: [Number, String],
			required: true,
		},
	},
	data: () => ({}),
	computed: {
		...mapGetters('places', {
			place: 'place',
			names: 'names',
			historicalPatterns: 'historicalPatterns',
		}),
	},
};
</script>
