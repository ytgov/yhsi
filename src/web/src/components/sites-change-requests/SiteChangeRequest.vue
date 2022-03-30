<template lang="pug">
v-card
	v-card-title(tag='h2')
		| Site Change Request from {{ placeEdit['editorEmail'] }}
	v-card-text
		v-row
			v-col(cols='5')
				h3.mb-0 New
			v-col(cols='5')
				h3.mb-0 Original
			v-col(cols='2')
		v-row(v-for='{ type, key, fieldAttrs } in fieldTypes', :key='key')
			v-col(cols='5')
				component(
					:is='type',
					:value='placeEdit[key]',
					readonly,
					v-bind='fieldAttrs'
				)
			v-col(cols='5')
				component(:is='type', :value='place[key]', readonly, v-bind='fieldAttrs')
			v-col.d-flex.justify-center(cols='2')
				v-btn(color='success', title='Accept', icon)
					v-icon mdi-check
				v-btn.ml-4(color='warning', title='Reject', icon)
					v-icon mdi-close
		v-row
			v-col(cols='5')
			v-col(cols='5')
			v-col.d-flex.justify-center(cols='2')
				v-btn.my-0(color='success', small)
					v-icon mdi-check
					| All
				v-btn.ml-4.my-0(color='warning', small)
					v-icon mdi-close
					| All
	v-card-actions
		v-btn.my-0(color='primary')
			| Save
</template>

<script>
export default {
	name: 'SiteChangeRequest',
	components: {},
	props: {
		siteId: {
			type: [Number, String],
			required: true,
		},
	},
	data: () => ({
		place: {
			yhsiId: '115J/14/007',
			designations: 4,
		},
		placeEdit: {
			yhsiId: '115J/14/008',
			designations: 3,
			editorEmail: 'klondikemarlen@gmail.com',
		},
	}),
	computed: {
		designationOptions() {
			// in the future will retrieve from Vuex store
			return [
				{ value: 4, text: 'Federal' },
				{ value: 2, text: 'Municipal' },
				{ value: 3, text: 'Territorial' },
				{ value: 5, text: 'World' },
				{ value: 0, text: 'Not Designated' },
			];
		},
		fieldTypes() {
			return [
				{
					key: 'yhsiId',
					type: 'v-text-field',
					fieldAttrs: {
						label: 'YHSI ID',
					},
				},
				{
					key: 'designations',
					type: 'v-select',
					fieldAttrs: {
						items: this.designationOptions,
						label: 'Designations',
					},
				},
			];
		},
	},
	watch: {},
	mounted() {},
	methods: {},
};
</script>

<style scoped></style>
