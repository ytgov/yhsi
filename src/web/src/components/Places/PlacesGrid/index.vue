<template>
  <div class="">
    <h1>Places</h1>
    <!--<Breadcrumbs/>-->
    <v-row>
        <v-col cols="6" class="d-flex">
            <v-text-field 
            flat
            prepend-icon="mdi-magnify"
            class="mx-4"
            hide-details
            label="Search"
            v-model="search"
            v-on:input="placeSearchChange()"
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
                    <v-list-item
                    v-for="(item, i) in filterOptions"
                    :key="i"
                    link
                    >   
                      <v-text-field
                        clearable
                        v-model="item.value"
                        :label="item.name"
                      ></v-text-field>
                    </v-list-item>
                </v-list>
            </v-menu>
        </v-col>
        <v-spacer></v-spacer>
        <v-col cols="auto" class="d-flex" >
            <v-btn  class="black--text mx-1" @click="addNewPlace">
              <v-icon class="mr-1">mdi-plus-circle-outline</v-icon> 
              Add Place
            </v-btn>

            <JsonCSV :data="places" >
              <v-btn  class="black--text mx-1" :disabled="places.length == 0">
                <v-icon class="mr-1">
                  mdi-export
                </v-icon>
                Export
              </v-btn>
            </JsonCSV>

            <!--<PrintButton key="prt-2" :data="{places}" :disabled="places.length == 0"/>-->
        </v-col>
    </v-row>
    <div class="mt-2">
        <v-card>
          <v-container fluid>
              <v-row>
                <v-col cols="12">
                  <h2 v-if="places" class="ma-2">{{filteredData.length}} Results</h2>
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
                      :footer-props="{'items-per-page-options': [10, 30, 100]}"
                    >    
                      <!--<template v-slot:item.crashlocation="{ item }" >
                        <div style="width:200px;">
                            {{ item.crashlocation }}
                        </div>
                      </template>-->
                    </v-data-table>
                    
                </v-col>
              </v-row>
          </v-container>
            
        </v-card>
    </div>  
  </div>
</template>

<script>
import JsonCSV from 'vue-json-csv'
//import Breadcrumbs from "../../Breadcrumbs";
//import PrintButton from "./PrintButton";
import _ from 'lodash';
//import aircrash from "../../../controllers/aircrash";

import axios from "axios";
//import store from "../../../store";
import { YTPLACE_URL } from "../../../urls";

export default {
  name: "placesgrid-index",
  //components: { Breadcrumbs, JsonCSV, PrintButton },
  components: { JsonCSV },
  data: () => ({
    route: "",
    loading: false,
    places: [],
    search: "",
    headers: [
    //{ text: "Id", value: "id"},
    { text: "Name", value: "name"},
    { text: "Alternate Name", value: "alternateNames"},
    { text: "First Nation Name", value: "firstNationNames"},
    { text: "Place Type", value: "placeTypes"},
    { text: "Location Description", value: "locationDesc" },
    { text: "Latitude", value: "latitude"},
    { text: "Longitude", value: "longitude"},
    { text: "Mapsheet", value: "mapSheet"},
    ],
    //table options
    page: 0,
    pageCount: 6,
    totalLength: 0,
    options: {},
    filterOptions: [
      {name: 'Name', value: ""},
      {name: 'Place Type', value: ""},
      {name: 'Mapsheet', value: ""},
    ],
    selectedItem: 1,
    items: [
      { text: 'Real-Time', icon: 'mdi-clock' },
      { text: 'Audience', icon: 'mdi-account' },
      { text: 'Conversions', icon: 'mdi-flag' },
    ],
  }),
  mounted(){
        this.getDataFromApi();
  },
  methods: {
    addNewPlace(){
        this.$router.push(`/place/new`);
    },
    placeSearchChange: _.debounce(function () {
        this.getDataFromApi();
      }, 400),
    handleClick(value){   //Redirects the user to the place form component
          this.$router.push({name: 'placeView', params: { placeId: value.id}});
      },
      async getDataFromApi() {
      // modelled from sites getDataFromApi 
      this.loading = true;

      let body = _.clone(this.options);
      body.query = [
        { field: "name", operator: "contains", value: this.search },
        { field: "locationDesc", operator: "contains", value: this.search },
      ];

      axios
        .post(`${YTPLACE_URL}/search`, body)
        .then((resp) => {
          // Djpratt testing
          console.log(body);
          console.log(`${YTPLACE_URL}/search`);
          console.log(resp.data);
          this.places = resp.data.data;
          //this.totalLength = resp.data.meta.count || resp.data.meta.count.item_count;
          this.totalLength = resp.data.meta.item_count;

          this.loading = false;
        })
        .catch((err) => console.error('Error in getDataFromApi: '+ err))
        .finally(() => {
          this.loading = false;
        });

      /* from aircrash - using sites getDataFromApi instead
          this.loading = true;
          let { page, itemsPerPage, sortBy, sortDesc } = this.options;
          page = page > 0 ? page-1 : 0;
          itemsPerPage = itemsPerPage === undefined ? 10 : itemsPerPage;
          let textToMatch = this.search;
          let data = await aircrash.get(page,itemsPerPage,textToMatch, sortBy[0], sortDesc[0] ? 'desc':'asc');
          this.places = data.body;
          this.totalLength = data.count;
          this.places.map(x => {
              x.crashdate = this.formatDate(x.crashdate);
          });
          this.loading = false;
      */
      },
      formatDate (date) {
          if (!date) return null
          date = date.substr(0, 10);
          const [year, month, day] = date.split('-')
          return `${month}/${day}/${year}`
      },
      //if its needed 
      /*getPilot(name,lastname){
        if(!name || !lastname)
          return '';

        return `${name}, ${lastname}`
      },
      filterPilot(data, filter){
        let { pilotfirstname, pilotlastname } = data;
        if(!pilotfirstname && !pilotlastname)
          return false;
        
        if(pilotfirstname.toLowerCase().includes(filter.toLowerCase()))
          return true;
        
        if(pilotlastname.toLowerCase().includes(filter.toLowerCase()))
          return true;

        return false;
      } */
  },
  computed:{
      /*selectedFilters(){
            return this.$store.getters['places/selectedFilters'];
      },*/
      filteredData(){// returns a filtered places array depending on the selected filters
          if(this.filterOptions){
            //the name should actually be 'filters'
              //let sorters = JSON.parse(JSON.stringify(this.filterOptions));
              let data = JSON.parse(JSON.stringify(this.places));
              // TODO
              /*data = sorters[0].value == null || sorters[0].value == "" ? data : data.filter( x => x.crashdate ? x.crashdate.toLowerCase().includes(sorters[0].value.toLowerCase()) : false);  
              data = sorters[1].value === null || sorters[1].value === "" ? data : data.filter( x => x.aircrafttype ? x.aircrafttype.toLowerCase().includes(sorters[1].value.toLowerCase()) : false);  
              data = sorters[2].value === null || sorters[2].value === "" ? data : data.filter( x => x.aircraftregistration ? x.aircraftregistration.toLowerCase().includes(sorters[2].value.toLowerCase()) : false);  
              data = sorters[3].value === null || sorters[3].value === "" ? data : data.filter( x => x.nation ? x.nation.toLowerCase().includes(sorters[3].value.toLowerCase()) : false);  
              data = sorters[4].value === null || sorters[4].value === "" ? data : data.filter( x => x.militarycivilian ? x.militarycivilian.toLowerCase().includes(sorters[4].value.toLowerCase()) : false); 
              data = sorters[5].value === null || sorters[5].value === "" ? data : data.filter( x => this.filterPilot(x,sorters[5].value)); 
              data = sorters[6].value === null || sorters[6].value === "" ? data : data.filter( x => x.soulsonboard ? x.soulsonboard == sorters[6].value : false);  
              data = sorters[7].value === null || sorters[7].value === "" ? data : data.filter( x => x.injuries ? x.injuries == sorters[7].value : false); 
              data = sorters[8].value === null || sorters[8].value === "" ? data : data.filter( x => x.fatalities ? x.fatalities == sorters[8].value : false); */ 
              return data;
          }
          else{
              return this.places;
          }
      },        
  },
  watch: {/* eslint-disable */
        options: {
            handler () {
                this.getDataFromApi()
            },
            deep: true,
        }, 
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