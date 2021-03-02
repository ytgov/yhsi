<template>
  <div class="">
    <h1>Boats</h1>
    <Breadcrumbs/>
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
                > <v-icon class="black--text mr-1">mdi-filter</v-icon>
                    Filter

                  <v-icon class="black--text">mdi-chevron-right</v-icon>
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
        <v-col cols="auto" v-if="$route.path.includes('owner')" class="d-flex">
            <v-btn  class="black--text mx-1">Add Owner</v-btn>
            <JsonCSV :data="owners"><v-btn  class="black--text mx-1">Export</v-btn></JsonCSV>
            <v-btn  class="black--text mx-1">Print</v-btn>
        </v-col>
        <v-col cols="auto" v-else class="d-flex" >
            <v-btn  class="black--text mx-1">Add Boat</v-btn>
            <JsonCSV :data="boats"><v-btn  class="black--text mx-1">Export</v-btn></JsonCSV>
            <v-btn  class="black--text mx-1">Print</v-btn>
        </v-col>
    </v-row>
    <div class="mt-2">
        <v-card>
            <v-tabs v-model="active_tab">
                <v-tab key="1" :to="{path:'/boats/'}" :class="`${isActive($route.path)}`">
                  <v-icon class="mr-1">mdi-ferry</v-icon>
                  Boats
                </v-tab>
                <v-tab key="2" :to="{path:'/boats/owner'}">
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
import JsonCSV from 'vue-json-csv'
import Breadcrumbs from "../../Breadcrumbs";
export default {
  name: "boatsgrid-index",
  components: { Breadcrumbs, JsonCSV },
  data: () => ({
    route: "",
    active_tab: "",
    boats: [],
    owners: [],
    search: "",
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
  created() {
    if(this.$route.path.includes("owner")){//shows the buttons for owner
      this.route = "owner";
    }
    else{//shows the buttons for boats
      this.route = "boats";
    }
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
    getDataFromApi() {
      this.boats = [
          {id: 1, name: 'Evelyn', role: 'BackendUser', status: 'Active', date: '01/02/2020', access: 'First Nation Name', button: "Remove"},
          {id: 2, name: 'Name 2', role: 'BackendUser', status: 'Expired', date: '01/02/2020', access: 'First Nation Name', button: "Remove"},
          {id: 3, name: 'Name 3', role: 'BackendUser', status: 'Active', date: '01/02/2020', access: 'First Nation Name', button: "Remove"},
          {id: 4, name: 'Name 4', role: 'BackendUser', status: 'Pending', date: '01/02/2020', access: 'First Nation Name', button: "Remove"},
      ];
      this.owners = [
            {id: 1, owner: 'Ownername 1'},
            {id: 2, owner: 'Ownername 2'},
            {id: 3, owner: 'Ownername 3'},
        ];

    },
    isActive(route){//this function helps to show certain classes depending on the route
        return (route.includes('owner')) ? 'notActive' :  '';
    }
  }
};
</script>

<style scoped>
#horizontal-list{
    display: flex;
}
.notActive{
  color: rgba(0,0,0,.54) !important;
}
</style>