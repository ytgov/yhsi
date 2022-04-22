<template>
  <div class="">
    <h1>Interpretive Sites</h1>
    <Breadcrumbs />
    <v-row>
      <v-col cols="6" class="d-flex">
        <v-text-field
          v-if="$route.path.includes('action')"
          flat
          prepend-icon="mdi-magnify"
          class="mx-4"
          hide-details
          label="Search"
          v-model="searchAction"
          @keyup.enter="actionSearchChange()"
          v-on:input="actionSearchChange()"
        ></v-text-field>

        <v-text-field
          v-else-if="$route.path.includes('asset')"
          flat
          prepend-icon="mdi-magnify"
          class="mx-4"
          hide-details
          label="Search"
          v-model="searchAsset"
          @keyup.enter="assetSearchChange()"
          v-on:input="assetSearchChange()"
        ></v-text-field>

        <v-text-field
          v-else
          flat
          prepend-icon="mdi-magnify"
          class="mx-4"
          hide-details
          label="Search by site name"
          v-model="searchSite"
          @keyup.enter="siteSearchChange()"
          v-on:input="siteSearchChange()"
        ></v-text-field>

        <v-menu
          transition="slide-y-transition"
          bottom
          :close-on-content-click="false"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              v-if="$route.path.includes('action')"
              color="transparent"
              class="black--text"
              v-bind="attrs"
              v-on="on"
              disabled
            >
              <v-icon class="black--text mr-1">mdi-filter</v-icon>
              Filter

              <v-icon class="black--text">mdi-chevron-right</v-icon>
            </v-btn>
            <v-btn
              v-else
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
            <v-list-item v-for="(item, i) in actionFilterOptions" :key="`action-filter-list-opt-${i}`" link>
              <v-text-field
                clearable
                @blur="filterChange"
                v-model="item.value"
                :label="item.name"
              ></v-text-field>
            </v-list-item>
          </v-list>
        </v-menu>
      </v-col>
      <v-spacer></v-spacer>
      <v-col cols="auto" v-if="$route.path.includes('action')" class="d-flex">
        <v-btn class="black--text mx-1" @click="addNewAction">
          <v-icon class="mr-1">mdi-plus-circle-outline</v-icon>
          Add Owner
        </v-btn>


        
        <v-btn class="black--text mx-1" @click="getActionsExport()" :loading="loadingExport">
            <v-icon class="mr-1"> mdi-export </v-icon>
            Export
        </v-btn>

        <v-btn @click="downloadActionsPdf()" class="black--text mx-1" :loading="loadingPdf">
            <v-icon class="mr-1">
              mdi-printer
            </v-icon>
            Print
        </v-btn>

      </v-col>
      <v-col cols="auto" v-else-if="$route.path.includes('asset')" class="d-flex">
        <v-btn class="black--text mx-1" @click="addNewAsset">
          <v-icon class="mr-1">mdi-plus-circle-outline</v-icon>
          Add Site
        </v-btn>

        <v-btn class="black--text mx-1" @click="getAssetsExport()" :loading="loadingExport">
          <v-icon class="mr-1"> mdi-export </v-icon>
          Export
        </v-btn>

        <v-btn @click="downloadAssetsPdf()" class="black--text mx-1" :loading="loadingPdf">
            <v-icon class="mr-1">
              mdi-printer
            </v-icon>
            Print
        </v-btn>

      </v-col>
      <v-col cols="auto" v-else class="d-flex">
        <v-btn class="black--text mx-1" @click="addNewSite">
          <v-icon class="mr-1">mdi-plus-circle-outline</v-icon>
          Add Site
        </v-btn>

        <v-btn class="black--text mx-1" @click="getSiteExport()" :loading="loadingExport">
          <v-icon class="mr-1"> mdi-export </v-icon>
          Export
        </v-btn>

        <v-btn @click="downloadSitesPdf()" class="black--text mx-1" :loading="loadingPdf">
            <v-icon class="mr-1">
              mdi-printer
            </v-icon>
            Print
        </v-btn>

      </v-col>
    </v-row>
    <div class="mt-2">
      <v-card>
        <v-tabs v-model="active_tab">
          <v-tab
            key="1"
            :to="{ path: '/interpretive-sites/' }"
            :class="`${isActive($route.path)}`"
          >
            <v-icon class="mr-1">mdi-ferry</v-icon>
            Sites
          </v-tab>
          <v-tab key="2" :to="{ path: '/interpretive-sites/actions' }">
            <v-icon class="mr-1">mdi-account-tie</v-icon>
            Actions
          </v-tab>
          <v-tab key="3" :to="{ path: '/interpretive-sites/assets' }">
            <v-icon class="mr-1">mdi-account-tie</v-icon>
            Assets
          </v-tab>
        </v-tabs>
        <v-divider class="mb-4"></v-divider>
        <router-view id="rv-int-sitesW" />
      </v-card>
    </div>
  </div>
</template>

<script>
import Breadcrumbs from "../../Breadcrumbs";
import downloadCsv from "../../../utils/dataToCsv";
import downloadPdf from "../../../utils/dataToPdf";
import _ from "lodash";
import interpretiveSites from "../../../controllers/interpretive-sites";
//import jsPDF from "jspdf";
export default {
  name: "int-sites-grid-index",
  components: { Breadcrumbs },
  data: () => ({
    route: "",
    active_tab: "",
    searchSite: "",
    searchAction: "",
    searchAsset: "",
    siteFilterOptions: [
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
    actionFilterOptions: [
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
    assetFilterOptions: [
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
    loadingPdf: false,
    loadingExport: false,
  }),
  async mounted() {
    if (this.$route.path.includes("actions")) {
      this.route = "actions";
    } else if(this.$route.path.includes("assets")){
      this.route = "assets";
    } else {
      this.route = "sites"
    }

  },
  methods: {
    addNewSite() {
      this.$router.push(`/interpretive-sites/new`);
    },
    addNewAction() {
      this.$router.push(`/interpretive-sites/action/new`);
    },
    addNewAsset(){
      this.$router.push(`/interpretive-sites/asset/new`);
    },
    siteSearchChange: _.debounce(function () {
      this.$store.commit("boats/setOwnerSearch", this.searchOwner);
      //this.getOwnerExport();
    }, 400),
    actionSearchChange: _.debounce(function () {
      this.$store.commit("boats/setBoatSearch", this.searchBoat);
      //this.getBoatExport();
    }, 400),
    filterChange() {
      this.$store.commit("boats/setSelectedFilters", this.filterOptions);
      //this.getBoatExport();
    },
    isActive(route) {
      //this function helps to show certain classes depending on the route
      return route.includes("owner") ? "notActive" : "";
    },
    async getSitesExport(){
      let { sortBy, sortDesc } = this.options;
      let textToMatch = this.search;
      const prefilters = {};
      this.siteFilterOptions.map( x => {
        prefilters[x.dataAccess] = x.value;
      })
      let data = await interpretiveSites.getExport(
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
      downloadCsv(data, "sites");
    },
    async downloadSitesPdf(){
      this.loadingPdf = true;
      let { sortBy, sortDesc } = this.options;
      const prefilters = {};
      this.siteFilterOptions.map( x => {
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
      downloadPdf(res, "sites");
      this.loadingPdf = false;
    },
    async getActionsExport(){
      let { sortBy, sortDesc } = this.options;
      let textToMatch = this.search;
      const prefilters = {};
      this.siteFilterOptions.map( x => {
        prefilters[x.dataAccess] = x.value;
      })
      let data = await interpretiveSites.getExport(
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
      downloadCsv(data, "actions");
    },
    async downloadActionsPdf(){
      this.loadingPdf = true;
      let { sortBy, sortDesc } = this.options;
      const prefilters = {};
      this.siteFilterOptions.map( x => {
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
      downloadPdf(res, "actions");
      this.loadingPdf = false;
    },
    async getAssetsExport(){
      let { sortBy, sortDesc } = this.options;
      let textToMatch = this.search;
      const prefilters = {};
      this.siteFilterOptions.map( x => {
        prefilters[x.dataAccess] = x.value;
      })
      let data = await interpretiveSites.getExport(
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
      downloadCsv(data, "assets");
    },
    async downloadAssetsPdf(){
      this.loadingPdf = true;
      let { sortBy, sortDesc } = this.options;
      const prefilters = {};
      this.siteFilterOptions.map( x => {
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
      downloadPdf(res, "assets");
      this.loadingPdf = false;
    },
  },
  computed: {
    siteTableOptions(){
      return this.$store.getters["boats/boatTableOptions"];
    },
    actionTableOptions(){
      return this.$store.getters["boats/ownerTableOptions"];
    },
    assetTableOptions(){
      return this.$store.getters["boats/ownerTableOptions"];
    },
  },
  watch: {

  }
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