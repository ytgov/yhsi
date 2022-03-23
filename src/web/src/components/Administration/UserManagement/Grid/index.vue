<template>
  <div class="">
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
  </div>
</template>

<script>
import { mapActions } from "vuex";
export default {
  name: "usersgrid",
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
    },
  },
  computed: {
    filteredData() {
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
};
</script>

<style scoped>
.hoverclicklink:hover {
  color: #0097a9;
  text-decoration: underline;
  cursor: pointer;
}
</style>