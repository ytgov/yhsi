<template lang="pug">
v-card.mb-0(
	tag="section"
	outlined
	tile
)
	v-card-title.mb-0.text-h4(tag="h2")
		| Management
	v-card-text
		RevisionLogsEditor(
			v-model="place.revisionLogs",
			:place-id="placeId"
		)
		v-divider.my-3
		ContactsEditor(
			v-model="place.contacts",
			:place-id="placeId"
		)
		v-divider.my-3
		WebLinksEditor(
			v-model="place.webLinks",
			:place-id="placeId"
		)
		v-divider.my-3
		v-row
			v-col(cols="6")
				v-card.default.mb-0(tag="section")
					v-card-title.mb-0.text-h6(tag="h3")
						| Designation Information
					v-card-text
						v-col(cols="12")
							JurisdictionTypeSelect(
								v-model="place.jurisdiction"
								dense
								outlined
								background-color="white"
							)
							v-menu(
								ref="recognitionDateMenu",
								:close-on-content-click="false"
								transition="scale-transition"
								nudge-top="26"
								offset-y
								min-width="auto"
							)
								template(v-slot:activator="{ on, attrs }")
									v-text-field(
										v-model="place.recognitionDate"
										label="Recognition Date"
										append-icon="mdi-calendar"
										readonly
										dense
										outlined
										background-color="white"
										v-bind="attrs"
										v-on="on",
										:readonly="!isEditing"
									)
								v-date-picker(
									ref="picker"
									v-model="place.recognitionDate",
									:max="todaysDate"
									min="1950-01-01"
									@input="recognitionDateMenu = false"
								)
							OwnerConsentTypeSelect(
								v-model="place.ownerConsent"
								dense
								outlined
								background-color="white"
							)
							.rounded.white.px-2.pt-1.pb-2
								v-checkbox(
									v-model="place.isPubliclyAccessible"
									label="Publicly Accessible?"
									dense
									outlined
									hide-details
									color="primary"
									background-color="white"
								)
			v-col(cols="6")
				v-text-field(
					v-model="place.yGBuildingNumber"
					label="YG Building Number"
					required,
					:readonly="!isEditing"
				)
				v-text-field(
					v-model="place.yGReserveNumber"
					label="YG Reserve Number"
					required,
					:readonly="!isEditing"
				)
				v-text-field(
					v-model="place.cIHBNumber"
					label="CIHB Number"
					required,
					:readonly="!isEditing"
				)
				v-text-field(
					v-model="place.fHBRONumber"
					label="FHBRO Number"
					required,
					:readonly="!isEditing"
				)
		v-row
			v-col(cols="12")
				StatuteSelect(
					v-model="place.statuteId"
					label="Statute - Recognition Authority / Recognition Type / Statute"
				)
				StatuteSelect(
					v-model="place.statute2Id"
					label="Secondary Statute - Recognition Authority / Recognition Type / Statute"
					hide-details
				)
	v-card-actions
		v-spacer
		v-btn.my-0(
			color="primary"
			@click="saveChanges"
		)
			| Save
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import { pick } from 'lodash';

import ContactsEditor from '@/components/Sites/site-forms/management/ContactsEditor';
import JurisdictionTypeSelect from '@/components/Sites/site-forms/management/JurisdictionTypeSelect';
import OwnerConsentTypeSelect from '@/components/Sites/site-forms/management/OwnerConsentTypeSelect';
import RevisionLogsEditor from '@/components/Sites/site-forms/management/RevisionLogsEditor';
import StatuteSelect from '@/components/Sites/site-forms/management/StatuteSelect';
import WebLinksEditor from '@/components/Sites/site-forms/management/WebLinksEditor';

export default {
	name: 'Management',
	components: {
		ContactsEditor,
		JurisdictionTypeSelect,
		OwnerConsentTypeSelect,
		RevisionLogsEditor,
		StatuteSelect,
		WebLinksEditor,
	},
	props: {
		placeId: {
			type: [Number, String],
			required: true,
		},
	},
	data: () => ({
		recognitionDateMenu: false,
	}),
	computed: {
		...mapGetters({
			place: 'places/place',
		}),
		isEditing() {
			return this.$route.path.includes('/edit');
		},
		todaysDate() {
			return new Date().toISOString().substr(0, 10);
		},
	},
	methods: {
		...mapActions({
			savePlace: 'places/save',
		}),
		saveChanges() {
			const data = pick(this.place, [
				'cIHBNumber',
				'contacts',
				'fHBRONumber',
				'isPubliclyAccessible',
				'jurisdiction',
				'ownerConsent',
				'recognitionDate',
				'revisionLogs',
				'statute2Id',
				'statuteId',
				'webLinks',
				'yGBuildingNumber',
				'yGReserveNumber',
			]);

			return this.savePlace(data);
		},
	},
};
</script>
