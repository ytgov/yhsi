<template>
  <div class="">
    <v-btn color="secondary" class="float-right mb-0 mt-2 pl-2" to="/admin" exact style="height: auto; font-size: .8rem; padding: 6px 10px;"
      ><v-icon class="mr-2" small>mdi-arrow-left</v-icon> Back to Administration</v-btn
    >
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
            <v-col cols="6" class="d-flex">
              <v-text-field
                prepend-inner-icon="mdi-magnify"
                class="mx-4"
                background-color="white"
                outlined
                hide-details
                dense
                label="Search"
                v-model="search"
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
                    <v-list-item
                      v-for="(item, i) in filterOptions"
                      :key="i"
                      link
                    >
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

          <v-data-table
            :items="filteredData"
            :headers="headers"
            :loading="loading"
            :search="search"
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
          </v-data-table></v-card-text
        >
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
    selectedFilter: [1],
    filterOptions: [
      { name: "Expired Users" },
      { name: "Active Users" },
      { name: "Pending Users" },
    ],
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
  watch: {
    selectedFilter(val) {
      console.log("SITLER CHAGNE", val);
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
};
</script>

<style scoped>
.hoverclicklink:hover {
  color: #0097a9;
  text-decoration: underline;
  cursor: pointer;
}
</style>