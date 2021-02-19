<template>
  <div class="">
    <v-app-bar
      color="primary"
      dark
      flat    
    >
      <v-btn color="primary" @click="goToSummary()">
        <v-icon>mdi-account-group</v-icon>
        <div class="ml-2">
          <v-toolbar-title> Users </v-toolbar-title>
        </div>
      </v-btn>
      <v-btn color="primary">
        <v-icon>mdi-filter</v-icon>
        Filter
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
    </v-app-bar>

    <v-container>
      <v-data-table
        :items="users"
        :headers="headers"
        :loading="loading"    
        :search="search"
      >
      <template v-slot:item.name="{ item }">
          <div @click="handleClick(item)" class="hoverclicklink">
            {{item.name}}
          </div>  
      </template>
      <template v-slot:item.button="{ item }">
          <v-btn color="success" outlined @click="removeItem(item)">Remove</v-btn>
      </template>
      </v-data-table>
    </v-container>
  </div>
</template>

<script>

export default {
  name: "usersgrid",
  data: () => ({
    loading: false,
    users: [],
    search: "",
    totalLength: 0,
    headers: [
      { text: "User Name", value: "name"},
      { text: "System Role", value: "role" },
      { text: "Status", value: "status"},
      { text: "Expiration Date", value: "date"},
      { text: "Authorized Access", value: "access"},
      { text: "", value: "button"}
    ],
    page: 1,
    pageCount: 0,
    iteamsPerPage: 10,
  }),
  mounted() {
    this.getDataFromApi();
  },
  methods: {
    handleClick(value){   //Redirects the user to the edit user form
        this.$router.push(`/users/${value.id}/edit`);
    },
    removeItem(item){ //removes one element from the users array
      const index = this.users.indexOf(item);
      if (index > -1) {
        this.users.splice(index, 1);
      }
    },
    getDataFromApi() {
      this.loading = true;
      this.users = [
          {id: 1, name: 'Name 1', role: 'BackendUser', status: 'Active', date: '01/02/2020', access: 'First Nation Name', button: "Remove"},
          {id: 2, name: 'Name 2', role: 'BackendUser', status: 'Active', date: '01/02/2020', access: 'First Nation Name', button: "Remove"},
          {id: 3, name: 'Name 3', role: 'BackendUser', status: 'Active', date: '01/02/2020', access: 'First Nation Name', button: "Remove"},
          {id: 4, name: 'Name 4', role: 'BackendUser', status: 'Active', date: '01/02/2020', access: 'First Nation Name', button: "Remove"},
      ]
      this.totalLength = this.users.length;
      this.loading = false;
    },
  },
};
</script>

<style scoped>
.hoverclicklink:hover{
  color:  #0097a9;
  text-decoration: underline;
  cursor: pointer;
}
</style>