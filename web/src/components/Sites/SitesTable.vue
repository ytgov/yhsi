<template>
	<div>
		<v-breadcrumbs :items="[
			{ text: 'Home', to: '/', exact: true },
			{ text: 'Sites' },
		]"></v-breadcrumbs>

		<h1>YHSI Sites</h1>

		<div class="mt-2">
			<v-card class="default">
				<v-card-text>
					<div class="d-flex mb-6">
						<v-text-field v-model="searchTerm" label="Search" prepend-inner-icon="mdi-magnify"
							background-color="white" dense outlined clearable hide-details class="mr-5"
							@keyup="keyUp" />
						<v-btn class="my-0 mr-2" color="secondary" style="height: 40px"
							:aria-controls="advancedSearchId" @click="toggleAdvancedSearch">
							Advanced search
							<v-icon v-if="isShowingAdvancedSearch">mdi-chevron-up</v-icon>
							<v-icon v-else>mdi-chevron-down</v-icon>
						</v-btn>
						<v-btn v-if="isEditor" color="primary" class="my-0" style="height: 40px" to="/sites/create">
							Add New Site
						</v-btn>
					</div>

					<AdvancedSearchForm v-show="isShowingAdvancedSearch" :id="advancedSearchId" class="mb-4"
						@search="doAdvancedSearch" />

					<v-data-table dense :items="items" :headers="headers" :options.sync="options" :loading="loading"
						:server-items-length="totalLength" :footer-props="{ 'items-per-page-options': [20, 50, 100] }"
						@click:row="goToSiteDetails" class="clickable-row">
						<template #item.communityId="{ value }">
							<CommunityCell :community-id="value" />
						</template>
					</v-data-table>
				</v-card-text>
			</v-card>
		</div>
	</div>
</template>

<script>
import { cloneDeep, uniqueId } from 'lodash';
import { mapActions, mapGetters } from 'vuex';

import api from '@/apis/places-api';

import AdvancedSearchForm from '@/components/Sites/sites-table/AdvancedSearchForm';
import CommunityCell from '@/components/Sites/sites-table/CommunityCell';

export default {
	name: 'SitesTable',
	components: { AdvancedSearchForm, CommunityCell },
	data: () => ({
		advancedSearchQuery: {},
		items: [],
		loading: false,
		options: {},
		page: 1,
		pageCount: 0,
		searchTerm: '',
		isShowingAdvancedSearch: false,
		totalLength: 0,
	}),
	computed: {
		...mapGetters('places', ['isEditor']),
		advancedSearchId() {
			return uniqueId('advanced-search-');
		},
		headers() {
			return [
				{ text: 'YHSI ID', value: 'yHSIId' },
				{ text: 'Primary name', value: 'primaryName' },
				{ text: 'Community', value: 'communityId' },
				{ text: 'Category', value: 'siteCategories' },
				{ text: 'Status', value: 'status' },
			];
		},
		searchQuery() {
			if (!this.searchTerm) return {};

			// query format is operation: value
			// operation is a custom operation defined in the back-end
			return { search: this.searchTerm };
		},
	},
	watch: {
		options: {
			handler() {
				this.doSearch();
			},
			deep: true,
		},
	},
	mounted() {
		this.initializeCommunities();
	},
	methods: {
		...mapActions({ initializeCommunities: 'communities/initialize' }),
		goToSiteDetails(value) {
			this.$router.push(`/sites/${value.id}`);
		},
		keyUp(event) {
			if (event.key == 'Enter') this.doSearch();
		},
		doAdvancedSearch(query) {
			this.advancedSearchQuery = query;
			this.doSearch();
		},
		doSearch() {
			const data = cloneDeep(this.options);
			data.query = { ...this.searchQuery, ...this.advancedSearchQuery };

			this.loading = true;
			api
				.search(data)
				.then(({ data, meta }) => {
					this.items = data;
					this.totalLength = meta.itemCount;
				})
				.finally(() => {
					this.loading = false;
				});
		},
		toggleAdvancedSearch() {
			if (this.isShowingAdvancedSearch) {
				this.doSearch();
			}
			this.isShowingAdvancedSearch = !this.isShowingAdvancedSearch;
		},
		addSiteClick() {
			console.log("ADDING")
		}
	},
};
</script>

<style scoped></style>
