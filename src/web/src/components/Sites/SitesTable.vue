<template>
  <div class="">
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
      <v-row
        v-show="isShowingAdvancedSearch"
        :id="advancedSearchId"
        class="mt-0"
      >
        <v-col cols="6">
          <CommunitiesFilter />
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12">
          <h2>{{ items.length }} Results</h2>
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
  </div>
</template>

<script>
import { cloneDeep, uniqueId } from 'lodash';

import api from '@/apis/places-api';

import CommunitiesFilter from '@/components/Sites/sites-table/CommunitiesFilter';

export default {
  name: 'SitesTable',
  components: { CommunitiesFilter },
  data: () => ({
    iteamsPerPage: 10,
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
        { text: 'Category', value: 'category.text' },
        { text: 'Status', value: 'status.text' },
      ];
    },
    searchQuery() {
      return [
        { field: 'primaryName', operator: 'contains', value: this.searchTerm },
        { field: 'yhsiid', operator: 'contains', value: this.searchTerm },
      ];
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
    doSearch() {
      const data = cloneDeep(this.options);
      data.query = this.searchQuery;

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
      this.isShowingAdvancedSearch = !this.isShowingAdvancedSearch;
    },
  },
};
</script>

<style scoped></style>
