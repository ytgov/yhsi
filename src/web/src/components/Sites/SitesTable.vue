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
        <v-col cols="12">
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
import { cloneDeep } from 'lodash';

import api from '@/apis/places-api';

export default {
  name: 'SitesTable',
  data: () => ({
    loading: false,
    items: [],
    searchTerm: '',
    options: {},
    totalLength: 0,
    page: 1,
    pageCount: 0,
    iteamsPerPage: 10,
  }),
  computed: {
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
  },
};
</script>
