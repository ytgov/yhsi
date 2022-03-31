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
	v-card-text
		v-data-table.mb-5(
			:headers="headers",
			:items="fieldTypes",
			:loading="loading"
			disable-sort
			hide-default-footer
		)
			template(#item.new="{ item }")
				component(
					:is="item.type",
					:value="placeEdit[item.key]"
					readonly
					v-bind="item.fieldAttrs"
				)
			template(#item.original="{ item }")
				component(
					:is="item.type",
					:value="get(newPlace, item.placeKey, newPlace[item.key])"
					readonly
					v-bind="item.fieldAttrs"
				)
			template(#item.actions="{ item }")
				v-btn(
					color="success"
					title="Accept"
					icon
				)
					v-icon mdi-check
				v-btn.ml-4(
					color="warning"
					title="Reject"
					icon
				)
					v-icon mdi-close
		v-row
			v-spacer
			v-col(cols="2")
				v-btn.my-0(
					color="success"
					small
				)
					v-icon mdi-check
					| All
				v-btn.ml-4.my-0(
					color="warning"
					small
				)
					v-icon mdi-close
					| All

	v-card-actions
		v-btn.my-0(color="primary")
			| Save
</template>

<script>
import { cloneDeep, get } from 'lodash';

import placesApi from '@/apis/places-api';
import placeEditsApi from '@/apis/place-edits-api';

import CategoryTypesSelect from '@/components/Sites/site-change-request/CategoryTypesSelect';
import DesignationTypesSelect from '@/components/Sites/site-change-request/DesignationTypesSelect';
import JsonViewer from '@/components/Sites/site-change-request/JsonViewer';

export default {
	name: 'SiteChangeRequest',
	components: {
		CategoryTypesSelect,
		DesignationTypesSelect,
		JsonViewer,
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
	}),
	computed: {
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
					fieldAttrs: {
						label: 'Designations',
					},
				},
				{
					key: 'category',
					type: CategoryTypesSelect,
					fieldAttrs: {
						label: 'CRHP category',
					},
				},
				{
					key: 'records',
					type: 'v-text-field', // needs a select component
					fieldAttrs: {
						label: 'Records',
					},
				},
				{
					key: 'contributingResources', // no clue what the data format is
					type: 'v-text-field',
					fieldAttrs: {
						label: 'Contribuiting resources',
					},
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
					key: 'nameJSON',
					placeKey: 'names',
					type: 'JsonViewer',
					fieldAttrs: {
						label: 'Primary name',
					},
				},
			];
		},
	},
	watch: {},
	mounted() {
		this.getPlaceEdit(this.placeEditId).then((placeEdit) => {
			return this.getPlace(placeEdit.placeId);
		});
	},
	methods: {
		get,
		// This function can go away when the back-end serves the
		// relationship data as part of the data directly.
		// e.g. { data: { names: [{ id: 1, placeId: 1, description: "SomeName" }] } }
		// instead of { data: {}, relationships: { names: [{ id: 1, placeId: 1, description: "SomeName" }] } } }
		injectRelationshipData(data, relationships) {
			Object.keys(relationships).forEach((key) => {
				if (key in data) {
					console.error('Relationship data conflicts with source data.');
					return;
				}

				data[key] = get(relationships, `data.${key}`, []);
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
	},
};
</script>

<style scoped></style>
