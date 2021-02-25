<template>
  <div class="">
    <h1>Boats</h1>
    <v-row>
        <v-col cols="6" class="d-flex">
            <v-text-field
            flat
            prepend-icon="mdi-magnify"
            class="mx-4"
            hide-details
            label="Search"
            v-model="search"
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
                > <v-icon class="black--text">mdi-filter</v-icon>
                    Filter
                </v-btn>
                </template>
                <v-list>
                <v-list-item-group
                    v-model="selectedFilter"
                    color="primary"
                    multiple
                    @change="filterChange"
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
        </v-col>
        <v-spacer></v-spacer>
        <v-col cols="auto">
            <v-btn color="transparent" class="black--text mx-1">Add Boat</v-btn>
            <v-btn color="transparent" class="black--text mx-1">Export</v-btn>
            <v-btn color="transparent" class="black--text mx-1">Print</v-btn>
        </v-col>
    </v-row>
    <div class="mt-2">
        <v-card>
            <v-tabs>
                <v-tab :to="{name:'generalBoats', query: { selectedFilters: [1,2,3] }}">
                  <v-icon class="mr-1">mdi-ferry</v-icon>
                  Boats
                </v-tab>
                <v-tab :to="{path:'/boats/owner'}">
                  <v-icon class="mr-1">mdi-account-tie</v-icon>
                  Owner
                </v-tab>
            </v-tabs>
            <v-divider  class="mb-4"></v-divider>
            <router-view id="rv-boats"/>
        </v-card>
    </div>  
  </div>
</template>

<script>

export default {
  name: "boatsgrid-index",
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
    selectedFilter: [],
    filterOptions: [
      {name: 'Boat Name'},
      {name: 'Owner'},
      {name: 'Construction Date'},
      {name: 'Owner'},
      {name: 'Service Start'},
      {name: 'Service End'},
      {name: 'Vessel Type'},
    ],
          selectedItem: 1,
      items: [
        { text: 'Real-Time', icon: 'mdi-clock' },
        { text: 'Audience', icon: 'mdi-account' },
        { text: 'Conversions', icon: 'mdi-flag' },
      ],
  }),
  mounted() {
    this.getDataFromApi();
  },
  methods: {
    searchChange(){
        this.$store.commit("boats/setSearch", this.search);
        console.log(this.$store.getters['boats/search']);
    },
    filterChange(){
        console.log("hola");
        this.$store.commit("boats/setSelectedFilters", this.selectedFilter);
    },
    removeItem(item){ //removes one element from the users array
      const index = this.users.indexOf(item);
      if (index > -1) {
        this.users.splice(index, 1);
      }
    },
    getDataFromApi() {
      this.loading = true;
      this.boats = [
          {id: 1, name: 'Name 1', role: 'BackendUser', status: 'Active', date: '01/02/2020', access: 'First Nation Name', button: "Remove"},
          {id: 2, name: 'Name 2', role: 'BackendUser', status: 'Expired', date: '01/02/2020', access: 'First Nation Name', button: "Remove"},
          {id: 3, name: 'Name 3', role: 'BackendUser', status: 'Active', date: '01/02/2020', access: 'First Nation Name', button: "Remove"},
          {id: 4, name: 'Name 4', role: 'BackendUser', status: 'Pending', date: '01/02/2020', access: 'First Nation Name', button: "Remove"},
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
#horizontal-list{
    display: flex;
}
</style>