<template lang="pug">
v-data-table(
	:headers='headers',
	:items='items',
	:options='options',
	:loading='loading',
	:server-items-length='totalCount',
	:footer-props='{ "items-per-page-options": [10, 20, 100] }',
	disable-sort,
	dense,
	@update:options='updateOptions',
	@click:row='goToSiteChangeRequestDetails'
)
	template(#item.editorEmail='{ value }')
		| {{ value || 'Unknown' }}
	template(#item.editDate='{ value }')
		| {{ prettyDate(value) }}
</template>

<script>
import api from '@/apis/place-edits-api';

export default {
	name: 'SitesChangeRequestsTable',
	components: {},
	props: {},
	data: () => ({
		items: [],
		loading: false,
		options: {},
		page: 1,
		totalCount: 0,
	}),
	computed: {
		headers() {
			return [
				{ text: 'YHSI ID', value: 'yhsiId' },
				{ text: 'Primary name', value: 'primaryName' },
				{ text: 'Editor', value: 'editorEmail' },
				{ text: 'Edit Date', value: 'editDate' },
			];
		},
	},
	mounted() {},
	methods: {
		getPlaceEdits(options) {
			api.getAll(options).then(({ data, meta }) => {
				this.items = data;
				this.totalCount = meta.totalCount;
			});
		},
		goToSiteChangeRequestDetails(value) {
			this.$router.push(`/sites-change-requests/${value.id}`);
		},
		prettyDate(value) {
			return new Date(value).toLocaleDateString();
		},
		updateOptions(options) {
			this.options = options;
			return this.getPlaceEdits(options);
		},
	},
};
</script>

<style scoped></style>
