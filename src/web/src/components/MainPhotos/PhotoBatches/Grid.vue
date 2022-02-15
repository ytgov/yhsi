<template>
  <div class="">
    <h1>Photo Batches</h1>
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
            v-on:input="searchChange()"
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
          
            <SaveDialog @saveDialog="saveDialog" :isDisabled="false" :itemType="`photobatch`" />
        </v-col>
    </v-row>
    <div class="mt-2">
        <v-card>
          <v-container fluid>
              <v-row>
                <v-col cols="12">
                  <h2 v-if="batches" class="ma-2">{{filteredData.length}} Results</h2>
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
                    </v-data-table>
                    
                </v-col>
              </v-row>
          </v-container>
            
        </v-card>
    </div>  
  </div>
</template>

<script>
import Breadcrumbs from "../../Breadcrumbs";
import _ from 'lodash';

import axios from "axios";
import { PHOTO_BATCH_URL } from "../../../urls";
import SaveDialog from "../SaveDialog";

export default {
  name: "photobatchgrid",
  components: { Breadcrumbs, SaveDialog },
  data: () => ({
    route: "",
    loading: false,
    batches: [],
    search: "",
    headers: [
    //{ text: "Id", value: "id"},
    { text: "Batch Name", value: "name"},
    { text: "User", value: "userName" },
    { text: "Created", value: "dateCreated" },
    { text: "PhotoCount", value: "photoCount" },
    ],
    //table options
    page: 0,
    pageCount: 6,
    totalLength: 0,
    options: {},
    filterOptions: [
      {name: 'User', value: ""},
    ],
  }),
  mounted(){
    this.getDataFromApi();
  },
  methods: {
    searchChange: _.debounce(function () {
      this.getDataFromApi();
    }, 400),
    handleClick(value){   //Redirects the user to the view batch component
      this.$store.commit("photos/setBatchId", value.batchId);
      this.$router.push(`/photobatches/upload`);
    },
    async getDataFromApi() {
      this.loading = true;

      let body = _.clone(this.options);
      body.query = [
        { field: "name", operator: "contains", value: this.search },
        { field: "photobatch.userid", operator: "contains", value: this.search },
      ];

      axios
        //.get(`${PHOTO_BATCH_URL}`)
        .post(`${PHOTO_BATCH_URL}/search`, body)
        .then((resp) => {
          this.batches = resp.data.data;
          // TODO include user names, for now using placeholder
          this.batches = this.batches.map((x) => { 
            x.dateCreated = this.formatDate(x.dateCreated);
            x.userName = 'Placeholder (User ID ' + x.userName +')';
            return x;
          });
          this.totalLength = resp.data.meta.item_count;
        })
        .catch((err) => console.error('Error in getDataFromApi: '+ err))
        .finally(() => {
          this.loading = false;
        });
      },
    formatDate (date) {
        if (!date) return null
        date = date.substr(0, 10);
        const [year, month, day] = date.split('-')
        return `${month}/${day}/${year}`
    },
    saveDialog(batchName) {
      // TODO replace userId once we have those
      let body = { name: batchName, userId: 99 }
      axios
        .post(`${PHOTO_BATCH_URL}`, body)
        .then((resp) => {
          this.$store.commit("photos/setBatchId", resp.data.data[0].id);
          this.$router.push(`/photobatches/upload`);
          this.$emit("showSucess", 'Batch added');
        })
        .catch((err) => {
          this.$emit("showError", err);
        });
    },
  },
  computed:{
      filteredData(){// returns a filtered array depending on the selected filters and search
          if(this.filterOptions){
            let filters = JSON.parse(JSON.stringify(this.filterOptions));
            let data = JSON.parse(JSON.stringify(this.batches));
            
            // Filter by user filter
            data =
              filters[0].value == null || filters[0].value == ""
                ? data
                : data.filter((x) =>
                    x.userName
                      ? x.userName.toLowerCase().includes(
                          filters[0].value.toLowerCase()
                        )
                      : false
                  );  
            // Filter by search field
            /*data =
              this.search == null || this.search == ""
                ? data
                : data.filter((x) =>
                    x.name
                      ? x.name.toLowerCase().includes(
                          this.search.toLowerCase()
                        )
                      : false
                  );  */
            return data;
          }
          else{
            return this.batches;
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