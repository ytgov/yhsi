<template>
    <v-container>
      <v-row>
        <v-col cols="12">
          <h2>{{filteredData.length}} Results</h2><!-- value doesnt get modified by the search filter, this is due to the automated search that the vuetify datatable provides -->
        </v-col>
      </v-row>
      <v-divider  class="mb-4"></v-divider>
      <v-row>
        <v-col>
            <v-data-table
              :items="filteredData"
              :headers="headers"
              :loading="loading"    
              :search="search"
              @click:row="handleClick"
            >
                <template v-slot:item.owners="{ item }">
                    <div v-if="item.owners.length > 0">
                        {{ item.owners[0].OwnerName }}
                    </div>
                </template>
            </v-data-table>
            
        </v-col>
      </v-row>
    </v-container>
</template>

<script>
import boats from "../../../controllers/boats";
export default {
    name: "boatsGrid",
    data: ()=> ({
        loading: false,
        boats: [],
        totalLength: 0,
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
        page: 1,
        pageCount: 0,
        iteamsPerPage: 10,
        filterOptions: null,
    }),
    created(){
        this.getDataFromApi();
    },
    methods: {
        handleClick(value){   //Redirects the user to the edit user form
            this.$router.push({name: 'boatView', params: { name: value.Name, id: value.Id}});
        },
        async getDataFromApi() {
            this.loading = true;
            console.log("DATA FROM API");
            this.boats = await boats.get();
            console.log(this.boats);
            /*
            this.boats = [
                {id: 1, name: 'Evelyn', owner: 'Ownername 2', vesselType: 'Sternwheeler', constructionDate: '01/02/2020', serviceStartDate: '01/02/2020',
                serviceEndDate: "01/02/2020", currentLocationDescription: "", reqNumber: ""},
                {id: 2, name: 'Name 2', owner: 'Ownername 4', vesselType: 'Sternwheeler', constructionDate: '01/02/2020', serviceStartDate: '01/02/2020',
                serviceEndDate: "01/02/2020", currentLocationDescription: "", reqNumber: ""},
                {id: 3, name: 'Name 3', owner: 'Ownername 1', vesselType: 'Sternwheeler', constructionDate: '01/02/2020', serviceStartDate: '01/02/2020',
                serviceEndDate: "01/02/2020", currentLocationDescription: "", reqNumber: ""},
            ]*/
            this.totalLength = this.boats.length;
            this.loading = false;
        },

    },
    computed: {
        selectedFilters(){
            return this.$store.getters['boats/selectedFilters'];
        },
        search () {
            return this.$store.getters['boats/search'];
        },
        filteredData(){// returns a filtered users array depending on the selected filters
        console.log(this.filterOptions);
            if(this.filterOptions){
                let sorters = JSON.parse(JSON.stringify(this.filterOptions));
                let data = JSON.parse(JSON.stringify(this.boats));
                
                data = sorters[0].value == null ? data : data.filter( x => x.owner.toLowerCase().includes(sorters[0].value.toLowerCase()));  
                data = sorters[1].value == null ? data : data.filter( x => x.constructionDate.toLowerCase().includes(sorters[1].value.toLowerCase()));  
                data = sorters[2].value == null ? data : data.filter( x => x.serviceStartDate.toLowerCase().includes(sorters[2].value.toLowerCase()));  
                data = sorters[3].value == null ? data : data.filter( x => x.serviceEndDate.toLowerCase().includes(sorters[3].value.toLowerCase()));  
                data = sorters[4].value == null ? data : data.filter( x => x.vesselType.toLowerCase().includes(sorters[4].value.toLowerCase())); 
                return data;
            }
            else{
                return this.boats;
            }
        },
    },
    watch: {
        selectedFilters(newv, oldv){
            console.log("old value:");
            console.log(oldv);
            console.log("new value");
            console.log(newv);
            this.filterOptions = newv;
        },
        search (newv, oldv) {
            //this.search = newv;
            console.log(oldv,newv);
        }
    }
}
</script>