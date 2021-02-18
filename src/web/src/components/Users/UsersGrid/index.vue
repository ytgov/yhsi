<template>
  <div class="books">
    <h1>Users</h1>

    <v-text-field v-model="search" label="Search"></v-text-field>

    <v-data-table
    
      :items="users"
      :headers="headers"
      :loading="loading"    
      :search="search"
    >
    <template v-slot:item.name="{ item }">
        <div @click="handleClick(item)">
          {{item.name}}
        </div>  
    </template>
    <template v-slot:item.role="{ item }">
        <div @click="handleClick(item)">
          {{item.role}}
        </div>  
    </template>
    <template v-slot:item.status="{ item }">
        <div @click="handleClick(item)">
          {{item.status}}
        </div>  
    </template>
    <template v-slot:item.access="{ item }">
        <div @click="handleClick(item)">
          {{item.access}}
        </div>  
    </template>
     <template v-slot:item.button="{ item }">
        <v-btn color="success" @click="removeItem(item)">Remove</v-btn>
    </template>
    </v-data-table>
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
