<template>
  <div class="books">
    <h1>Sites</h1>

    <v-text-field
      v-model="search"
      label="Search"
      dense
      outlined
      append-icon="mdi-magnify"
      @click:append="doSearch"
      hint="Enter criteria and press enter"
      @keyup="keyUp"
    ></v-text-field>

    <v-data-table
      dense
      :items="items"
      :headers="headers"
      :options.sync="options"
      :loading="loading"
      :server-items-length="totalLength"
      @click:row="handleClick"
    ></v-data-table>
  </div>
</template>

<script>
import axios from "axios";
import store from "../../../store";
import { PLACE_URL } from "../../../urls";
import _ from "lodash";

export default {
  name: "Grid",
  data: () => ({
    loading: false,
    items: [],
    search: "",
    options: {},
    totalLength: 0,
    headers: [
      { text: "YHSI ID", value: "yHSIId" },
      { text: "Primary name", value: "primaryName" },
      { text: "Community", value: "community.name" },
      { text: "Category", value: "category.text" },
      { text: "Status", value: "status.text" },
    ],
    page: 1,
    pageCount: 0,
    iteamsPerPage: 10,
  }),
  created() {
    this.search = store.getters.search;
  },
  watch: {
    options: {
      handler() {
        this.doSearch();
      },
      deep: true,
    },
    search: function (val) {
      store.dispatch("setSearch", val);
    },
    /*  search: {
      handler() {
        this.getDataFromApi();
      },
      deep: true,
    }, */
  },
  methods: {
    handleClick(value) {
      //Redirects the user to the site form
      store.dispatch("addSiteHistory", value);
      this.$router.push(`/sites/${value.id}/summary`);
    },

    keyUp(event) {
      if (event.key == "Enter") this.doSearch();
    },

    doSearch() {
      this.getDataFromApi();
    },

    getDataFromApi() {
      this.loading = true;

      let body = _.clone(this.options);
      body.query = [
        { field: "primaryName", operator: "contains", value: this.search },
        { field: "yhsiid", operator: "contains", value: this.search },
      ];

      axios
        .post(`${PLACE_URL}/search`, body)
        .then((resp) => {
          this.items = resp.data.data;
          this.totalLength = resp.data.meta.item_count;
          this.loading = false;
        })
        .catch((err) => console.error(err))
        .finally(() => {
          this.loading = false;
        });
    },
  },
};
</script>
