<template>
  <div class="">
    <h1>Boats</h1>
    <Breadcrumbs/>
    <v-row>
        <v-col cols="6" class="d-flex">
            <v-text-field v-if="$route.path.includes('owner')"
            flat
            prepend-icon="mdi-magnify"
            class="mx-4"
            hide-details
            label="Search by Owner Name"
            v-model="search"
            v-on:input="searchChange()"
            ></v-text-field>

            <v-text-field v-else
            flat
            prepend-icon="mdi-magnify"
            class="mx-4"
            hide-details
            label="Search by Boat Name"
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
                    v-if="$route.path.includes('owner')"
                    color="transparent"
                    class="black--text"
                    v-bind="attrs"
                    v-on="on"
                    disabled
                > <v-icon class="black--text mr-1">mdi-filter</v-icon>
                    Filter

                  <v-icon class="black--text">mdi-chevron-right</v-icon>
                </v-btn>
                <v-btn
                    v-else
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
                    color="primary"
                    multiple
                >
                    <v-list-item
                    v-for="(item, i) in filterOptions"
                    :key="i"
                    link
                    >   
                      <v-text-field
                        clearable
                        @change="filterChange"
                        v-model="item.value"
                        :label="item.name"
                      ></v-text-field>
                    </v-list-item>
                </v-list-item-group>
                </v-list>
            </v-menu>
        </v-col>
        <v-spacer></v-spacer>
        <v-col cols="auto" v-if="$route.path.includes('owner')" class="d-flex">
            <v-btn  class="black--text mx-1" @click="addNewOwner">
              <v-icon class="mr-1">mdi-plus-circle-outline</v-icon> 
              Add Owner
            </v-btn>

            <JsonCSV :data="owners">
              <v-btn  class="black--text mx-1">
                <v-icon class="mr-1">
                  mdi-export
                </v-icon>
                Export
              </v-btn>
            </JsonCSV>

            <PrintButton key="prt-1" :data="{owners}"/>
        </v-col>
        <v-col cols="auto" v-else class="d-flex" >
            <v-btn  class="black--text mx-1" @click="addNewBoat">
              <v-icon class="mr-1">mdi-plus-circle-outline</v-icon> 
              Add Boat
            </v-btn>

            <JsonCSV :data="boats">
              <v-btn  class="black--text mx-1">
                <v-icon class="mr-1">
                  mdi-export
                </v-icon>
                Export
              </v-btn>
            </JsonCSV>

            <PrintButton key="prt-2" :data="{boats}"/>
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
import PrintButton from "./PrintButton";
import axios from 'axios';
export default {
  name: "boatsgrid-index",
  components: { Breadcrumbs, JsonCSV, PrintButton },
  data: () => ({
    route: "",
    active_tab: "",
    boats: [],
    owners: [],
    search: "",
    filterOptions: [
      {name: 'Owner', value: ""},
      {name: 'Construction Date', value: ""},
      {name: 'Service Start', value: ""},
      {name: 'Service End', value: ""},
      {name: 'Vessel Type', value: ""},
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
    addNewBoat(){
        this.$router.push(`/boats/new`);
    },
    addNewOwner(){
        this.$router.push(`/boats/owner/new`);
    },
    searchChange(){
        this.$store.commit("boats/setSearch", this.search);
    },
    filterChange(){
        this.$store.commit("boats/setSelectedFilters", this.filterOptions);
    },
    async getDataFromApi() {
        await axios.get(`https://jsonplaceholder.typicode.com/users`)
        .then(res => {
          //handle data response
          console.log("jsonplaceholder");
          console.log(res.data);
        }).catch(error =>{
          // handle error
          console.log(error);
        });
        console.log("after await");
        this.boats = [
            {name: 'Evelyn', owner: 'Ownername 2', vesselType: 'Sternwheeler', constructionDate: '01/02/2020', serviceStartDate: '01/02/2020',
            serviceEndDate: "01/02/2020", currentLocationDescription: "", reqNumber: ""},
            {name: 'Name 2', owner: 'Ownername 4', vesselType: 'Sternwheeler', constructionDate: '01/02/2020', serviceStartDate: '01/02/2020',
            serviceEndDate: "01/02/2020", currentLocationDescription: "", reqNumber: ""},
            {name: 'Name 3', owner: 'Ownername 1', vesselType: 'Sternwheeler', constructionDate: '01/02/2020', serviceStartDate: '01/02/2020',
            serviceEndDate: "01/02/2020", currentLocationDescription: "", reqNumber: ""},
        ]
        this.owners = [
              { owner: 'Ownername 1'},
              { owner: 'Ownername 2'},
              { owner: 'Ownername 3'},
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