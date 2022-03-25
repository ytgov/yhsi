<template>
  <div class="">
    <v-container fluid>
      <h1>User Management</h1>
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
              <v-list-item-group
                v-model="selectedFilter"
                color="primary"
                multiple
              >
                <v-list-item v-for="(item, i) in filterOptions" :key="i" link>
                  <template v-slot:default="{ active }">
                    <v-list-item-action>
                      <v-icon v-if="!active">
                        mdi-checkbox-blank-outline
                      </v-icon>
                      <v-icon v-else> mdi-checkbox-marked-outline </v-icon>
                    </v-list-item-action>
                    <v-list-item-title>{{ item.name }}</v-list-item-title>
                  </template>
                </v-list-item>
              </v-list-item-group>
            </v-list>
          </v-menu>
        </v-col>
        <v-spacer></v-spacer>
        <v-col cols="auto"> </v-col>
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
              >
                <template v-slot:item.Status="{ item }">
                  <div v-if="item.Status == 1">Active</div>
                  <div v-else>Expired</div>
                </template>
                <template v-slot:item.actions="{ item }">
                  <v-btn color="success" outlined @click="removeItem(item)">
                    <v-icon class="mr-1">mdi-delete</v-icon>
                    Remove
                  </v-btn>
                </template>
              </v-data-table>
            </v-col>
          </v-row>
        </v-card>
      </div>
    </v-container>
  </div>
</template>

<script>
import users from "../../../../controllers/user";
import Breadcrumbs from "../../../Breadcrumbs";
import _ from "lodash";
export default {
  name: "usersgrid",
  components: { Breadcrumbs },
  data: () => ({
    loading: false,
    users: [],
    search: "",
    options: {},
    totalLength: 0,
    headers: [
      { text: "Email", value: "Email" },
      { text: "First Name", value: "FirstName" },
      { text: "Last Name", value: "LastName" },
      { text: "Status", value: "Status" },
      { text: "Last Login", value: "LastLogin" },
      //      { text: "Actions", value: "actions"}
    ],
    page: 1,
    pageCount: 0,
    iteamsPerPage: 10,
    selectedFilter: [],
    filterOptions: [
      { name: "Expired Users" },
      { name: "Active Users" },
      { name: "Pending Users" },
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
      //Redirects the user to the edit user form
      this.$router.push(`/admin/users/view/${value.UserId}`);
    },
    removeItem(item) {
      //removes one element from the users array
      const index = this.users.findIndex((a) => a.id == item.id);
      if (index > -1) {
        this.users.splice(index, 1);
      }
    },
    async getDataFromApi() {
      this.loading = true;
      let { page, itemsPerPage, sortBy, sortDesc } = this.options;
      page = page > 0 ? page - 1 : 0;
      itemsPerPage = itemsPerPage === undefined ? 10 : itemsPerPage;
      let textToMatch = this.search;
      let data = await users.get(
        page,
        itemsPerPage,
        textToMatch,
        sortBy[0],
        sortDesc[0] ? "desc" : "asc"
      );

      this.users = _.get(data, "body", []);
      this.users.map((x) => {
        x.LastLogin = this.formatDate(x.LastLogin);
      });
      this.totalLength = _.get(data, "count", 0);
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
    filteredData() {
      // returns a filtered users array depending on the selected filters
      let sorters = JSON.parse(JSON.stringify(this.selectedFilter));
      let data = JSON.parse(JSON.stringify(this.users));
      for (let i = 0; i < sorters.length; i++) {
        switch (sorters[i]) {
          case 0: // expired
            data = data.filter((x) => x.Status == 0);
            break;
          case 1: // active
            data = data.filter((x) => x.Status == 1);
            break;
          case 2: // pending
            data = data.filter((x) => x.Status == 2);
            break;
        }
      }
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