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
            <v-list-item v-for="(item, i) in filterOptions" :key="i" link>
              <v-text-field
                clearable
                @input="filterChange"
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

        <JsonCSV :data="owners"  name="owner_data.csv">
          <v-btn class="black--text mx-1" :disabled="owners.length == 0">
            <v-icon class="mr-1"> mdi-export </v-icon>
            Export
          </v-btn>
        </JsonCSV>

        <PrintButton
          key="prt-1"
          :data="{ owners }"
          :disabled="owners.length == 0"
        />
      </v-col>
      <v-col cols="auto" v-else class="d-flex">
        <v-btn class="black--text mx-1" @click="addNewBoat">
          <v-icon class="mr-1">mdi-plus-circle-outline</v-icon>
          Add Boat
        </v-btn>

        <JsonCSV :data="boats"  name="boat_data.csv">
          <v-btn class="black--text mx-1" :disabled="boats.length == 0">
            <v-icon class="mr-1"> mdi-export </v-icon>
            Export
          </v-btn>
        </JsonCSV>

        <PrintButton
          key="prt-2"
          :data="{ boats }"
          :disabled="boats.length == 0"
        />
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
import PrintButton from "./PrintButton";
import _ from "lodash";

export default {
  name: "boatsgrid-index",
  components: { Breadcrumbs, JsonCSV, PrintButton },
  data: () => ({
    route: "",
    active_tab: "",
    searchOwner: "",
    searchBoat: "",
    filterOptions: [
      { name: "Owner", value: "" },
      { name: "Construction Date", value: "" },
      { name: "Service Start", value: "" },
      { name: "Service End", value: "" },
      { name: "Vessel Type", value: "" },
    ],
    selectedItem: 1,
    items: [
      { text: "Real-Time", icon: "mdi-clock" },
      { text: "Audience", icon: "mdi-account" },
      { text: "Conversions", icon: "mdi-flag" },
    ],
  }),
  mounted() {
    if (this.$route.path.includes("owner")) {
      //shows the buttons for owner
      this.route = "owner";
    } else {
      //shows the buttons for boats
      this.route = "boats";
    }
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
    }, 400),
    boatSearchChange: _.debounce(function () {
      this.$store.commit("boats/setBoatSearch", this.searchBoat);
    }, 400),
    filterChange() {
      this.$store.commit("boats/setSelectedFilters", this.filterOptions);
    },
    isActive(route) {
      //this function helps to show certain classes depending on the route
      return route.includes("owner") ? "notActive" : "";
    },
  },
  computed: {
    boats() {
      return this.$store.getters["boats/boats"];
    },
    owners() {
      return this.$store.getters["boats/owners"];
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