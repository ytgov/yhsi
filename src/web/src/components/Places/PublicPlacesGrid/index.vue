<template>
  <div>
    <v-app-bar color="white" flat dark>
      <v-toolbar-title class="black--text mr-2"> List of Historic Places {{this.filterText}} {{this.photoCountText}}</v-toolbar-title>
      <v-spacer></v-spacer>
    </v-app-bar>

    <v-container grid-list-xs>
      <v-row v-if="!loading">
        <v-col
          v-for="(item, i) in photos"
          :key="`photo-${i}`"
          class="child-flex"
          cols="4"
        >
          <div style="min-height: 48px;">{{item.primaryName || ''}}</div>
          <v-hover>
            <template v-slot:default="{ hover }">
              <v-card class="mx-auto">
                <v-img
                  :src="item.ThumbFile.base64"
                  :lazy-src="item.ThumbFile.base64"
                  class="white--text align-end"
                  aspect-ratio="1"
                >
                </v-img>

                <v-card-actions>
                  <v-card-subtitle
                    v-if="selectedSorter == 0"
                    v-text="item.caption || ''"
                  ></v-card-subtitle>
                  <v-card-subtitle
                    v-else
                    v-text="item.caption  || ''"
                  ></v-card-subtitle>
                </v-card-actions>

                <v-fade-transition>
                  <v-overlay v-if="hover" absolute color="#036358">
                    <v-btn @click="handleClick(item)">View Place</v-btn>
                  </v-overlay>
                </v-fade-transition>
              </v-card>
            </template>
          </v-hover>
        </v-col>
      </v-row>
      <v-row v-if="loading">
        <div class="loading">Loading...</div>
      </v-row>
      <v-row class="mb-2" v-if="!loading">
        <v-col>
          <div class="text-center">
            <v-pagination
              v-model="page"
              :length="numberOfPages"
              :total-visible="5"
            ></v-pagination>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
// import Breadcrumbs from "../../Breadcrumbs.vue";
import axios from "axios";
//import Search from "../PhotosComponents/Search";
// import QueryMultiSelect from "./QueryMultiSelect";
// import SaveDialog from "../SaveDialog";
import { PLACE_URL } from "../../../urls";
// import VueQueryBuilder from 'vue-query-builder';
// import Vue from "vue";
import placeholderBase64 from '../../../assets/no_photo_base64';
import { mapGetters, mapActions } from 'vuex';
import { get } from 'lodash';

export default {
  name: "Grid",
  components: {
    // VueQueryBuilder,
    // SaveDialog
  },
  data: () => ({
    search: "",
    selectedSorter: 0,
    sortOptions: [
      // { name: "Feature name" },
      // { name: "Rating" },
      // { name: "Age" },
    ],
    photos: [],
    sortedData: [],
    numberOfPages: 10,
    page: 1,
    totalLength: 0,
    page_size: 12,
    loading: true,
    queryRules: [],
    queryBuilder: { children: []},
    queryLabels: {
      "matchType": null,
      "matchTypes": [{}],
      "addRule": "Add Filter",
      "removeRule": "&times;",
      "textInputPlaceholder": "",
    },
    queryBody: {},
    filterText: null,
    showFilterSection: false,
    savedFilters: [],
  }),
  watch: {
    selectedSorter: {
      handler() {
        // this.sortData();
      },
      deep: true,
    },    
    page() {
      this.getDataFromApi();
    },
  },
  mounted() {
    // Get search text when searching from view screen
    if(this.$store.getters["photos/searchText"]) {
      this.search = this.$store.getters["photos/searchText"];
    }

    this.loadProfile();
    this.getDataFromApi();
  },
  methods: {
    handleClick(value) {
      //Redirects the user to the site form
      this.$router.push({name: 'placeView', params: { id: value.id, name: value.primaryName}});
    },
    getDataFromApi() {  
      this.loading = true;
      this.buildQueryBody();

      axios
        .get(`${PLACE_URL}/public-places`)
        .then((resp) => {
          console.log(resp);
          
          const placesThumbs = get(resp, 'data.data', []);

          this.photos = placesThumbs.map((item) => {

            if(get(item, 'ThumbFile.data', '')) {
              item.ThumbFile.base64 = `data:image/png;base64,${this.toBase64(item.ThumbFile.data)}`;
            } else {
              item = { ...item, ThumbFile: { base64: placeholderBase64 } }
            }
            
            console.log(item);
            return item;
          });
          
          this.totalLength = resp.data.meta.item_count;
          this.numberOfPages = resp.data.meta.page_count;
          this.page_size = resp.data.meta.page_size;
        })
        .catch((err) => console.error('Error in getDataFromApi: '+ err))        
        .finally(() => {
          this.loading = false;
        });
    },

    toBase64(arr) {
      return btoa(
        arr.reduce((data, byte) => data + String.fromCharCode(byte), "")
      );
    },

    runQuery() {
      this.getDataFromApi();
    },

    buildQueryBody() {
      this.queryBody = { query: [] }
      if (this.search) {
        this.queryBody.query.push({ field: "featureName", operator: "contains", value: this.search });
      }
      if (this.queryBuilder.children) {      
        this.queryBuilder.children.forEach((x) => {          
          let rule = {};
          rule.field = x.query.rule;
          if (rule.field == 'legacyBatchInfo') {
            rule.operator = x.query.operator == 'includes' ? 'contains' : 'notcontains';
            rule.value = x.query.value;
          } else {
            rule.operator = x.query.operator == 'includes' ? 'in' : 'notin';
            rule.value = x.query.value.join(',');
          }
          this.queryBody.query.push(rule);
        });
      }
      this.queryBody.page = this.page;
    },

    saveDialog(filterName) {
      let query = JSON.stringify(this.queryBuilder.children);
      let body = { userId: this.currentUserId, name: filterName, resultType: "Photo", value: query}
      axios
        .post(`${PLACE_URL}/saved-filter`, body)
        .then(() => {
          this.filterText = ' - '+ filterName;
          this.getDataFromApi();
          this.$store.commit("alerts/setText",'Filter saved');
          this.$store.commit("alerts/setType", "success");
          this.$store.commit("alerts/setTimeout", 5000);
          this.$store.commit("alerts/setAlert", true);
        })
        .catch((err) => {            
          this.$store.commit("alerts/setText",err);
          this.$store.commit("alerts/setType", "warning");
          this.$store.commit("alerts/setTimeout", 5000);
          this.$store.commit("alerts/setAlert", true);
        });
    },
    
    ...mapActions({
      loadProfile: 'profile/loadProfile',
    }),

  },
  computed: {
    sortByName: function () {
      return this.photos
        .slice()
        //.filter((a) => a.featureName.toLowerCase().includes(this.search.toLowerCase()))
        .sort((a, b) => (!a.featureName || !b.featureName ? 0
          : a.featureName.toLowerCase() > b.featureName.toLowerCase() ? 1 
          : b.featureName.toLowerCase() > a.featureName.toLowerCase() ? -1 
          : 0));
    },
    sortByRating: function () {
      return this.photos
        //.filter((a) => a.featureName.toLowerCase().includes(this.search.toLowerCase()))
        .slice()
        .sort((a, b) =>
          !a.rating || !b.rating ? 0
          : a.rating > b.rating ? 1 : b.rating > a.rating ? -1 : 0
        );
    },
    sortByAge: function () {
      //let photos =JSON.parse(JSON.stringify(this.photos));
      return this.photos
        //.filter((a) => a.featureName.toLowerCase().includes(this.search.toLowerCase()))
        .slice()
        .sort((a, b) =>
          !a.dateCreated || !b.dateCreated ? 0
          : a.dateCreated > b.dateCreated ? 1 : b.dateCreated > a.dateCreated ? -1 : 0
        );
    },
    queryBuilderEmpty: function () {
      return !this.queryBuilder.children || this.queryBuilder.children.length === 0;
    },
    photoCountText: function () {
      return this.totalLength ? '('+this.totalLength+')' : '(0)' ;
    },
    showFiltersText: function () {
      return this.showFilterSection ? 'Hide Filters' : 'Show Filters';
    }, 
    ...mapGetters({
      currentUserId: 'profile/id',
    }),
  },
};
</script>

<style scoped>
  .loading {
    font-size: 18px;
    color: #979797 !important;
    margin: auto;
    margin-top: 5%;
  }
</style>

<style>
  /* Custom CSS for the query builder */
  .vqb-group-heading {
    display: none;
  }
  .vqb-custom-component-wrap {
    display: inline-block;
  }
  .vue-query-builder .vqb-group-body.card-body {
    padding-top: 0;
    padding-right: 1.25rem;
    padding-left: 1.25rem;
    padding-bottom: 1.25rem;
  }
  .vue-query-builder select.form-control {
    padding: 9px 8px;
    border: 1px solid grey;
    background-color: white;
    color: rgba(0,0,0,.87);
    border-radius: 4px;
    cursor: pointer;
    appearance: button;
  }
  .vue-query-builder select.form-control:hover {
    border: 1px solid black;
  }
  .vue-query-builder input.form-control {
    padding: 9px 8px;
    border: 1px solid grey;
    background-color: white;
    color: rgba(0,0,0,.87);
    border-radius: 4px;
    line-height: 19px;
  }
  .vue-query-builder button.btn {
    height: 36px;
    min-width: 64px;
    padding: 0 16px;
    background-color: #2196f3;
    border: 1px #2196f3 solid;
    border-radius: 4px;
    color: white;
    letter-spacing: 1.42857px;
    margin-right: 5px;
  }
  .vue-query-builder button.btn:hover {
    background-color: #42a5f3;
    border: 1px #42a5f3 solid;
  }
  .vqb-rule {
    margin-top: 15px;
    margin-bottom: 15px;
    background-color: #fff9ea;
    border-color: #ddd;
    padding: 9px 18px;
    border: 1px solid #ddd;
    border-radius: 4px;
  }
  .vue-query-builder .close {
    color: #969696;
    font-size: 1.5rem;
    font-weight: 700;
    padding: 0 13px;
  }
  .vue-query-builder .close:hover {
    color: #6a6a6a;
  }
</style>