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
			:loading="loading"
			disable-sort
			hide-default-footer
		)
			template(#item.original="{ item }")
				component(
					:is="item.type",
					:value="place[item.key]"
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
import { cloneDeep, isEqual, get } from 'lodash';

import placesApi from '@/apis/places-api';
import placeEditsApi from '@/apis/place-edits-api';

import CategoryTypesSelect from '@/components/Sites/site-forms/CategoryTypesSelect';
import CommunitySelect from '@/components/Sites/site-forms/CommunitySelect';
import ContributingResourceTypesSelect from '@/components/Sites/site-forms/ContributingResourceTypesSelect';
import DesignationTypesSelect from '@/components/Sites/site-forms/DesignationTypesSelect';
import HistoricalPatternsViewer from '@/components/Sites/site-change-request/HistoricalPatternsViewer';
import JsonViewer from '@/components/Sites/site-change-request/JsonViewer';
import NamesViewer from '@/components/Sites/site-change-request/NamesViewer';
import RecordTypesSelect from '@/components/Sites/site-forms/RecordTypesSelect';
import SiteCategoryTypesSelect from '@/components/Sites/site-forms/SiteCategoryTypesSelect';

export default {
	name: 'SiteChangeRequest',
	components: {
		CategoryTypesSelect,
		CommunitySelect,
		ContributingResourceTypesSelect,
		DesignationTypesSelect,
		HistoricalPatternsViewer,
		JsonViewer,
		NamesViewer,
		RecordTypesSelect,
		SiteCategoryTypesSelect,
	},
	props: {
		placeEditId: {
			type: [Number, String],
			required: true,
		},
	},
	data: () => ({
		loading: false,
		newPlace: {},
		place: {},
		placeEdit: {},
		hideUnchanged: true,
		acceptedChanges: {},
		rejectedChanges: {},
	}),
	computed: {
		acceptedAndRejectedChanges() {
			return { ...this.acceptedChanges, ...this.rejectedChanges };
		},
		changedFieldTypeKeys() {
			return this.changedFieldTypes.map(({ key }) => key);
		},
		changedFieldTypes() {
			return this.fieldTypes.filter(
				({ key }) => !isEqual(this.placeEdit[key], this.place[key])
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
			return [
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
			];
		},
	},
	watch: {},
	mounted() {
		this.hideUnchanged = JSON.parse(this.$route.query.hideUnchanged || 'true');
		this.getPlaceEdit(this.placeEditId).then((placeEdit) => {
			return this.getPlace(placeEdit.placeId);
		});
	},
	methods: {
		acceptAll() {
			this.fieldTypes.forEach(({ key }) => {
				this.acceptChange(key);
			});
		},
		acceptChange(key) {
			this.newPlace[key] = this.placeEdit[key];
			this.$delete(this.rejectedChanges, key);
			this.$set(this.acceptedChanges, key, true);
		},
		// This function can go away when the back-end serves the
		// relationship data as part of the data directly.
		// e.g. { data: { names: [{ id: 1, placeId: 1, description: "SomeName" }] } }
		// instead of { data: {}, relationships: { names: { data: [{ id: 1, placeId: 1, description: "SomeName" }] } } }
		injectRelationshipData(data, relationships) {
			Object.keys(relationships).forEach((key) => {
				if (key in data) {
					console.error('Relationship data conflicts with source data.');
					return;
				}

				data[key] = get(relationships, `${key}.data`, []);
			});
		},
		getPlace(placeId) {
			this.loading = true;
			return placesApi
				.get(placeId)
				.then(({ data, relationships }) => {
					this.injectRelationshipData(data, relationships);
					this.place = data;
					this.newPlace = cloneDeep(this.place);
				})
				.finally(() => {
					this.loading = false;
				});
		},
		getPlaceEdit(placeEditId) {
			this.loading = true;
			return placeEditsApi
				.get(placeEditId)
				.then(({ data }) => {
					this.placeEdit = data;
					return this.placeEdit;
				})
				.finally(() => {
					this.loading = false;
				});
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
			this.newPlace[key] = this.place[key];
			this.$delete(this.acceptedChanges, key);
			this.$set(this.rejectedChanges, key, true);
		},
		save() {
			this.loading = true;
			return placesApi
				.patch(this.place.id, this.newPlace)
				.then(() => {
					return placeEditsApi.delete(this.placeEditId);
				})
				.then(() => {
					this.$router.push('/sites-change-requests');
				})
				.finally(() => {
					this.loading = false;
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
