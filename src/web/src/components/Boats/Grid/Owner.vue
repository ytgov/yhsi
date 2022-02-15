<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12">
        <h2>{{ filteredData.length }} results out of {{ totalLength }}</h2>
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
          :footer-props="{ 'items-per-page-options': [10, 30, 50, 100] }"
        >
        </v-data-table>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import owners from "../../../controllers/owners";
export default {
  name: "boatsGrid",
  data: () => ({
    loading: false,
    owners: [],
    headers: [{ text: "Owner", value: "OwnerName" }],
    filterOptions: [
      { name: "Boat Name" },
      { name: "Owner" },
      { name: "Construction Date" },
      { name: "Owner" },
      { name: "Service Start" },
      { name: "Service End" },
      { name: "Vessel Type" },
    ],
    //table options
    page: 0,
    pageCount: 6,
    options: { itemsPerPage: 50},
    totalLength: 100,
  }),
  mounted() {
    this.getDataFromApi();
  },
  methods: {
    handleClick(value) {
      //Redirects the user to the edit user form
      this.$router.push({
        name: "ownerView",
        params: { name: value.OwnerName, id: value.id },
      });
    },
    async getDataFromApi() {
      this.loading = true;
      let { page, itemsPerPage, sortBy, sortDesc } = this.options;
      page = page > 0 ? page - 1 : 0;
      itemsPerPage = itemsPerPage === undefined ? 10 : itemsPerPage;
      let textToMatch = this.search;
      let data = await owners.get(
        page,
        itemsPerPage,
        textToMatch,
        sortBy[0],
        sortDesc[0] ? "desc" : "asc"
      );
      this.owners = data.body;
      this.totalLength = data.count;
      this.$store.commit("boats/setOwners", this.owners);
      this.loading = false;
    },
  },
  computed: {
    search() {
      return this.$store.getters["boats/ownerSearch"];
    },
    filteredData() {
      // returns a filtered users array depending on the selected filters
      return this.owners;
    },
  },
  watch: {
    options: {
      handler() {
        this.getDataFromApi();
      },
      deep: true,
    },
    /* eslint-disable */
    selectedFilters(newv, oldv) {
      //console.log(oldv,newv);
    },
    search(newv, oldv) {
      //this.search = newv;
      this.getDataFromApi();
    } /* eslint-enable */,
  },
};
</script>