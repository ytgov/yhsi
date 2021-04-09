<template>
    <v-container>
      <v-row>
        <v-col cols="12">
          <h2 v-if="boats">{{filteredData.length}} Results</h2><!-- value doesnt get modified by the search filter, this is due to the automated search that the vuetify datatable provides -->
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
              :options.sync="options"
              :server-items-length="totalLength"
              @click:row="handleClick"
            >
                <template v-slot:item.owners="{ item }">
                    <div v-if="item.owners.length > 0">
                        {{ getCurrentOwner(item.owner) }}
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
            itemsPerPage = itemsPerPage === undefined ? 10 : itemsPerPage;;
            let data = await boats.get(page,itemsPerPage);
            this.boats = data.body;
            this.totalLength = data.count;
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
            let owner = owners.filter( x => x.currentowner === true);  
            console.log(owner);
            return owner.OwnerName;
        }

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
                
                data = sorters[0].value == null ? data : data.filter( x => x.owners[0].toLowerCase().includes(sorters[0].value.toLowerCase()));  
                data = sorters[1].value == null ? data : data.filter( x => x.ConstructionDate.toLowerCase().includes(sorters[1].value.toLowerCase()));  
                data = sorters[2].value == null ? data : data.filter( x => x.ServiceStart.toLowerCase().includes(sorters[2].value.toLowerCase()));  
                data = sorters[3].value == null ? data : data.filter( x => x.ServiceEnd.toLowerCase().includes(sorters[3].value.toLowerCase()));  
                data = sorters[4].value == null ? data : data.filter( x => x.VesselType.toLowerCase().includes(sorters[4].value.toLowerCase())); 
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
        selectedFilters(newv, oldv){
            /*
            console.log("old value:");
            console.log(oldv);
            console.log("new value");
            console.log(newv);
            */
            this.filterOptions = newv;
        },
        search (newv, oldv) {
            //this.search = newv;
            //console.log(oldv,newv);
        }/* eslint-enable */
        
    }
}
</script>