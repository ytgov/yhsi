<template>
  <div class="">
    <v-container fluid>
      <h1>People</h1>
      <Breadcrumbs />
      <v-row>
        <v-col cols="6" class="d-flex">
          <v-text-field
            flat
            prepend-icon="mdi-magnify"
            class="mx-4"
            hide-details
            label="Search"
            v-model="search"
            @keyup.enter="searchChange()"
            v-on:input="searchChange()"
          ></v-text-field>

          <v-menu
            transition="slide-y-transition"
            bottom
            :close-on-content-click="false"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                color="transparent"
                class="black--text"
                v-bind="attrs"
                v-on="on"
              >
                <v-icon>mdi-filter</v-icon>
                Filter
              </v-btn>
            </template>
            <v-list>
              <v-list-item-group color="primary">
                <v-list-item v-for="(item, i) in filterOptions" :key="i" link>
                  <!-- 

<template v-slot:default="{ active }">
                    <v-list-item-action>
                      <v-icon v-if="!active">
                        mdi-checkbox-blank-outline
                      </v-icon>
                      <v-icon v-else> mdi-checkbox-marked-outline </v-icon>
                    </v-list-item-action>
                    <v-list-item-title>{{ item.name }}</v-list-item-title>
                  </template>
                  -->

                  <v-text-field
                    :name="item.name"
                    :label="item.name"
                    v-model="item.value"
                  ></v-text-field>
                  
                </v-list-item>
              </v-list-item-group>
            </v-list>
          </v-menu>
        </v-col>
        <v-spacer></v-spacer>
        <v-col cols="auto">
          <v-btn class="black--text mx-1" @click="addNewPerson">
            <v-icon class="mr-1">mdi-plus-circle-outline</v-icon>
            Add Person
          </v-btn>
        </v-col>
        <v-col cols="auto"> 
          <JsonCSV :data="people">
          <v-btn class="black--text mx-1" :disabled="people.length == 0">
            <v-icon class="mr-1"> mdi-export </v-icon>
            Export
          </v-btn>
        </JsonCSV>
        </v-col>
        <v-col cols="auto"> 
          <PrintButton
          key="prt-person"
          :data="{ people }"
          :disabled="people.length == 0"
        />
        </v-col>
      </v-row>
      <div class="mt-2">
        <v-card class="px-3 py-3">
          <v-row>
            <v-col cols="12">
              <h2>{{ filteredData.length }} Results</h2>
              <!-- value doesnt get modified by the search filter, this is due to the automated search that the vuetify datatable provides -->
            </v-col>
          </v-row>
          <v-divider inset class="mb-4"></v-divider>
          <v-row>
            <v-col>
              <v-data-table
                :items="filteredData"
                :headers="headers"
                :loading="loading"
                :search="search"
                :options.sync="options"
                :server-items-length="totalLength"
                @click:row="handleClick"
                :footer-props="{ 'items-per-page-options': [10, 30, 100] }"
              ></v-data-table>
            </v-col>
          </v-row>
        </v-card>
      </div>
    </v-container>
  </div>
</template>

<script>
import people from "../../../controllers/people";
import Breadcrumbs from "../../Breadcrumbs";
import JsonCSV from "vue-json-csv";
import PrintButton from "./PrintButton";
import _ from "lodash";
export default {
  name: "usersgrid",
  components: { Breadcrumbs, JsonCSV, PrintButton },
  data: () => ({
    loading: false,
    people: [],
    search: "",
    options: {},
    totalLength: 0,
    headers: [
      { text: "Given Name", value: "GivenName" },
      { text: "Surname", value: "Surname" },
      { text: "Birth Year", value: "BirthYear" },
      { text: "Death Year", value: "DeathYear" },
    ],
    page: 1,
    pageCount: 0,
    iteamsPerPage: 10,
    selectedFilter: [],
    filterOptions: [
      { name: "Name", value: "" },
      { name: "Birth Year", value: "" },
      { name: "Death Year", value: "" },
    ],
  }),
  mounted() {
    this.getDataFromApi();
  },
  methods: {
    searchChange: _.debounce(function () {
      this.getDataFromApi();
    }, 400),
    handleClick(value) { 
      this.$router.push({
        name: "personView",
        params: { name: `${value.GivenName}-${value.Surname}`, id: value.PersonID },
      });
    },
    removeItem(item) {
      //removes one element from the users array
      const index = this.people.findIndex((a) => a.id == item.id);
      console.log(index);
      if (index > -1) {
        this.people.splice(index, 1);
      }
    },
    async getDataFromApi() {
      this.loading = true;
      let { page, itemsPerPage, sortBy, sortDesc } = this.options;
      page = page > 0 ? page - 1 : 0;
      itemsPerPage = itemsPerPage === undefined ? 10 : itemsPerPage;
      let textToMatch = this.search;
      let data = await people.get(
        page,
        itemsPerPage,
        textToMatch,
        sortBy[0],
        sortDesc[0] ? "desc" : "asc"
      );

      this.people = _.get(data, "body", []);
      console.log(data);
      this.totalLength = _.get(data, "count", 0);
      this.loading = false;
    },
    addNewPerson(){
      this.$router.push({
        name: "personAddView"
      });
    }
  },
  computed: {
    filteredData() {
      // returns a filtered users array depending on the selected filters
      let data = [...this.people];

      data = this.filterOptions[0].value != "" ?  data.filter((x) => `${x.GivenName} ${x.Surname}`.toLowerCase().includes(this.filterOptions[0].value)) : data;
      data = this.filterOptions[1].value != "" ? data.filter((x) => x.BirthYear == this.filterOptions[1].value) : data;
      data = this.filterOptions[2].value != "" ? data.filter((x) =>  x.DeathYear == this.filterOptions[2].value) : data;

      return data;
    },
  },
  watch: {
    options: {
      handler() {
        this.getDataFromApi();
      },
      deep: true,
    },
    search() {
      this.getDataFromApi();
    },
  },
};
</script>

<style scoped>
.hoverclicklink:hover {
  color: #0097a9;
  text-decoration: underline;
  cursor: pointer;
}
</style>