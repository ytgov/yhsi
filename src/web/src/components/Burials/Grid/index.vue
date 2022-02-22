<template>
  <div class="">
    <h1>Burials</h1>
    <Breadcrumbs />
    <v-row>
      <v-col cols="6" class="d-flex">
        <v-text-field
          flat
          prepend-icon="mdi-magnify"
          class="mx-4"
          hide-details
          label="Search by name"
          v-model="search"
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
              <v-icon class="black--text mr-1">mdi-filter</v-icon>
              Filter

              <v-icon class="black--text">mdi-chevron-right</v-icon>
            </v-btn>
          </template>
          <v-list>
            <v-list-item v-for="(item, i) in filterOptions" :key="i" link>
              <v-text-field
                clearable
                v-model="item.value"
                :label="item.text"
                @change="searchChange()"
              ></v-text-field>
            </v-list-item>
          </v-list>
        </v-menu>
      </v-col>
      <v-spacer></v-spacer>
      <v-col cols="auto" class="d-flex">
        <v-btn class="black--text mx-1" @click="addNew">
          <v-icon class="mr-1">mdi-plus-circle-outline</v-icon>
          Add Burial
        </v-btn>

        <JsonCSV :data="burials">
          <v-btn class="black--text mx-1" :disabled="burials.length == 0">
            <v-icon class="mr-1"> mdi-export </v-icon>
            Export
          </v-btn>
        </JsonCSV>

        <PrintButton
          key="prt-2"
          :data="{ burials }"
          :disabled="burials.length == 0"
        />
      </v-col>
    </v-row>
    <div class="mt-2">
      <v-card>
        <v-container fluid>
          <v-row>
            <v-col cols="12">
              <h2 v-if="burials" class="ma-2">
                {{ filteredData.length }} results out of {{ totalLength }}
              </h2>
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
                :footer-props="{ 'items-per-page-options': [10, 30, 50, 100] }"
              >
              </v-data-table>
            </v-col>
          </v-row>
        </v-container>
      </v-card>
    </div>
  </div>
</template>

<script>
import JsonCSV from "vue-json-csv";
import Breadcrumbs from "../../Breadcrumbs";
import PrintButton from "./PrintButton";
import _ from "lodash";
import burials from "../../../controllers/burials";
export default {
  name: "boatsgrid-index",
  components: { Breadcrumbs, JsonCSV, PrintButton },
  data: () => ({
    route: "",
    loading: false,
    burials: [],
    search: "",
    headers: [
      { text: "LastName", value: "LastName" },
      { text: "FirstName", value: "FirstName" },
      { text: "Gender", value: "Gender" },
      { text: "BirthYear", value: "BirthYear" },
      { text: "DeathYear", value: "DeathYear" },
      { text: "Manner", value: "Manner" },
      { text: "Cause", value: "Cause" },
      { text: "Cementary", value: "Cemetary" },
      { text: "OtherCemetaryDesc", value: "OtherCemetaryDesc" },
      { text: "OriginCity", value: "OriginCity" },
      { text: "OriginState", value: "OriginState" },
      { text: "OriginCountry", value: "OriginCountry" },
      { text: "OtherCountry", value: "OtherCountry" },

    ],
    //table options
    page: 0,
    pageCount: 6,
    totalLength: 0,
    options: { itemsPerPage: 50 },
    // filter by names, birth and death dates, gender, cause and manner of death, cemetery, other location, country of origin
    filterOptions: [
          { text: "Birth Year", value: "", dataAccess: "BirthYear"},
          { text: "Birth Month", value: "", dataAccess: "BirthMonth"},
          { text: "Birth Day", value: "", dataAccess: "BirthDay"},
          { text: "Death Year", value: "",  dataAccess: "DeathYear"},
          { text: "Death Month", value: "", dataAccess: "DeathMonth"},
          { text: "Death Day", value: "", dataAccess:  "DeathDay" },
          { text: "Gender", value: "", dataAccess: "Gender"},
          { text: "Cause", value: "", dataAccess:  "Cause"},
          { text: "Manner", value: "", dataAccess:  "Manner"},
          { text: "Cemetary", value: "", dataAccess:  "Cemetary"},
          { text: "Origin Country", value: "", dataAccess:  "OriginCountry"},
    ],
    selectedItem: 1,
    items: [
      { text: "Real-Time", icon: "mdi-clock" },
      { text: "Audience", icon: "mdi-account" },
      { text: "Conversions", icon: "mdi-flag" },
    ],
  }),
  mounted() {
    this.getDataFromApi();
  },
  methods: {
    addNew() {
      this.$router.push(`/burials/new`);
    },
    searchChange: _.debounce(function () {
      this.getDataFromApi();
    }, 400),
    handleClick(value) {
      //Redirects the user to the airplane form component
      this.$router.push({
        name: "BurialsViewForm",
        params: { name: value.BurialID, id: value.BurialID },
      });
    },
    async getDataFromApi() {
      this.loading = true;
      let { page, itemsPerPage, sortBy, sortDesc } = this.options;
      page = page > 0 ? page - 1 : 0;
      itemsPerPage = itemsPerPage === undefined ? 10 : itemsPerPage;
      let textToMatch = this.search;
      const prefilters = {};
      this.filterOptions.map( x => {
        prefilters[x.dataAccess] = x.value;
      })
      //console.log("TEST",JSON.stringify(prefilters));
      let data = await burials.get(
        page,
        itemsPerPage,
        textToMatch,
        sortBy[0],
        sortDesc[0] ? "desc" : "asc",
        prefilters.BirthYear,
        prefilters.BirthMonth,
        prefilters.BirthDay,
        prefilters.DeathYear,
        prefilters.DeathMonth,
        prefilters.DeathDay,
        prefilters.Gender,
        prefilters.Cause,
        prefilters.Manner,
        prefilters.Cemetary,
        prefilters.OriginCountry
      );

     // {"BirthYear":"","BirthMonth":"","BirthDay":"","DeathYear":"","DeathMonth":"","DeathDay":"","Gender":"","Cause":"","Manner":"","Cemetary":"","OriginCountry":""}
      this.burials = data.body;
      this.totalLength = data.count;
      this.burials.map((x) => {
        x.crashdate = this.formatDate(x.crashdate);
      });
      this.loading = false;
    },
    formatDate(date) {
      if (!date) return null;
      date = date.substr(0, 10);
      const [year, month, day] = date.split("-");
      return `${month}/${day}/${year}`;
    },

  },
  computed: {
    filteredData(){
      return this.burials;
    }
  },
  watch: {
    /* eslint-disable */
    options: {
      handler() {
        this.getDataFromApi();
      },
      deep: true,
    },
  },
};
</script>

<style scoped>
#horizontal-list {
  display: flex;
}
.notActive {
  color: rgba(0, 0, 0, 0.54) !important;
}
</style>