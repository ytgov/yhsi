<template>
	<v-card
		tag="section"
		outlined
		tile
		class="mb-0"
	>
		<v-card-title
			tag="h2"
			class="mb-0 text-h4"
		>
			Management
		</v-card-title>
		<v-card-text>
			<RevisionLogsEditor
				v-model="place.revisionLogs"
				:place-id="placeId"
			/>
			<v-divider class="my-3"></v-divider>
			<ContactsEditor
				v-model="place.contacts"
				:place-id="placeId"
			/>
			<v-divider class="my-3"></v-divider>
			<WebLinksEditor
				v-model="place.webLinks"
				:place-id="placeId"
			/>
			<v-divider class="my-3"></v-divider>
			<v-row>
				<v-col cols="6">
					<v-card
						tag="section"
						class="default mb-0"
					>
						<v-card-text>
							<h3>Designation Information</h3>
							<v-row>
								<v-col cols="12">
									<JurisdictionTypeSelect
										v-model="place.jurisdiction"
										dense
										outlined
										background-color="white"
									/>
									<v-menu
										ref="recognitionDateMenu"
										:close-on-content-click="false"
										transition="scale-transition"
										nudge-top="26"
										offset-y
										min-width="auto"
									>
										<template v-slot:activator="{ on, attrs }">
											<v-text-field
												v-model="place.recognitionDate"
												label="Recognition Date"
												append-icon="mdi-calendar"
												readonly
												dense
												outlined
												background-color="white"
												v-bind="attrs"
												v-on="on"
											/>
										</template>
										<v-date-picker
											ref="picker"
											v-model="place.recognitionDate"
											:max="todaysDate"
											min="1950-01-01"
											@input="recognitionDateMenu = false"
											:readonly="!isEditing"
										/>
									</v-menu>
									<OwnerConsentTypeSelect
										v-model="place.ownerConsent"
										dense
										outlined
										background-color="white"
									/>
									<div class="rounded py-0">
										<v-checkbox
											v-model="place.isPubliclyAccessible"
											label="Publicly Accessible?"
											dense
											outlined
											hide-details
											class="my-0 py-0"
											:readonly="!isEditing"
										/>
									</div>
								</v-col>
							</v-row>
						</v-card-text>
					</v-card>
				</v-col>
				<v-col cols="6">
					<v-text-field
						v-model="place.yGBuildingNumber"
						label="YG Building Number"
						dense
						outlined
						required
						:readonly="!isEditing"
					/>
					<v-text-field
						v-model="place.yGReserveNumber"
						label="YG Reserve Number"
						dense
						outlined
						required
						:readonly="!isEditing"
					/>
					<v-text-field
						v-model="place.cIHBNumber"
						label="CIHB Number"
						dense
						outlined
						required
						:readonly="!isEditing"
					/>
					<v-text-field
						v-model="place.fHBRONumber"
						label="FHBRO Number"
						dense
						outlined
						required
						:readonly="!isEditing"
					/>
				</v-col>
			</v-row>
			<v-row>
				<v-col cols="12">
					<StatuteSelect
						v-model="place.statuteId"
						label="Statute - Recognition Authority / Recognition Type / Statute"
						dense
						outlined
					/>
					<StatuteSelect
						v-model="place.statute2Id"
						label="Secondary Statute - Recognition Authority / Recognition Type / Statute"
						dense
						outlined
						hide-details
					/>
				</v-col>
			</v-row>
		</v-card-text>
		<v-card-actions>
			<v-spacer></v-spacer>
			<v-btn
				v-if="isEditing"
				color="primary"
				@click="saveChanges"
				class="my-0"
			>
				Save
			</v-btn>
		</v-card-actions>
	</v-card>
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
