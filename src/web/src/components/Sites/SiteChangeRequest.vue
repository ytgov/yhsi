<template lang="pug">
v-card(:loading="loading")
	v-card-title(tag="h2")
		| Site Change Request from
		v-progress-circular.ml-1(
			v-if="loading"
			indeterminate
			size="20"
			width="2"
		)
		span.ml-1(v-else) {{ placeEdit['editorEmail'] }}
		v-spacer
		v-checkbox(
			v-model="hideUnchanged"
			label="Hide unchanged fields?"
			dense
			hide-details
			@change="updateQueryParams('hideUnchanged', $event)"
		)
	v-card-text
		v-data-table.mb-5(
			:headers="headers",
			:items="hideUnchanged ? changedFieldTypes : fieldTypes",
			:items-per-page="fieldTypes.length",
			:loading="loading"
			disable-sort
			hide-default-footer
		)
			template(#item.original="{ item }")
				component(
					:is="item.type",
					:value="originalPlace[item.key]"
					readonly
					v-bind="item.fieldAttrs"
				)
			template(#item.new="{ item }")
				component(
					:is="item.type",
					:value="placeEdit[item.key]"
					readonly
					v-bind="item.fieldAttrs"
				)
			template(#item.actions="{ item }")
				template(v-if="hasChanges(item.key)")
					.d-flex
						v-btn(
							color="success"
							title="Accept"
							icon,
							:input-value="acceptedChanges[item.key]"
							@click="acceptChange(item.key)"
						)
							v-icon mdi-check
						v-btn.ml-4(
							color="warning"
							title="Reject"
							icon,
							:input-value="rejectedChanges[item.key]"
							@click="rejectChange(item.key)"
						)
							v-icon mdi-close
		v-row
			v-spacer
			v-col(cols="2")
				v-btn.my-0(
					color="success"
					small
					@click="acceptAll"
				)
					v-icon mdi-check
					| All
				v-btn.ml-4.my-0(
					color="warning"
					small
					@click="rejectAll"
				)
					v-icon mdi-close
					| All

	v-card-actions
		v-tooltip(
			right,
			:disabled="!hasUnconfirmedChanges"
		)
			template(#activator="{ on, attrs }")
				div(v-on="on")
					v-btn.my-0(
						color="primary",
						:disabled="hasUnconfirmedChanges"
						v-bind="attrs"
						v-on="on"
						@click="save"
					) Save
			span You may only save once all changes are confirmed or rejected.
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import { cloneDeep, isEqual } from 'lodash';

import AssociationsViewer from '@/components/Sites/site-change-request/AssociationsViewer';
import CategoryTypesSelect from '@/components/Sites/site-forms/CategoryTypesSelect';
import CommunitySelect from '@/components/Sites/site-forms/CommunitySelect';
import ConditionTypesSelect from '@/components/Sites/site-forms/ConditionTypesSelect';
import ConstructionPeriodsViewer from '@/components/Sites/site-change-request/ConstructionPeriodsViewer';
import ContactsViewer from '@/components/Sites/site-change-request/ContactsViewer';
import ContributingResourceTypesSelect from '@/components/Sites/site-forms/ContributingResourceTypesSelect';
import CoordinateDeterminationTypesSelect from '@/components/Sites/site-forms/CoordinateDeterminationTypesSelect';
import DatesViewer from '@/components/Sites/site-change-request/DatesViewer';
import DescriptionsViewer from '@/components/Sites/site-change-request/DescriptionsViewer';
import DesignationTypesSelect from '@/components/Sites/site-forms/DesignationTypesSelect';
import FirstNationAssociationsViewer from '@/components/Sites/site-change-request/FirstNationAssociationsViewer';
import FunctionalUsesViewer from '@/components/Sites/site-change-request/FunctionalUsesViewer';
import HistoricalPatternsViewer from '@/components/Sites/site-change-request/HistoricalPatternsViewer';
import JsonViewer from '@/components/Sites/site-change-request/JsonViewer';
import JurisdictionTypeSelect from '@/components/Sites/site-forms/management/JurisdictionTypeSelect';
import NamesViewer from '@/components/Sites/site-change-request/NamesViewer';
import OwnerConsentTypeSelect from '@/components/Sites/site-forms/management/OwnerConsentTypeSelect';
import OwnershipsViewer from '@/components/Sites/site-change-request/OwnershipsViewer';
import PreviousOwnershipsViewer from '@/components/Sites/site-change-request/PreviousOwnershipsViewer';
import RecordTypesSelect from '@/components/Sites/site-forms/RecordTypesSelect';
import RevisionLogsViewer from '@/components/Sites/site-change-request/RevisionLogsViewer';
import SiteCategoryTypesSelect from '@/components/Sites/site-forms/SiteCategoryTypesSelect';
import SiteStatusTypesSelect from '@/components/Sites/site-forms/SiteStatusTypesSelect';
import StatuteSelect from '@/components/Sites/site-forms/management/StatuteSelect';
import ThemesViewer from '@/components/Sites/site-change-request/ThemesViewer';
import WebLinksViewer from '@/components/Sites/site-change-request/WebLinksViewer';

const FIELD_TYPES = Object.freeze([
	// Summary Form Fields
	{
		key: 'yHSIId',
		type: 'v-text-field',
		fieldAttrs: {
			label: 'YHSI ID',
		},
	},
	{
		key: 'designations',
		type: DesignationTypesSelect,
	},
	{
		key: 'category',
		type: CategoryTypesSelect,
	},
	{
		key: 'siteCategories',
		type: SiteCategoryTypesSelect,
	},
	{
		key: 'records',
		type: RecordTypesSelect,
	},
	{
		key: 'contributingResources',
		type: ContributingResourceTypesSelect,
	},
	{
		key: 'showInRegister',
		type: 'v-checkbox',
		fieldAttrs: {
			label: 'Show in Register?',
		},
	},
	{
		key: 'primaryName',
		type: 'v-text-field',
		fieldAttrs: {
			label: 'Primary name',
		},
	},
	{
		key: 'names',
		type: NamesViewer,
	},
	{
		key: 'historicalPatterns',
		type: HistoricalPatternsViewer,
	},
	// Location Form Fields
	{
		key: 'communityId',
		type: CommunitySelect,
	},
	{
		key: 'otherCommunity',
		type: 'v-text-field',
		fieldAttrs: {
			label: 'Other community',
		},
	},
	{
		key: 'otherLocality',
		type: 'v-text-field',
		fieldAttrs: {
			label: 'Other locality',
		},
	},
	{
		key: 'physicalAddress',
		type: 'v-text-field',
		fieldAttrs: {
			label: 'Address',
		},
	},
	{
		key: 'physicalProvince',
		type: 'v-text-field',
		fieldAttrs: {
			label: 'Province',
		},
	},
	{
		key: 'physicalCountry',
		type: 'v-text-field',
		fieldAttrs: {
			label: 'Country',
		},
	},
	{
		key: 'physicalPostalCode',
		type: 'v-text-field',
		fieldAttrs: {
			label: 'Postal code',
		},
	},
	{
		key: 'previousAddress',
		type: 'v-text-field',
		fieldAttrs: {
			label: 'Previous address',
		},
	},
	{
		key: 'locationContext',
		type: 'v-text-field',
		fieldAttrs: {
			label: 'Context',
		},
	},
	{
		key: 'latitude',
		type: 'v-text-field',
		fieldAttrs: {
			label: 'Latitude',
		},
	},
	{
		key: 'longitude',
		type: 'v-text-field',
		fieldAttrs: {
			label: 'Longitude',
		},
	},
	{
		key: 'coordinateDetermination',
		type: CoordinateDeterminationTypesSelect,
	},
	{
		key: 'nTSMapSheet',
		type: 'v-text-field',
		fieldAttrs: {
			label: 'NTS map sheet',
		},
	},
	{
		key: 'bordenNumber',
		type: 'v-text-field',
		fieldAttrs: {
			label: 'Border number',
		},
	},
	{
		key: 'locationComment',
		type: 'v-text-field',
		fieldAttrs: {
			label: 'Misc. info',
		},
	},
	// Dates & Condition form fields
	{
		key: 'dates',
		type: DatesViewer,
	},
	{
		key: 'constructionPeriods',
		type: ConstructionPeriodsViewer,
	},
	{
		key: 'floorCondition',
		type: ConditionTypesSelect,
	},
	{
		key: 'roofCondition',
		type: ConditionTypesSelect,
	},
	{
		key: 'wallCondition',
		type: ConditionTypesSelect,
	},
	{
		key: 'doorCondition',
		type: ConditionTypesSelect,
	},
	{
		key: 'siteStatus',
		type: SiteStatusTypesSelect,
	},
	{
		key: 'buildingSize',
		type: 'v-text-field',
		fieldAttrs: {
			label: 'Building size',
		},
	},
	{
		key: 'resourceType',
		type: 'v-text-field',
		fieldAttrs: {
			label: 'All other resource types',
		},
	},
	{
		key: 'conditionComment',
		type: 'v-text-field',
		fieldAttrs: {
			label: 'Condition notes',
		},
	},
	// Themes & Function form fields
	{
		key: 'yHSThemes',
		type: 'v-textarea',
		fieldAttrs: {
			label: 'YHS Themes',
		},
	},
	{
		key: 'themes',
		type: ThemesViewer,
	},
	{
		key: 'functionalUses',
		type: FunctionalUsesViewer,
	},
	{
		key: 'currentUseComment',
		type: 'v-textarea',
		fieldAttrs: {
			label: 'YHS Current Use',
		},
	},
	{
		key: 'yHSPastUse',
		type: 'v-textarea',
		fieldAttrs: {
			label: 'YHS Past Use',
		},
	},
	// Associations form fields
	{
		key: 'associations',
		type: AssociationsViewer,
	},
	{
		key: 'firstNationAssociations',
		type: FirstNationAssociationsViewer,
	},
	// Legal & Zoning form fields
	{
		key: 'ownerships',
		type: OwnershipsViewer,
	},
	{
		key: 'zoning',
		type: 'v-text-field',
		fieldAttrs: {
			label: 'Zoning',
		},
	},
	{
		key: 'townSiteMapNumber',
		type: 'v-text-field',
		fieldAttrs: {
			label: 'Town site map number',
		},
	},
	{
		key: 'siteDistrictNumber',
		type: 'v-text-field',
		fieldAttrs: {
			label: 'Site district',
		},
	},
	{
		key: 'groupYHSI',
		type: 'v-text-field',
		fieldAttrs: {
			label: 'Group YHSI',
		},
	},
	{
		key: 'lAGroup',
		type: 'v-text-field',
		fieldAttrs: {
			label: 'Group',
		},
	},
	{
		key: 'lot',
		type: 'v-text-field',
		fieldAttrs: {
			label: 'Lot',
		},
	},
	{
		key: 'block',
		type: 'v-text-field',
		fieldAttrs: {
			label: 'Block',
		},
	},
	{
		key: 'planNumber',
		type: 'v-text-field',
		fieldAttrs: {
			label: 'Plan number',
		},
	},
	{
		key: 'previousOwnerships',
		type: PreviousOwnershipsViewer,
	},
	// Management form fields
	{
		key: 'revisionLogs',
		type: RevisionLogsViewer,
	},
	{
		key: 'contacts',
		type: ContactsViewer,
	},
	{
		key: 'webLinks',
		type: WebLinksViewer,
	},
	{
		key: 'jurisdiction',
		type: JurisdictionTypeSelect,
	},
	{
		key: 'recognitionDate',
		type: 'v-text-field',
		fieldAttrs: { label: 'Recognition Date' },
	},
	{
		key: 'ownerConsent',
		type: OwnerConsentTypeSelect,
	},
	{
		key: 'isPubliclyAccessible',
		type: 'v-checkbox',
		fieldAttrs: { label: 'Publicly Accessible?' },
	},
	{
		key: 'yGBuildingNumber',
		type: 'v-text-field',
		fieldAttrs: { label: 'YG Building Number' },
	},
	{
		key: 'yGReserveNumber',
		type: 'v-text-field',
		fieldAttrs: { label: 'YG Reserve Number' },
	},
	{
		key: 'cIHBNumber',
		type: 'v-text-field',
		fieldAttrs: { label: 'CIHB Number' },
	},
	{
		key: 'fHBRONumber',
		type: 'v-text-field',
		fieldAttrs: { label: 'FHBRO Number' },
	},
	{
		key: 'statuteId',
		type: StatuteSelect,
		fieldAttrs: {
			label: 'Statute - Recognition Authority / Recognition Type / Statute',
		},
	},
	{
		key: 'statute2Id',
		type: StatuteSelect,
		fieldAttrs: {
			label:
				'Secondary Statute - Recognition Authority / Recognition Type / Statute',
		},
	},
	// Description form fields
	{
		key: 'descriptions',
		type: DescriptionsViewer,
	},
]);

export default {
	name: 'SiteChangeRequest',
	components: {
		AssociationsViewer,
		CategoryTypesSelect,
		CommunitySelect,
		ConditionTypesSelect,
		ConstructionPeriodsViewer,
		ContactsViewer,
		ContributingResourceTypesSelect,
		CoordinateDeterminationTypesSelect,
		DatesViewer,
		DescriptionsViewer,
		DesignationTypesSelect,
		FirstNationAssociationsViewer,
		FunctionalUsesViewer,
		HistoricalPatternsViewer,
		JsonViewer,
		JurisdictionTypeSelect,
		NamesViewer,
		OwnerConsentTypeSelect,
		OwnershipsViewer,
		PreviousOwnershipsViewer,
		RecordTypesSelect,
		RevisionLogsViewer,
		SiteCategoryTypesSelect,
		SiteStatusTypesSelect,
		StatuteSelect,
		ThemesViewer,
		WebLinksViewer,
	},
	props: {
		placeEditId: {
			type: [Number, String],
			required: true,
		},
	},
	data: () => ({
		internalLoading: false,
		originalPlace: {},
		hideUnchanged: true,
		acceptedChanges: {},
		rejectedChanges: {},
	}),
	computed: {
		...mapGetters({
			place: 'places/place',
			placeEdit: 'placeEdits/placeEdit',
			placeEditLoading: 'placeEdits/loading',
			placeLoading: 'places/loading',
		}),
		acceptedAndRejectedChanges() {
			return { ...this.acceptedChanges, ...this.rejectedChanges };
		},
		changedFieldTypeKeys() {
			return this.changedFieldTypes.map(({ key }) => key);
		},
		changedFieldTypes() {
			return this.fieldTypes.filter(
				({ key }) => !isEqual(this.placeEdit[key], this.originalPlace[key])
			);
		},
		hasUnconfirmedChanges() {
			return !this.changedFieldTypeKeys.every(
				(key) => this.acceptedChanges[key] || this.rejectedChanges[key]
			);
		},
		headers() {
			return [
				{ text: 'Original', value: 'original' },
				{ text: 'New', value: 'new' },
				{ text: 'Actions', value: 'actions' },
			];
		},
		fieldTypes() {
			return FIELD_TYPES;
		},
		loading() {
			return this.internalLoading || this.placeLoading || this.placeEditLoading;
		},
	},
	watch: {},
	mounted() {
		this.hideUnchanged = JSON.parse(this.$route.query.hideUnchanged || 'true');

		this.initializePlaceEdit(this.placeEditId).then((placeEdit) => {
			return this.initializePlace(placeEdit.placeId).then((place) => {
				this.originalPlace = cloneDeep(place);
			});
		});
	},
	methods: {
		...mapActions({
			deletePlaceEdit: 'placeEdits/delete',
			initializePlace: 'places/initialize',
			initializePlaceEdit: 'placeEdits/initialize',
			savePlace: 'places/save',
		}),
		acceptAll() {
			this.fieldTypes.forEach(({ key }) => {
				this.acceptChange(key);
			});
		},
		acceptChange(key) {
			this.place[key] = this.placeEdit[key];
			this.$delete(this.rejectedChanges, key);
			this.$set(this.acceptedChanges, key, true);
		},
		hasChanges(key) {
			return this.changedFieldTypeKeys.includes(key);
		},
		rejectAll() {
			this.fieldTypes.forEach(({ key }) => {
				this.rejectChange(key);
			});
		},
		rejectChange(key) {
			this.place[key] = this.originalPlace[key];
			this.$delete(this.acceptedChanges, key);
			this.$set(this.rejectedChanges, key, true);
		},
		save() {
			this.internalLoading = true;
			return this.savePlace(this.place)
				.then(() => {
					return this.deletePlaceEdit(this.placeEditId);
				})
				.then(() => {
					this.$router.push('/sites-change-requests');
				})
				.finally(() => {
					this.internalLoading = false;
				});
		},
		updateQueryParams(key, value) {
			this.$router.push({
				path: `/sites-change-requests/${this.placeEditId}`,
				query: {
					...this.$route.query,
					[key]: value,
				},
			});
		},
	},
};
</script>

<style scoped></style>
