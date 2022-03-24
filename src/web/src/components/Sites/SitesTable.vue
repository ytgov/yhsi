<template>
	<v-container fluid>
		<v-row>
			<v-col cols="12">
				<h2>Sites</h2>
			</v-col>
		</v-row>
		<v-divider class="mb-5" />
		<v-row>
			<v-col cols="9">
				<v-text-field
					v-model="searchTerm"
					label="Search"
					dense
					outlined
					clearable
					append-icon="mdi-magnify"
					hint="Enter criteria and press enter"
					@click:append="doSearch"
					@keyup="keyUp"
				/>
			</v-col>
			<v-col cols="3">
				<v-btn
					class="my-0"
					color="secondary"
					:aria-controls="advancedSearchId"
					@click="toggleAdvancedSearch"
				>
					Advanced search
					<v-icon
						v-if="isShowingAdvancedSearch"
						class="chevron"
					>
						mdi-chevron-up
					</v-icon>
					<v-icon
						v-else
						class="chevron"
					>
						mdi-chevron-down
					</v-icon>
				</v-btn>
			</v-col>
		</v-row>
		<AdvancedSearchForm
			v-show="isShowingAdvancedSearch"
			:id="advancedSearchId"
			class="mb-4"
			@search="doAdvancedSearch"
		/>
		<v-row>
			<v-col
				cols="12"
				class="d-flex justify-end"
			>
				{{ totalLength }} Results
			</v-col>
		</v-row>
		<v-divider
			inset
			class="mb-2"
		/>
		<v-row>
			<v-col>
				<v-data-table
					dense
					:items="items"
					:headers="headers"
					:options.sync="options"
					:loading="loading"
					:server-items-length="totalLength"
					:footer-props="{ 'items-per-page-options': [20, 50, 100] }"
					@click:row="goToSiteDetails"
				/>
			</v-col>
		</v-row>
	</v-container>
</template>

<script>
import { cloneDeep, uniqueId } from 'lodash';

import api from '@/apis/places-api';

import AdvancedSearchForm from '@/components/Sites/sites-table/AdvancedSearchForm';

export default {
	name: 'SitesTable',
	components: { AdvancedSearchForm },
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
		advancedSearchId() {
			return uniqueId('advanced-search-');
		},
		headers() {
			return [
				{ text: 'YHSI ID', value: 'yHSIId' },
				{ text: 'Primary name', value: 'primaryName' },
				{ text: 'Community', value: 'community.name' },
				{ text: 'Category', value: 'siteCategories' },
				{ text: 'Status', value: 'status.text' },
			];
		},
		searchQuery() {
			if (!this.searchTerm) return {}

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
		this.loading = true;
		api
			.getAll()
			.then(({ data, meta }) => {
				this.items = data;
				this.totalLength = meta.itemCount;
			})
			.finally(() => {
				this.loading = false;
			});
	},
	methods: {
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
			data.query = {...this.searchQuery, ...this.advancedSearchQuery};

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
				this.advancedSearchQuery = {};
				this.doSearch()
			}
			this.isShowingAdvancedSearch = !this.isShowingAdvancedSearch;
		},
	},
};
</script>

<style scoped></style>
