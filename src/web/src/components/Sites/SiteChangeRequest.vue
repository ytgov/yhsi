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
			template(#item.new="{ item }")
				component(
					:is="item.type",
					:value="placeEdit[item.key]"
					readonly,
					:class="higlightChange(item.key) ? ['green', 'accent-1'] : []"
					v-bind="item.fieldAttrs"
				)
			template(#item.original="{ item }")
				component(
					:is="item.type",
					:value="newPlace[item.key]"
					readonly,
					:class="buildStateClass(item.key)"
					v-bind="item.fieldAttrs"
				)
			template(#item.actions="{ item }")
				v-btn(
					color="success"
					title="Accept"
					icon
					@click="acceptChange(item.key)"
				)
					v-icon mdi-check
				v-btn.ml-4(
					color="warning"
					title="Reject"
					icon
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
		v-btn.my-0(
			color="primary"
			@click="save"
		)
			| Save
</template>

<script>
import { cloneDeep, isEqual, get } from 'lodash';

import placesApi from '@/apis/places-api';
import placeEditsApi from '@/apis/place-edits-api';

import CategoryTypesSelect from '@/components/Sites/CategoryTypesSelect';
import ContributingResourceTypesSelect from '@/components/Sites/ContributingResourceTypesSelect';
import DesignationTypesSelect from '@/components/Sites/DesignationTypesSelect';
import JsonViewer from '@/components/Sites/site-change-request/JsonViewer';
import RecordTypesSelect from '@/components/Sites/RecordTypesSelect';
import SiteCategoryTypesSelect from '@/components/Sites/SiteCategoryTypesSelect';

export default {
	name: 'SiteChangeRequest',
	components: {
		CategoryTypesSelect,
		ContributingResourceTypesSelect,
		DesignationTypesSelect,
		JsonViewer,
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
		acceptedChanges: new Set(),
		rejectedChanges: new Set(),
	}),
	computed: {
		changedFieldTypes() {
			return this.fieldTypes.filter(
				({ key }) => !isEqual(this.placeEdit[key], this.place[key])
			);
		},
		headers() {
			return [
				{ text: 'New', value: 'new' },
				{ text: 'Original', value: 'original' },
				{ text: 'Actions', value: 'actions' },
			];
		},
		fieldTypes() {
			return [
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
					type: 'JsonViewer',
					fieldAttrs: {
						label: 'Names',
					},
				},
				{
					key: 'historicalPatterns',
					type: 'JsonViewer',
					fieldAttrs: {
						label: 'Historical Patterns',
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
			this.changedFieldTypes.forEach(({ key }) => {
				this.acceptChange(key);
			});
		},
		acceptChange(key) {
			this.newPlace[key] = this.placeEdit[key];
			this.rejectedChanges.delete(key);
			this.acceptedChanges.add(key);
		},
		buildStateClass(key) {
			if (this.rejectedChanges.has(key)) {
				return ['orange', 'accent-1'];
			}

			if (this.acceptedChanges.has(key)) {
				return ['green', 'accent-1'];
			}

			return [];
		},
		higlightChange(key) {
			return (
				!this.rejectedChanges.has(key) &&
				!isEqual(this.placeEdit[key], this.newPlace[key])
			);
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
		rejectAll() {
			this.changedFieldTypes.forEach(({ key }) => {
				this.rejectChange(key);
			});
		},
		rejectChange(key) {
			this.newPlace[key] = this.place[key];
			this.acceptedChanges.delete(key);
			this.rejectedChanges.add(key);
		},
		save() {
			this.loading = true;
			return placesApi
				.put(this.place.id, this.newPlace)
				.then(() => {
					console.log(
						'placesApi update successfully, in future will delete change request.'
					);
					// return placeEditsApi.delete(this.placeEditId)
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
				path: '/sites-change-requests/5336',
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
