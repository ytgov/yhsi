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
        owners: [],
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
        this.getDataFromApi();
    },
    methods: {
        handleClick(value){   //Redirects the user to the edit user form
            this.$router.push(`/boats/owner/view/${value.owner}`);
        },
        async getDataFromApi() {
            this.loading = true;
            await boats.get();
            this.owners = [
                {id: 1, owner: 'Ownername 1'},
                {id: 2, owner: 'Ownername 2'},
                {id: 3, owner: 'Ownername 3'},
            ]
            this.totalLength = this.owners.length;
            this.loading = false;
        },

    },
    computed: {
        search () {
            return this.$store.getters['boats/search'];
        },
        filteredData(){// returns a filtered users array depending on the selected filters
           return this.owners;  
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