<template>
	<div>
		<div class="flex-grow-1">
			<v-breadcrumbs :items="[
				{ text: 'Home', to: '/', exact: true },
				{ text: 'Sites', to: '/sites', exact: true },
				{ text: 'Add New Site' },
			]"></v-breadcrumbs>

			<h1>Add New Site</h1>

			<v-card class="default mt-5">
				<v-card-title>Add New Site</v-card-title>
				<v-card-text>
					<v-form ref="formRef">
						<v-row>
							<v-col cols="6" class="pb-0">
								<v-text-field v-model="place.primaryName" dense outlined label="Primary name" required
									background-color="white" :rules="requiredRules" />
								<v-text-field v-model="place.fR_PrimaryName" dense outlined
									label="Primary name (French)" background-color="white" />
							</v-col>
							<v-col cols="6" class="pb-0">
								<v-autocomplete v-model="place.nTSMapSheet" :items="ntsMapSheets" label="NTS Map Sheet"
									item-text="name" item-value="name" dense outlined background-color="white"
									:rules="requiredRules" />
							</v-col>

							<v-col cols="6" class="pb-0">
								<CategoryTypesSelect v-model="place.category" dense outlined background-color="white" :rules="requiredNumRules" />
							</v-col>

							<v-col cols="6" class="pb-0">
								<CommunitySelect v-model="place.communityId" dense outlined background-color="white" :rules="requiredNumRules" />
							</v-col>
							<v-col cols="6" class="pb-0">
								<SiteStatusTypesSelect v-model="place.siteStatus" dense outlined
									background-color="white" :rules="requiredNumRules" />
							</v-col>

							<v-col cols="6" class="pb-0">
								<OwnerConsentTypeSelect v-model="place.ownerConsent" dense outlined
									background-color="white" :rules="requiredNumRules" />
							</v-col>
							<v-col cols="6" class="pb-0">
								<ConditionTypesSelect v-model="place.floorCondition" label="Floor condition" dense
									outlined background-color="white" :rules="requiredNumRules" />
							</v-col>
							<v-col cols="6" class="pb-0">
								<ConditionTypesSelect v-model="place.wallCondition" label="Wall condition" dense
									outlined background-color="white" :rules="requiredNumRules" />
							</v-col>
							<v-col cols="6" class="pb-0">
								<ConditionTypesSelect v-model="place.doorCondition" label="Door condition" dense
									outlined background-color="white" :rules="requiredNumRules" />
							</v-col>
							<v-col cols="6" class="pb-0">
								<ConditionTypesSelect v-model="place.roofCondition" label="Roof condition" dense
									outlined background-color="white" :rules="requiredNumRules" />
							</v-col>
							<v-col cols="6" class="pb-0">
								<JurisdictionTypeSelect v-model="place.jurisdiction" dense outlined
									background-color="white" :rules="requiredNumRules" />
							</v-col>
							<v-col cols="6" class="pb-0">
								<CoordinateDeterminationTypesSelect v-model="place.coordinateDetermination" dense
									outlined background-color="white" :rules="requiredNumRules" />
							</v-col>

							<v-col cols="6" class="pb-0">
								<v-text-field v-model="place.latitude" dense outlined label="Latitude"
									background-color="white" :rules="requiredRules" />
							</v-col>
							<v-col cols="6" class="pb-0">
								<v-text-field v-model="place.longitude" dense outlined label="Longitude"
									background-color="white" :rules="requiredRules" />
							</v-col>

							<v-col>
								<StatuteSelect v-model="place.statuteId"
									label="Statute - Recognition Authority / Recognition Type / Statute" dense outlined
									background-color="white" :rules="requiredNumRules" />
								<StatuteSelect v-model="place.statute2Id"
									label="Secondary Statute - Recognition Authority / Recognition Type / Statute" dense
									outlined background-color="white" :rules="requiredNumRules" />
							</v-col>
						</v-row>

						<div class="d-flex">
							<v-btn color="warning" outlined to="/sites">Cancel</v-btn>
							<v-spacer></v-spacer>
							<v-btn color="primary" @click="saveClick">Save</v-btn>
						</div>
					</v-form>
				</v-card-text>
			</v-card>
		</div>
	</div>
</template>

<script>
import { mapActions } from 'vuex';
import { isNumber, isEmpty } from 'lodash';
import ntsMapSheetsApi from '@/apis/nts-map-sheets-api';
import ConditionTypesSelect from './site-forms/ConditionTypesSelect.vue';
import JurisdictionTypeSelect from './site-forms/management/JurisdictionTypeSelect.vue';
import OwnerConsentTypeSelect from './site-forms/management/OwnerConsentTypeSelect.vue';
import StatuteSelect from './site-forms/management/StatuteSelect.vue';
import CategoryTypesSelect from './site-forms/CategoryTypesSelect.vue';
import CommunitySelect from './site-forms/CommunitySelect.vue';
import SiteStatusTypesSelect from './site-forms/SiteStatusTypesSelect.vue';
import CoordinateDeterminationTypesSelect from './site-forms/CoordinateDeterminationTypesSelect.vue';

export default {
	name: 'SiteCreate',
	components: {
		ConditionTypesSelect,
		JurisdictionTypeSelect,
		OwnerConsentTypeSelect,
		StatuteSelect,
		CategoryTypesSelect,
		CommunitySelect,
		SiteStatusTypesSelect,
		CoordinateDeterminationTypesSelect,
	},
	data: () => ({
		place: {
			primaryName: null,
			nTSMapSheet: null,
			jurisdiction: null,
			statuteId: null,
			statute2Id: null,
			ownerConsent: null,
			category: null,
			communityId: null,
			siteStatus: null,
			floorCondition: null,
			wallCondition: null,
			doorCondition: null,
			roofCondition: null,
			yHSIId: 'GENERATE',
			latitude: null,
			longitude: null,
			coordinateDetermination: null,
			showInRegister: false,
			isPubliclyAccessible: false,
		},
		ntsMapSheets: [],
		requiredRules: [(v) => !isEmpty(v) || 'This field is required'],
		requiredNumRules: [(v) => !!isNumber(v) || 'This field is required'],
	}),
	computed: {},
	async mounted() {
		const mapSheets = await ntsMapSheetsApi.getAll();
		this.ntsMapSheets = mapSheets.data;
	},
	methods: {
		...mapActions({
			createPlace: 'places/create',
		}),
		async saveClick() {
			const isValid = this.$refs.formRef.validate();

			if (!isValid) {
				return;
			}

			await this.createPlace(this.place)
				.then((resp) => {
					if (resp.Id) {
						this.$router.push(`/sites/${resp.Id}`);
					}
				})
				.catch((e) => {
					console.log('ERROR', e);
				});
		},
		showError: function (msg) {
			this.$emit('showError', msg);
		},
		showSuccess: function (msg) {
			this.$emit('showSuccess', msg);
		},
		showAPIMessages: function (msg) {
			this.$emit('showAPIMessages', msg);
		},
	},
};
</script>

<style scoped>
.list-menu {
	padding: 0px 8px 0px 0px;
}
</style>
