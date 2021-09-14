<template>
  <div class="">
        <v-app-bar
          color="primary"
          dark
          flat    
        >
          <v-btn color="primary" @click="goToSummary()">
            <v-icon>mdi-account-group</v-icon>
            <div class="ml-2">
              <v-toolbar-title> Users </v-toolbar-title>
            </div>
          </v-btn>
          <v-spacer></v-spacer>
          <div>
            <v-text-field
            dense
            filled
            solo-inverted
            flat
            append-icon="mdi-magnify"
            class="mx-4"
            hide-details
            label="Search"
            v-model="search"
          ></v-text-field>
          </div>
        </v-app-bar>
    <v-container fluid>
      <v-row>
        <v-col cols="12">
          <h2>{{items.length}} Results</h2><!-- value doesnt get modified by the search filter, this is due to the automated search that the vuetify datatable provides -->
        </v-col>
      </v-row>
      <v-divider inset class="mb-2"></v-divider>
      <v-row>
        <v-col>
          <v-data-table
            :items="items"
            :headers="headers"
            :options.sync="options"
            :loading="loading"  
            :search="search"
            @click:row="handleClick"
          ></v-data-table>
        </v-col>
      </v-row>

    </v-container>

   
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
  mounted() {
    this.getDataFromApi();
  },
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
          //console.log(resp.data);
          this.items = resp.data.data;
          //this.pagination.totalLength = resp.data.meta.count;
          this.totalLength = resp.data.meta.count || resp.data.meta.count.item_count;

          //console.log(this.totalLength);

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
