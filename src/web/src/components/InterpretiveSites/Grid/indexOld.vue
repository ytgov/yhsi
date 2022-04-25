<template>
  <div class="">
    <h1>Interpretive Sites</h1>
    <Breadcrumbs />
    <v-row>
      <v-col cols="6" class="d-flex">
        <v-text-field
          flat
          prepend-icon="mdi-magnify"
          class="mx-4"
          hide-details
          label="Search by site name"
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
          Add Site
        </v-btn>

        <v-btn class="black--text mx-1">
            <v-icon class="mr-1"> mdi-export </v-icon>
            Export
        </v-btn>

        <v-btn class="black--text mx-1" @click="downloadPdf" :loading="loadingPdf">
            <v-icon class="mr-1"> mdi-printer </v-icon>
            Print
        </v-btn>
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
import Breadcrumbs from "../../Breadcrumbs";
import _ from "lodash";
import interpretiveSites from "../../../controllers/interpretive-sites";
export default {
  name: "boatsgrid-index",
  components: { Breadcrumbs },
  data: () => ({
    route: "",
    loading: false,
    list: [],
    search: "",
    headers: [
          { text: "SiteName",  value: "SiteName"},
          { text: "Location Description",  value: "LocationDesc"},
          { text: "RouteName",  value: "RouteName"},
          { text: "KMNum",   value: "KMNum"},
          { text: "MapSheet",  value: "MapSheet"},
          { text: "Latitude",  value:  "Latitude" },
          { text: "Longitude",  value: "Longitude"},
          { text: "EstablishedYear",  value:  "EstablishedYear"},
          { text: "AdvancedNotification",  value:  "AdvancedNotification"},
          { text: "NotificationDescription",  value:  "NotificationDesc"},

    ],
    //table options
    page: 0,
    pageCount: 6,
    totalLength: 0,
    options: { itemsPerPage: 50 },
    filterOptions: [
          { text: "Location Description", value: "", dataAccess: "LocationDesc"},
          { text: "Route Name", value: "", dataAccess: "RouteName"},
          { text: "KMNum", value: "",  dataAccess: "KMNum"},
          { text: "MapSheet", value: "", dataAccess: "MapSheet"},
          { text: "Latitude", value: "", dataAccess:  "Latitude" },
          { text: "Longitude", value: "", dataAccess: "Longitude"},
          { text: "Established Year", value: "", dataAccess:  "EstablishedYear"},
          { text: "Advanced Notification", value: "", dataAccess:  "AdvancedNotification"},
          { text: "Notification Description", value: "", dataAccess:  "NotificationDesc"},
    ],
    selectedItem: 1,
    items: [
      { text: "Real-Time", icon: "mdi-clock" },
      { text: "Audience", icon: "mdi-account" },
      { text: "Conversions", icon: "mdi-flag" },
    ],
    burialsData: [],
    loadingPdf: false
  }),
  mounted() {
    this.getDataFromApi();
  },
  methods: {
    addNew() {
      this.removeCurrentBurial();
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
      ////console.log("TEST",JSON.stringify(prefilters));
      let data = await interpretiveSites.get(
        page,
        itemsPerPage,
        sortBy[0],
        sortDesc[0] ? "desc" : "asc",
        textToMatch,//prefilters.SiteName,
        prefilters.LocationDesc,
        prefilters.RouteName,
        prefilters.KMNum,
        prefilters.MapSheet,
        prefilters.Latitude,
        prefilters.Longitude,
        prefilters.EstablishedYear,
        prefilters.AdvancedNotification,
        prefilters.NotificationDesc,
      );

     // {"BirthYear":"","BirthMonth":"","BirthDay":"","DeathYear":"","DeathMonth":"","DeathDay":"","Gender":"","Cause":"","Manner":"","Cemetary":"","OriginCountry":""}
      this.list = data.body;
      this.totalLength = data.count;
      this.list.map((x) => {
        x.crashdate = this.formatDate(x.crashdate);
      });
      this.loading = false;
    },
    removeCurrentBurial(){
      localStorage.currentInterpretiveSiteID = null;
    },
    async getExport(){
      let { sortBy, sortDesc } = this.options;
      let textToMatch = this.search;
      const prefilters = {};
      this.filterOptions.map( x => {
        prefilters[x.dataAccess] = x.value;
      })
      this.burialsData = await interpretiveSites.getExport(
        sortBy[0],
        sortDesc[0] ? "desc" : "asc",
        textToMatch,//prefilters.SiteName,
        prefilters.LocationDesc,
        prefilters.RouteName,
        prefilters.KMNum,
        prefilters.MapSheet,
        prefilters.Latitude,
        prefilters.Longitude,
        prefilters.EstablishedYear,
        prefilters.AdvancedNotification,
        prefilters.NotificationDesc,
      );
    },
    async downloadPdf(){
      this.loadingPdf = true;
      let { sortBy, sortDesc } = this.options;
      const prefilters = {};
      this.filterOptions.map( x => {
        prefilters[x.dataAccess] = x.value;
      })
      let res = await interpretiveSites.getGridPdf(
        sortBy[0],
        sortDesc[0] ? "desc" : "asc",
        this.search,//prefilters.SiteName,
        prefilters.LocationDesc,
        prefilters.RouteName,
        prefilters.KMNum,
        prefilters.MapSheet,
        prefilters.Latitude,
        prefilters.Longitude,
        prefilters.EstablishedYear,
        prefilters.AdvancedNotification,
        prefilters.NotificationDesc,
      );
      let blob = new Blob([res], { type: "application/octetstream" });
      let url = window.URL || window.webkitURL;
      let link = url.createObjectURL(blob);
      let a = document.createElement("a");
      a.setAttribute("download", "Burials.pdf");
      a.setAttribute("href", link);
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      this.loadingPdf = false;
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
      return this.list;
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