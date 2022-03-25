<template>
  <div class="">
<<<<<<< HEAD
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
=======
    <!-- <v-btn color="secondary" class="float-right mb-0 mt-2 pl-2" to="/admin" exact style="height: auto; font-size: .8rem; padding: 6px 10px;"
      ><v-icon class="mr-2" small>mdi-arrow-left</v-icon> Back to Administration</v-btn
    > -->
    <v-breadcrumbs
      :items="[
        { text: 'Adminstration', to: '/admin', exact: true },
        { text: 'User Management' },
      ]"
    ></v-breadcrumbs>

    <h1>User Management</h1>

    <div class="mt-2">
      <v-card class="default px-3 py-3">
        <v-card-text>
          <v-row>
            <v-col cols="8" class="d-flex">
              <v-text-field
                prepend-inner-icon="mdi-magnify"
                background-color="white"
                outlined
                dense
                label="Search"
                v-model="search"
                hide-details
              ></v-text-field>
            </v-col>
            <v-col cols="4" class="d-flex">
              <v-select
                small-chips
                multiple
                :items="filterOptions"
                v-model="selectedFilter"
                label="Status filter"
                dense
                outlined
                background-color="white"
                hide-details
              ></v-select>
            </v-col>
            <v-spacer></v-spacer>
            <v-col cols="auto"> </v-col>
          </v-row>

          <v-data-table
            :items="filteredData"
            :headers="headers"
            :loading="loading"
            :search="search"
            @click:row="handleClick"
            :footer-props="{ 'items-per-page-options': [10, 30, 100] }"
            class="clickable-row"
          >
          </v-data-table
        ></v-card-text>
      </v-card>
    </div>
>>>>>>> 0cdf0c39d93068ce691cb9c87d8d8dd0e9875eaf
  </div>
</template>

<script>
<<<<<<< HEAD
import users from "../../../../controllers/user";
import Breadcrumbs from "../../../Breadcrumbs";
import _ from "lodash";
export default {
  name: "usersgrid",
  components: { Breadcrumbs },
=======
import { mapActions } from "vuex";
export default {
  name: "usersgrid",
>>>>>>> 0cdf0c39d93068ce691cb9c87d8d8dd0e9875eaf
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
<<<<<<< HEAD
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
=======
    selectedFilter: ["Active"],
    filterOptions: ["Active", "Expired", "Inactive"],
  }),
  async mounted() {
    //this.getDataFromApi();
    this.users = await this.loadUsers();
  },
  methods: {
    ...mapActions("users", ["loadUsers"]),

    handleClick(value) {
      //Redirects the user to the edit user form
      this.$router.push(`/admin/users/${value.UserId}`);
>>>>>>> 0cdf0c39d93068ce691cb9c87d8d8dd0e9875eaf
    },
  },
  computed: {
    filteredData() {
<<<<<<< HEAD
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
=======
      if (this.selectedFilter.length == 0) return this.users;

      let data = [];

      for (let usr of this.users) {
        if (this.selectedFilter.indexOf(usr.Status) >= 0) {
          data.push(usr);
        }
      }

      return data;
    },
  },
>>>>>>> 0cdf0c39d93068ce691cb9c87d8d8dd0e9875eaf
};
</script>

<style scoped>
.hoverclicklink:hover {
  color: #0097a9;
  text-decoration: underline;
  cursor: pointer;
}
</style>