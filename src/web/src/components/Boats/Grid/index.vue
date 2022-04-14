<template>
  <div class="">
    <h1>Boats</h1>
    <Breadcrumbs />
    <v-row>
      <v-col cols="6" class="d-flex">
        <v-text-field
          v-if="$route.path.includes('owner')"
          flat
          prepend-icon="mdi-magnify"
          class="mx-4"
          hide-details
          label="Search"
          v-model="searchOwner"
          @keyup.enter="ownerSearchChange()"
          v-on:input="ownerSearchChange()"
        ></v-text-field>

        <v-text-field
          v-else
          flat
          prepend-icon="mdi-magnify"
          class="mx-4"
          hide-details
          label="Search"
          v-model="searchBoat"
          @keyup.enter="boatSearchChange()"
          v-on:input="boatSearchChange()"
        ></v-text-field>

        <v-menu
          transition="slide-y-transition"
          bottom
          :close-on-content-click="false"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              v-if="$route.path.includes('owner')"
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
            <v-list-item v-for="(item, i) in filterOptions" :key="`filter-list-opt-${i}`" link>
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
      <v-col cols="auto" v-if="$route.path.includes('owner')" class="d-flex">
        <v-btn class="black--text mx-1" @click="addNewOwner">
          <v-icon class="mr-1">mdi-plus-circle-outline</v-icon>
          Add Owner
        </v-btn>


        
        <v-btn class="black--text mx-1" @click="getOwnerExport()" :loading="loadingExport">
            <v-icon class="mr-1"> mdi-export </v-icon>
            Export
        </v-btn>

        <v-btn @click="downloadPdfOwners()" class="black--text mx-1" :loading="loadingPdf">
            <v-icon class="mr-1">
              mdi-printer
            </v-icon>
            Print
        </v-btn>

      </v-col>
      <v-col cols="auto" v-else class="d-flex">
        <v-btn class="black--text mx-1" @click="addNewBoat">
          <v-icon class="mr-1">mdi-plus-circle-outline</v-icon>
          Add Boat
        </v-btn>

        <v-btn class="black--text mx-1" @click="getBoatExport()" :loading="loadingExport">
          <v-icon class="mr-1"> mdi-export </v-icon>
          Export
        </v-btn>

        <v-btn @click="downloadPdf()" class="black--text mx-1" :loading="loadingPdf">
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
            :to="{ path: '/boats/' }"
            :class="`${isActive($route.path)}`"
          >
            <v-icon class="mr-1">mdi-ferry</v-icon>
            Boats
          </v-tab>
          <v-tab key="2" :to="{ path: '/boats/owner' }">
            <v-icon class="mr-1">mdi-account-tie</v-icon>
            Owner
          </v-tab>
        </v-tabs>
        <v-divider class="mb-4"></v-divider>
        <router-view id="rv-boats" />
      </v-card>
    </div>
  </div>
</template>

<script>
import JsonCSV from "vue-json-csv";
import Breadcrumbs from "../../Breadcrumbs";
import downloadCsv from "../../../utils/dataToCsv";
import _ from "lodash";
import boats from "../../../controllers/boats";
import owners from "../../../controllers/owners";
//import jsPDF from "jspdf";
export default {
  name: "boatsgrid-index",
  components: { Breadcrumbs, JsonCSV },
  data: () => ({
    route: "",
    active_tab: "",
    searchOwner: "",
    searchBoat: "",
    filterOptions: [
      { name: "Owner", value: "", dataAccess: "Owner"},
      { name: "Construction Date", value: "", dataAccess: "ConstructionDate" },
      { name: "Service Start", value: "", dataAccess: "ServiceStart" },
      { name: "Service End", value: "", dataAccess: "ServiceEnd" },
      { name: "Vessel Type", value: "", dataAccess: "VesselType" },
    ],
    selectedItem: 1,
    items: [
      { text: "Real-Time", icon: "mdi-clock" },
      { text: "Audience", icon: "mdi-account" },
      { text: "Conversions", icon: "mdi-flag" },
    ],
    boatsData: [],
    ownersData: [],
    loadingPdf: false,
    loadingExport: false,
    boatHeaders: [
      { text: "Name", dataAccess: "Name" },
      { text: "Owner", dataAccess: "owners", sortable: false },
      { text: "Vessel Type", dataAccess: "VesselType" },
      { text: "Construction Date", dataAccess: "ConstructionDate" },
      { text: "Service Start Date", dataAccess: "ServiceStart" },
      { text: "Service End Date", dataAccess: "ServiceEnd" },
      { text: "Current Location Description", dataAccess: "CurrentLocation" },
      { text: "Req Number", dataAccess: "RegistrationNumber" },
    ],
  }),
  async mounted() {
    if (this.$route.path.includes("owner")) {
      //shows the buttons for owner
      this.route = "owner";
    } else {
      //shows the buttons for boats
      this.route = "boats";
    }
    // await this.getBoatExport();
    // await this.getOwnerExport();

  },
  methods: {
    addNewBoat() {
      this.$router.push(`/boats/new`);
    },
    addNewOwner() {
      this.$router.push(`/boats/owner/new`);
    },
    ownerSearchChange: _.debounce(function () {
      this.$store.commit("boats/setOwnerSearch", this.searchOwner);
      //this.getOwnerExport();
    }, 400),
    boatSearchChange: _.debounce(function () {
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
    async getOwnerExport(){
      this.loadingExport = true;
      let o = this.ownerTableOptions;
      let data = await owners.getExport(this.searchOwner, o.sortBy[0] ? o.sortBy[0] : "OwnerName", o.sortDesc[0] ? "desc" : "asc");
      downloadCsv(data, "owners");
      this.loadingExport = false;
    },
    async getBoatExport(){
      this.loadingExport = true;
      let textToMatch = this.searchBoat;
      const prefilters = {};
      let b = this.boatTableOptions;
      this.filterOptions.map( x => {
        prefilters[x.dataAccess] = x.value;
      })
      let data = await boats.getExport(
        textToMatch,
        b.sortBy[0] ? b.sortBy[0] : "Name",
        b.sortDesc[0] ? "desc" : "asc",
        prefilters.Owner,
        prefilters.ConstructionDate, 
        prefilters.ServiceStart, 
        prefilters.ServiceEnd,
        prefilters.VesselType
      );

      downloadCsv(data, "boats");
      
      //this.boatsData = await boats.getExport(this.searchBoat, b.sortBy[0] ? b.sortBy[0] : "Name", b.sortDesc[0] ? "desc" : "asc");
      this.loadingExport = false;
    },
    async downloadPdf(){
      this.loadingPdf = true;
      let b = this.boatTableOptions;
      
      let res = await boats.getGridPdf(this.searchBoat, b.sortBy[0] ? b.sortBy[0] : "Name", b.sortDesc[0] ? "desc" : "asc");
      let blob = new Blob([res], { type: "application/octetstream" });
      let url = window.URL || window.webkitURL;
      let link = url.createObjectURL(blob);
      let a = document.createElement("a");
      a.setAttribute("download", "Boats.pdf");
      a.setAttribute("href", link);
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      this.loadingPdf = false;
    },
    async downloadPdfOwners(){
      this.loadingPdf = true;
      let o = this.ownerTableOptions;
      let res = await owners.getGridPdf(this.searchOwner, o.sortBy[0] ? o.sortBy[0] : "OwnerName", o.sortDesc[0] ? "desc" : "asc");
      let blob = new Blob([res], { type: "application/octetstream" });
      let url = window.URL || window.webkitURL;
      let link = url.createObjectURL(blob);
      let a = document.createElement("a");
      a.setAttribute("download", "Owners.pdf");
      a.setAttribute("href", link);
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      this.loadingPdf = false;
    },
  },
  computed: {
    boatTableOptions(){
      return this.$store.getters["boats/boatTableOptions"];
    },
    ownerTableOptions(){
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