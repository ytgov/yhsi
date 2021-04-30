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
      <v-menu
        transition="slide-y-transition"
        bottom
        :close-on-content-click="false"
      >
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            color="primary"
            dark
            v-bind="attrs"
            v-on="on"
          > <v-icon>mdi-filter</v-icon>
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
                    <v-icon
                      v-if="!active"
                    >
                      mdi-checkbox-blank-outline
                    </v-icon>
                    <v-icon
                      v-else
                    >
                      mdi-checkbox-marked-outline
                    </v-icon>
                  </v-list-item-action>
                  <v-list-item-title>{{ item.name }}</v-list-item-title>
                </template>
            </v-list-item>
          </v-list-item-group>
        </v-list>
      </v-menu>
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

    <v-container fluid>
      <v-row>
        <v-col cols="12">
          <h2>{{filteredData.length}} Results</h2><!-- value doesnt get modified by the search filter, this is due to the automated search that the vuetify datatable provides -->
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
            >
              <template v-slot:item.name="{ item }">
                  <div @click="handleClick(item)" class="hoverclicklink">
                    {{item.name}}
                  </div>  
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
      { text: "Actions", value: "actions"}
    ],
    page: 1,
    pageCount: 0,
    iteamsPerPage: 10,
    selectedFilter: [],
    filterOptions: [
      {name: 'Active Users'},
      {name: 'Expired Users'},
      {name: 'Pending Users'},
    ],
  }),
  mounted() {
    this.getDataFromApi();
  },
  methods: {
    handleClick(value){   //Redirects the user to the edit user form
        this.$router.push(`/users/edit/${value.id}`);
    },
    removeItem(item){ //removes one element from the users array
      const index = this.users.findIndex(a=> a.id == item.id);
      console.log(index);
      if (index > -1) {
        this.users.splice(index, 1);
      }
    },
    getDataFromApi() {
      this.loading = true;
      this.users = [
          {id: 1, name: 'Name 1', role: 'BackendUser', status: 'Active', date: '01/02/2020', access: 'First Nation Name'},
          {id: 2, name: 'Name 2', role: 'BackendUser', status: 'Expired', date: '01/02/2020', access: 'First Nation Name'},
          {id: 3, name: 'Name 3', role: 'BackendUser', status: 'Active', date: '01/02/2020', access: 'First Nation Name'},
          {id: 4, name: 'Name 4', role: 'BackendUser', status: 'Pending', date: '01/02/2020', access: 'First Nation Name'},
      ]
      this.totalLength = this.users.length;
      this.loading = false;
    },
    filter(data, arr){// this is a helper function for "filteredData", applies filters and returns an array.
      return arr.length == 1 ? data.filter( a => a.status == arr[0])
            : arr.length == 2 ? data.filter( a => (a.status == arr[0] || a.status == arr[1]))
            : arr.length == 3 ? data.filter( a => (a.status == arr[0] || a.status == arr[1] || a.status == arr[2]))
            : data;
    },

  },
  computed: {
    filteredData(){// returns a filtered users array depending on the selected filters
      let sorters = JSON.parse(JSON.stringify(this.selectedFilter));
      let data = JSON.parse(JSON.stringify(this.users));
      for(let i=0; i<sorters.length; i++){
        switch(sorters[i]){
          case 0:
            sorters[i] = "Active"
            break;
          case 1:
            sorters[i] = "Expired"
            break;
          case 2:
            sorters[i] = "Pending"
            break;
        }
      }
      return this.filter(data, sorters);
    },
  }
};
</script>

<style scoped>
.hoverclicklink:hover{
  color:  #0097a9;
  text-decoration: underline;
  cursor: pointer;
}
</style>