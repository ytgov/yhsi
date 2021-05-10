<template>
  <div class="">
    <h1>Airplane Crash Sites</h1>
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
            v-on:input="boatSearchChange()"
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
                    <v-list-item
                    v-for="(item, i) in filterOptions"
                    :key="i"
                    link
                    >   
                      <v-text-field
                        clearable
                        @input="filterChange"
                        v-model="item.value"
                        :label="item.name"
                      ></v-text-field>
                    </v-list-item>
                </v-list>
            </v-menu>
        </v-col>
        <v-spacer></v-spacer>
        <v-col cols="auto" class="d-flex" >
            <v-btn  class="black--text mx-1" @click="addNewBoat">
              <v-icon class="mr-1">mdi-plus-circle-outline</v-icon> 
              Add Crash Site
            </v-btn>

            <JsonCSV :data="crashsites" >
              <v-btn  class="black--text mx-1" :disabled="crashsites.length == 0">
                <v-icon class="mr-1">
                  mdi-export
                </v-icon>
                Export
              </v-btn>
            </JsonCSV>

            <PrintButton key="prt-2" :data="{crashsites}" :disabled="crashsites.length == 0"/>
        </v-col>
    </v-row>
    <div class="mt-2">
        <v-card>
          <v-container fluid>
              <v-row>
                <v-col cols="12">
                  <h2 v-if="crashsites" class="ma-2">{{filteredData.length}} Results</h2>
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
                      disable-sort
                      :footer-props="{'items-per-page-options': [10, 30, 100]}"
                    >           
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
import Breadcrumbs from "../../Breadcrumbs";
import PrintButton from "./PrintButton";
import _ from 'lodash';
import aircrash from "../../../controllers/aircrash";
export default {
  name: "boatsgrid-index",
  components: { Breadcrumbs, JsonCSV, PrintButton },
  data: () => ({
    route: "",
    loading: false,
    crashsites: [],
    headers: [
    { text: "Yacsinumber", value: "yacsinumber"},
    { text: "Crash Date", value: "crashdate" },
    { text: "Aircraft Type", value: "aircrafttype"},
    { text: "Aircraft Registration", value: "aircraftregistration"},
    { text: "Country of Registration", value: "nation"},
    { text: "Registration Type", value: "militarycivilian"},
    { text: "Location Description", value: "crashlocation"},
    { text: "Pilot First Name", value: "pilot"},
    { text: "Pilot Last Name", value: "pilot"},
    { text: "Souls Onboard", value: "soulsonboard"},
    { text: "Injuries", value: "injuries"},
    { text: "Fatalities", value: "fatalities"},
    ],
    //table options
    page: 0,
    pageCount: 6,
    totalLength: 0,
    options: {},
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
  mounted(){
        this.getDataFromApi();
  },
  methods: {
    addNewBoat(){
        this.$router.push(`/boats/new`);
    },
    boatSearchChange: _.debounce(function () {
        this.$store.commit("boats/setBoatSearch", this.search);
      }, 400),
    filterChange(){
        this.$store.commit("boats/setSelectedFilters", this.filterOptions);
    },
    handleClick(){   //Redirects the user to the airplane form component
          this.$router.push({name: 'airplaneView', params: { name: "test", id: 1}});
      },
      async getDataFromApi() {
          this.loading = true;
          let { page, itemsPerPage } = this.options;
          page = page > 0 ? page-1 : 0;
          itemsPerPage = itemsPerPage === undefined ? 10 : itemsPerPage;
          let textToMatch = this.search;
          let data = await aircrash.get(page,itemsPerPage,textToMatch);
          this.crashsites = data.body;
          this.totalLength = data.count;
          /*
          this.boats.map(x => {
              x.ConstructionDate = this.formatDate(x.ConstructionDate);
              x.ServiceStart = this.formatDate(x.ServiceStart);
              x.ServiceEnd = this.formatDate(x.ServiceEnd);
          });*/
          this.loading = false;
      },
      formatDate (date) {
          if (!date) return null
          date = date.substr(0, 10);
          const [year, month, day] = date.split('-')
          return `${month}/${day}/${year}`
      },
  },
  computed:{
      selectedFilters(){
            return this.$store.getters['boats/selectedFilters'];
      },
      search () {
          return this.$store.getters['boats/boatSearch'];
      },
      filteredData(){// returns a filtered users array depending on the selected filters
          if(this.filterOptions){
              //let sorters = JSON.parse(JSON.stringify(this.filterOptions));
              let data = JSON.parse(JSON.stringify(this.crashsites));
              /*
              data = sorters[0].value == null || sorters[0].value == "" ? data : data.filter( x => x.owners[0] ? x.owners[0].OwnerName.toLowerCase().includes(sorters[0].value.toLowerCase()) : false);  
              data = sorters[1].value === null || sorters[1].value === "" ? data : data.filter( x => x.ConstructionDate ? x.ConstructionDate.includes(sorters[1].value.toLowerCase()) : false);  
              data = sorters[2].value === null || sorters[2].value === "" ? data : data.filter( x => x.ServiceStart ? x.ServiceStart.toLowerCase().includes(sorters[2].value.toLowerCase()) : false);  
              data = sorters[3].value === null || sorters[3].value === "" ? data : data.filter( x => x.ServiceEnd ? x.ServiceEnd.toLowerCase().includes(sorters[3].value.toLowerCase()) : false);  
              data = sorters[4].value === null || sorters[4].value === "" ? data : data.filter( x => x.VesselType ? x.VesselType.toLowerCase().includes(sorters[4].value.toLowerCase()) : false); 
              */
              return data;
          }
          else{
              return this.crashsites;
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
        selectedFilters(newv){
            console.log(newv);
            this.filterOptions = newv;
        },
        search (newv, oldv) {
            this.getDataFromApi();
        }/* eslint-enable */
        
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