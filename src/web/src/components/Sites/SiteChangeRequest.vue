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
					:value="newPlace[item.key]"
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
import { cloneDeep } from 'lodash';

import placesApi from '@/apis/places-api';
import placeEditsApi from '@/apis/place-edits-api';

import CategoryTypesSelect from '@/components/Sites/site-change-request/CategoryTypesSelect';
import DesignationTypesSelect from '@/components/Sites/site-change-request/DesignationTypesSelect';

export default {
	name: 'SiteChangeRequest',
	components: {
		CategoryTypesSelect,
		DesignationTypesSelect,
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
		getPlace(placeId) {
			this.loading = true;
			return placesApi
				.get(placeId)
				.then(({ data }) => {
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
