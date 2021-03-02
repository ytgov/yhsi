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
        owners: [0],
        totalLength: 0,
        headers: [
        { text: "Owner", value: "owner" },
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
            this.$router.push(`/boats/owner/${value.owner}`);
        },
        getDataFromApi() {
        this.loading = true;
        this.owners = [
            {id: 1, owner: 'Ownername 1'},
            {id: 2, owner: 'Ownername 2'},
            {id: 3, owner: 'Ownername 3'},
        ]
        this.totalLength = this.owners.length;
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
                console.log(this.owners);
                let sorters = JSON.parse(JSON.stringify(this.selectedFilters));
                let data = JSON.parse(JSON.stringify(this.owners));
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