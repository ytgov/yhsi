<template lang="pug">
v-card.mb-0(
	tag="section"
	outlined
	tile
)
	v-card-title.mb-0.text-h4(tag="h2")
		| Management
	v-card-text
		RevisionLogsViewer(:value="place.revisionLogs")
		v-divider.my-3
		ContactsViewer(:value="place.contacts")
		v-divider.my-3
		WebLinksViewer(:value="place.webLinks")
		v-divider.my-3
		v-row
			v-col(cols="6")
				v-card.default.mb-0(tag="section")
					v-card-title.mb-0.text-h6(tag="h3")
						| Designation Information
					v-card-text
						v-col(cols="12")
							JurisdictionTypeSelect(
								:value="place.jurisdiction"
								readonly
								dense
								outlined
								background-color="white"
							)
							v-text-field(
								:value="place.recognitionDate"
								label="Recognition Date"
								append-icon="mdi-calendar"
								readonly
								dense
								outlined
								background-color="white"
							)
							OwnerConsentTypeSelect(
								:value="place.ownerConsent"
								readonly
								dense
								outlined
								background-color="white"
							)
							.rounded.white.px-2.pt-1.pb-2
								v-checkbox(
									:value="place.isPubliclyAccessible"
									label="Publicly Accessible?"
									readonly
									dense
									outlined
									hide-details
									color="primary"
									background-color="white"
								)
			v-col(cols="6")
				v-text-field(
					:value="place.yGBuildingNumber"
					label="YG Building Number"
					readonly
					required
				)
				v-text-field(
					:value="place.yGReserveNumber"
					label="YG Reserve Number"
					readonly
					required
				)
				v-text-field(
					:value="place.cIHBNumber"
					label="CIHB Number"
					readonly
					required
				)
				v-text-field(
					:value="place.fHBRONumber"
					label="FHBRO Number"
					readonly
					required
				)
		v-row
			v-col(cols="12")
				StatuteSelect(
					:value="place.statuteId"
					label="Statute - Recognition Authority / Recognition Type / Statute"
					readonly
				)
				StatuteSelect(
					:value="place.statute2Id"
					label="Secondary Statute - Recognition Authority / Recognition Type / Statute"
					readonly
					hide-details
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
			span There are pending site change requests against this site's management information.
</template>

<script>
import { mapGetters } from 'vuex';

import ContactsViewer from '@/components/Sites/site-forms/management/ContactsViewer';
import JurisdictionTypeSelect from '@/components/Sites/site-forms/management/JurisdictionTypeSelect';
import OwnerConsentTypeSelect from '@/components/Sites/site-forms/management/OwnerConsentTypeSelect';
import RevisionLogsViewer from '@/components/Sites/site-forms/management/RevisionLogsViewer';
import StatuteSelect from '@/components/Sites/site-forms/management/StatuteSelect';
import WebLinksViewer from '@/components/Sites/site-forms/management/WebLinksViewer';

export default {
	name: 'ManagementViewer',
	components: {
		ContactsViewer,
		JurisdictionTypeSelect,
		OwnerConsentTypeSelect,
		RevisionLogsViewer,
		StatuteSelect,
		WebLinksViewer,
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
		todaysDate() {
			return new Date().toISOString().substr(0, 10);
		},
	},
};
</script>
