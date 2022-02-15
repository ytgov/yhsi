<template>
  <div class="">
    <v-container fluid>
      <h1>Community</h1>
      <Breadcrumbs/>
      <v-row class="mb-2">
        <v-col cols="6" class="d-flex">
          <v-text-field
            flat
            prepend-icon="mdi-magnify"
            class="mx-4"
            hide-details
            label="Search"
            v-model="search"
            @keyup.enter="searchChange()"
            v-on:input="searchChange()"
            ></v-text-field>
        </v-col>
        <v-spacer></v-spacer>
        <v-col cols="auto">
            <AddDialog/>
        </v-col>
        
      </v-row>
      <div class="mt-2">
        <v-card class="px-3 py-3">
            <v-row>
              <v-col cols="12">
                <h2>{{filteredData.length}} Results</h2><!-- value doesnt get modified by the search filter, this is due to the automated search that the vuetify datatable provides -->
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
                    <template v-slot:item.Status="{ item }">
                        <div v-if="item.Status == 1">
                            Active
                        </div>  
                        <div v-else>
                            Expired
                        </div> 
                    </template>
                    <template v-slot:item.actions="{ item }">
                        <v-btn color="success" outlined @click="removeItem(item)">
                          <v-icon class="mr-1">mdi-delete</v-icon>
                          Remove
                        </v-btn>
                    </template>
                  </v-data-table>
              </v-col>
            </v-row>
        </v-card>
    </div>  
      <EditDialog :dialog="editDialog" :data="displayCommunity" @closeEditDialog="closeDialog"/>
    </v-container>
  </div>
</template>

<script>
import catalogs from "../../../../controllers/catalogs";
import Breadcrumbs from "../../../Breadcrumbs";
import EditDialog from "./EditDialog";
import AddDialog from "./AddDialog";
import _ from 'lodash';
export default {
  name: "communitygrid",
  components: { Breadcrumbs, EditDialog, AddDialog },
  data: () => ({
    loading: false,
    communities: [],
    search: "",
    options: {},
    totalLength: 10,
    headers: [
      { text: "Name", value: "Name" },
    ],
    page: 1,
    pageCount: 0,
    iteamsPerPage: 10,
    displayCommunity: {},
    editDialog: false,
  }),
  mounted() {
    this.getDataFromApi();
  },
  methods: {
    searchChange: _.debounce(function () {
      this.getDataFromApi();
    }, 400),
    handleClick(value){   //Redirects the user to the edit user form
        this.displayCommunity = value;
        this.editDialog = true;
    },
    removeItem(item){ //removes one element from the users array
      const index = this.communities.findIndex(a=> a.id == item.id);
      console.log(index);
      if (index > -1) {
        this.communities.splice(index, 1);
      }
    },
    async getDataFromApi() {
        this.loading = true;
        let { page, itemsPerPage, sortBy, sortDesc } = this.options;
        if (!sortBy[0]) sortBy[0] = 'Name'; 
        page = page > 0 ? page-1 : 0;
        itemsPerPage = itemsPerPage === undefined ? 10 : itemsPerPage;
        let textToMatch = this.search;
        let data = await catalogs.getCommunities(page,itemsPerPage,textToMatch, sortBy[0], sortDesc[0] ? 'desc':'asc');
        this.communities = _.get(data, 'body', []);
        console.log(this.communities);
        this.totalLength = _.get(data, 'count', 0);
        this.loading = false;
    },
    formatDate (date) {
        if (!date) return null
        date = date.substr(0, 10);
        const [year, month, day] = date.split('-')
        return `${month}/${day}/${year}`
    },
    closeDialog(){
      this.editDialog = false;
    }

  },
  computed: {
    filteredData(){// returns a filtered users array depending on the selected filters
      let data = JSON.parse(JSON.stringify(this.communities));
      return data;
    },
  },
    watch: {
      options: {
            handler () {
                this.getDataFromApi()
            },
            deep: true,
        },
        search () {
            this.getDataFromApi();
        }
    }
};
</script>

<style scoped>
.hoverclicklink:hover{
  color:  #0097a9;
  text-decoration: underline;
  cursor: pointer;
}
</style>