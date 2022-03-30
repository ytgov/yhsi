<template lang="pug">
v-card
	v-card-title
		| Site Change Request
	v-card-text
		| Site Change Request {{ siteId }}
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
	data: () => ({}),
	computed: {},
	watch: {},
	mounted() {},
	methods: {},
};
</script>

<style scoped></style>
