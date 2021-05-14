<template>
    <v-container fluid>
      <v-row>
        <v-col cols="12">
          <h2 v-if="boats">{{filteredData.length}} Results</h2><!-- value doesnt get modified by the search filter, this is due to the automated search that the vuetify datatable provides -->
        </v-col>
      </v-row>
      <v-divider inset class="mb-4"></v-divider>
      <v-row class="full-width-table">
        <v-col cols="12">
            <v-data-table
                class="full-width-table"
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
                <template v-slot:item.owners="{ item }">
                    <div v-if="item.owners.length > 0">
                        {{ getCurrentOwner(item.owners) }}
                    </div>
                </template>            
            </v-data-table>
            
        </v-col>
      </v-row>
    </v-container>
</template>

<script>
import boats from "../../../controllers/boats";
import _ from 'lodash';
export default {
    name: "boatsGrid",
    data: ()=> ({
        loading: false,
        boats: [],
        headers: [
        { text: "Name", value: "Name"},
        { text: "Owner", value: "owners" },
        { text: "Vessel Type", value: "VesselType"},
        { text: "Construction Date", value: "ConstructionDate"},
        { text: "Service Start Date", value: "ServiceStart"},
        { text: "Service End Date", value: "ServiceEnd"},
        { text: "Current Location Description", value: "CurrentLocation"},
        { text: "Req Number", value: "RegistrationNumber"},
        ],
        //table options
        page: 0,
        pageCount: 6,
        options: {},
        totalLength: 100,
        filterOptions: null,
    }),
    mounted(){
        this.getDataFromApi();
    },
    methods: {
        handleClick(value){   //Redirects the user to the edit user form
            this.$router.push({name: 'boatView', params: { name: value.Name, id: value.Id}});
        },
        async getDataFromApi() {
            this.loading = true;
            let { page, itemsPerPage } = this.options;
            page = page > 0 ? page-1 : 0;
            itemsPerPage = itemsPerPage === undefined ? 10 : itemsPerPage;
            let textToMatch = this.search;
            let data = await boats.get(page,itemsPerPage,textToMatch);
            this.boats = _.get(data, 'body', []);
            this.totalLength = _.get(data, 'count', 0);
            this.boats.map(x => {
                x.ConstructionDate = this.formatDate(x.ConstructionDate);
                x.ServiceStart = this.formatDate(x.ServiceStart);
                x.ServiceEnd = this.formatDate(x.ServiceEnd);
            });
            this.$store.commit("boats/setBoats", this.boats);
            this.loading = false;
        },
        formatDate (date) {
            if (!date) return null
            date = date.substr(0, 10);
            const [year, month, day] = date.split('-')
            return `${month}/${day}/${year}`
        },
        getCurrentOwner(owners){
            if(!owners) return null;
            //let owner = owners.filter( x => x.currentowner === true);  
            //console.log(owner);
            return owners[0].OwnerName;
        },
    },
    computed: {
        selectedFilters(){
            return this.$store.getters['boats/selectedFilters'];
        },
        search () {
            return this.$store.getters['boats/boatSearch'];
        },
        filteredData(){// returns a filtered users array depending on the selected filters
            if(this.filterOptions){
                let sorters = JSON.parse(JSON.stringify(this.filterOptions));
                let data = JSON.parse(JSON.stringify(this.boats));
                data = sorters[0].value == null || sorters[0].value == "" ? data : data.filter( x => x.owners[0] ? x.owners[0].OwnerName.toLowerCase().includes(sorters[0].value.toLowerCase()) : false);  
                data = sorters[1].value === null || sorters[1].value === "" ? data : data.filter( x => x.ConstructionDate ? x.ConstructionDate.includes(sorters[1].value.toLowerCase()) : false);  
                data = sorters[2].value === null || sorters[2].value === "" ? data : data.filter( x => x.ServiceStart ? x.ServiceStart.toLowerCase().includes(sorters[2].value.toLowerCase()) : false);  
                data = sorters[3].value === null || sorters[3].value === "" ? data : data.filter( x => x.ServiceEnd ? x.ServiceEnd.toLowerCase().includes(sorters[3].value.toLowerCase()) : false);  
                data = sorters[4].value === null || sorters[4].value === "" ? data : data.filter( x => x.VesselType ? x.VesselType.toLowerCase().includes(sorters[4].value.toLowerCase()) : false); 
                return data;
            }
            else{
                return this.boats;
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
}
</script>

<style scoped>
.full-width-table{
    width: 99%;
}
table.table {
    margin:0 auto;
    width: 98%;
    max-width: 98%;
}
</style>