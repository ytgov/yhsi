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
export default {
    name: "boatsGrid",
    data: ()=> ({
        loading: false,
        boats: [0],
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
        filterOptions: [
            {name: 'Boat Name'},
            {name: 'Owner'},
            {name: 'Construction Date'},
            {name: 'Owner'},
            {name: 'Service Start'},
            {name: 'Service End'},
            {name: 'Vessel Type'},
        ],
    }),
    created(){
        console.log(this.selectedFilters);
        console.log(this.$route.params);
        this.getDataFromApi();
    },
    methods: {
        handleClick(value){   //Redirects the user to the edit user form
            this.$router.push(`/boats/${value.name}`);
        },
        getDataFromApi() {
        this.loading = true;
        this.boats = [
            {id: 1, name: 'Name 1', owner: 'Ownername 2', vesselType: 'Sternwheeler', constructionDate: '01/02/2020', serviceStartDate: '01/02/2020',
            serviceEndDate: "01/02/2020", currentLocationDescription: "", reqNumber: ""},
            {id: 2, name: 'Name 2', owner: 'Ownername 4', vesselType: 'Sternwheeler', constructionDate: '01/02/2020', serviceStartDate: '01/02/2020',
            serviceEndDate: "01/02/2020", currentLocationDescription: "", reqNumber: ""},
            {id: 3, name: 'Name 3', owner: 'Ownername 1', vesselType: 'Sternwheeler', constructionDate: '01/02/2020', serviceStartDate: '01/02/2020',
            serviceEndDate: "01/02/2020", currentLocationDescription: "", reqNumber: ""},
        ]
        this.totalLength = this.boats.length;
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
        selectedFilters(){
            return this.$store.getters['boats/selectedFilters'];
        },
        search () {
            return this.$store.getters['boats/search'];
        },
        filteredData(){// returns a filtered users array depending on the selected filters
            if(this.selectedFilters){
                console.log(this.boats);
                let sorters = JSON.parse(JSON.stringify(this.selectedFilters));
                let data = JSON.parse(JSON.stringify(this.boats));
                for(let i=0; i<sorters.length; i++){
                    switch(sorters[i]){
                    case 0:
                        sorters[i] = "Boat Name"
                        break;
                    case 1:
                        sorters[i] = "Owner"
                        break;
                    case 2:
                        sorters[i] = "Construction Date"
                        break;
                    case 3:
                        sorters[i] = "Service Start"
                        break;
                    case 4:
                        sorters[i] = "Service End"
                        break;
                    case 5:
                        sorters[i] = "Vessel Type"
                        break;
                    }
                }
                return this.filter(data, sorters);
            }
            else{
                return [];
            }
            
        },
    },
    watch: {
        selectedFilters(newv, oldv){
            console.log(oldv,newv);
        },
        search (newv, oldv) {
            //this.search = newv;
            console.log(oldv,newv);
        }
    }
}
</script>