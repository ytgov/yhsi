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
        { text: "Name", value: "name"},
        { text: "Owner", value: "owner" },
        { text: "Vessel Type", value: "vesselType"},
        { text: "Construction Date", value: "constructionDate"},
        { text: "Service Start Date", value: "serviceStartDate"},
        { text: "Service End Date", value: "serviceEndDate"},
        { text: "Current Location Description", value: "currentLocationDescription"},
        { text: "Req Number", value: "reqNumber"},
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
            this.$router.push(`/boats/view/${value.name}`);
        },
        async getDataFromApi() {
            this.loading = true;
            await boats.get();
            this.boats = [
                {id: 1, name: 'Evelyn', owner: 'Ownername 2', vesselType: 'Sternwheeler', constructionDate: '01/02/2020', serviceStartDate: '01/02/2020',
                serviceEndDate: "01/02/2020", currentLocationDescription: "", reqNumber: ""},
                {id: 2, name: 'Name 2', owner: 'Ownername 4', vesselType: 'Sternwheeler', constructionDate: '01/02/2020', serviceStartDate: '01/02/2020',
                serviceEndDate: "01/02/2020", currentLocationDescription: "", reqNumber: ""},
                {id: 3, name: 'Name 3', owner: 'Ownername 1', vesselType: 'Sternwheeler', constructionDate: '01/02/2020', serviceStartDate: '01/02/2020',
                serviceEndDate: "01/02/2020", currentLocationDescription: "", reqNumber: ""},
            ]
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