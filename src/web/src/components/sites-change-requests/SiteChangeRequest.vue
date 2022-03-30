<template lang="pug">
v-card
	v-card-title(tag='h2')
		| Site Change Request {{ siteId }}
	v-card-text
		v-row
			v-col.d-flex.justify-end(cols='5')
				h3.mb-0 Original
			v-col(cols='2')
			v-col(cols='5')
				h3.mb-0 New
		v-row(v-for='{ type, key, attributes } in fieldTypes')
			v-col.d-flex.justify-end(cols='5')
				component(
					:is='type',
					:value='place[key]',
					readonly,
					reverse,
					v-bind='attributes'
				)
			v-col.d-flex.justify-center(cols='2')
				v-btn(color='success', title='Accept', icon)
					v-icon mdi-check
				v-btn.ml-4(color='warning', title='Reject', icon)
					v-icon mdi-close
			v-col(cols='5')
				component(
					:is='type',
					:value='placeEdit[key]',
					readonly,
					v-bind='attributes'
				)
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
				},
				{
					key: 'designations',
					type: 'v-select',
					attributes: {
						items: this.designationOptions,
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
