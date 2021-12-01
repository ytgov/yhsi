<template>
  <div class="">
    <v-app-bar color="primary" dark flat>
      <v-btn color="primary">
        <v-icon>mdi-home-group</v-icon>
        <div class="ml-2">
          <v-toolbar-title> Communities </v-toolbar-title>
        </div>
      </v-btn>
      <v-spacer></v-spacer>
      <div>
        <v-text-field
          dense
          filled
          solo-inverted
          flat
          append-icon="mdi-magnify"
          class="mx-4"
          hide-details
          label="Search"
          v-model="search"
        ></v-text-field>
      </div>
      <v-btn color="primary" @click="handleClickAdd()">
        <v-icon class="mr-2">mdi-plus</v-icon>
        Add Community
      </v-btn>
    </v-app-bar>

    <v-container fluid>
      <v-row>
        <v-col cols="12">
          <h2>{{ owners.length }} Results</h2>
          <!-- value doesnt get modified by the search filter, this is due to the automated search that the vuetify datatable provides -->
        </v-col>
      </v-row>
      <v-divider inset class="mb-4"></v-divider>
      <v-row>
        <v-col>
          <v-data-table
            :items="owners"
            :headers="headers"
            :loading="loading"
            :search="search"
            @click:row="handleClickEdit"
          >
          </v-data-table>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
export default {
  name: "communitiesgrid",
  data: () => ({
    loading: false,
    owners: [],
    search: "",
    totalLength: 0,
    headers: [{ text: "Name", value: "name" }],
    page: 1,
    pageCount: 0,
    iteamsPerPage: 10,
  }),
  mounted() {
    this.getDataFromApi();
  },
  methods: {
    handleClickEdit(value) {
      //Redirects the user to the edit user form
      this.$router.push(`/communities/edit/${value.id}`);
    },
    handleClickAdd() {
      //Redirects the user to the edit user form
      this.$router.push(`/communities/add`);
    },
    removeItem(item) {
      //removes one element from the users array
      const index = this.owners.indexOf(item);
      if (index > -1) {
        this.owners.splice(index, 1);
      }
    },
    getDataFromApi() {
      this.loading = true;
      this.owners = [
        { id: 1, name: "Name 1" },
        { id: 2, name: "Name 2" },
        { id: 3, name: "Name 3" },
        { id: 4, name: "Name 4" },
        { id: 5, name: "Name 5" },
      ];
      this.totalLength = this.owners.length;
      this.loading = false;
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