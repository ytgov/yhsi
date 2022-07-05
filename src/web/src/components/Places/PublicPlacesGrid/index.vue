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
              item = { ...item, ThumbFile: { base64: 'data:image/png;base64,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M1qAAAikIpB7icsuIKnIO45bagrpiAnNfRNQeMDyjQD92Qnkuj+pF5DcFd4emmgBAiCgiUBOFRKVApKTAzQFPmwFARDwS0D7AViNgOSaAvoNx7J7QzWpbP9rnr3W/U28gGhXaM1BDdtBgAlAmOPGgaYKi0gB0QQwbmhhNBAAgZIISD9ANxcQT8cTHSmcp8mWtAIw12AEokVjtIGCoQrScQgs2v6iYnMBaega6QrbcHriHg8R9OImGcUgOSTlWBIFfPGDSKrQJBEQSQCKj0YAAAEQSErg448/plVWWYXWX3/9cXZ88cUX1Gq1zNfE68cff6Q///yTZs6cSXwI5z2103ZkZGTK+Sxbtoy+/PJL2myzzbpt/vnnH/rll1/GPTNt2jRabbXVuj/7448/6JtvvqGNNtqIVl555e7PowmIjhJV0jjC4CAAAoUR+Pzzz2njjTemSy+9lObPn29mzxv1XnvtRZ999pn5/uijj6bbb7+dVlppJfr777/pkEMOoccff9zc22qrrejFF18kFo1ONYd/3hGT4eHhcUQfeOABOvHEE+nXX3/t/vy9996jbbbZZly7/fbbj5588knzsyuuuIIuvvhi8/8sWDzetttua74PLiAoUTVdEbkWKHKdV1N/4/nKBJSHEB+qd955Z3rrrbeMgMybP5+GiOiggw6iH374gR599FGTLey+++500003mY3/uuuuM0Lz/PPP05w5c2jfffelrbfemh588MEutn4VHhaju+66i+677z7TrldAHnnkEbrooovM/c61xhpr0Kabbmps23777enOO+8kFpWzzz6bnnvuOfruu++Is5QgAoISVeUlkHlD5Ss8c+9gemkJzJs3z5zyuSR04IEHGmH46aefaO2116Znn32W9txzT2PgoYceagTl5Zdfps0339xkICw4fN144410yimnmOzjqKOOMmWw66+/3tw7+eSTTWnqsssuo4ceeojeeOMN+uqrr+jrr78eJyBXX301vf/++11x6aVy1llnGRF55ZVXzI9HR0dN1vPCCy/QHnvs4U9AUKKyBSM2Uxsh3AeBUgiwGOy22270ySef0AknnGDEggXktddeo5122sls/KuvvrrBcckll9C1115L7fZimjZt2IgOZwN8cTbA5S7uh9+ZsBCxWPC7jiOPPJLefPNNk0F09mcWnGuuuca05TIXl7g4s3nppZfM9/w+5JhjjqHDDjuMZs2aRXvvvbcpb1111VVmPH4Xsuqqq9Jtt91Gxx13XHMBQYlKeMhDt4Q7aLB5cF8E90WGvGTJElMeuvLKK80mvOuuu3YFhN9RHHHEEfTvv//S0BAXtMiUj4499liTOXCG8eqrr9KOO+5o7nXeoXCWsN1229Gpp55K99xzj7nHZakLLrhgHEAuhZ177rn04YcfmqyF353wO5aff/6ZLr/8cpPp8H95nNdff5022GADOu200+j888/v9sMZEvfL2UmtElYWJarIQRNhGYwNkeu8ogEsZCDESTJHc2npmWeeoRtuuMG8GOeNmN9jnHTSSaacxRnIokWLaPbs2cZGbnfHHXeYDX369OnmBTq/J+Hrgw8+MM+yGHDG0CmB8ctu7mPiS3QWkPPOO69bwuLnFi5cSEuXLqV11lnHZCEPP/ywyUL402FnnnmmKZtx1tK5WNieeOIJOuCAA6oLiKYSVQlrQ8sctdgZejcBh9CE9fR/xhlnGDHoXJw9rLXWWkY47r33XlMi6pSeuA0LDpeWbrnlFvPS/eCDD6ZzzjnHPL5gwQKTUXz77bfm+9NPP928DP/tt9/Mps8vvXuviQLCwsEv1vlFfeeTXGzb8ccfb16U33rrrfT2228bweCLf7beeuuZdymcpVgzEJSo9AQmLAUBENBHgN8zsDB0PsbL7yw4G2AheOqpp0xJ6/7776fDDz+cLrzwQpONsMBwuYlLYPzszTffbNryuxHe7D/66COTaXCGwi+9O9dEAeGf8/gsOPxinIWBBYs/YcUv19955x0jJk8//TRtsskmJlviPvkdCmcifQUkixKVvjiCxSAAAgUSmCggvPnzJ5y4HMUXv4PofLKKP367//77m/cgfO2www6mHMb/PoTfq+yzzz509913m+932WUXU6riT1ixIPDFQsMZS+/HeN99913zIp//y9eGG25Ijz32GG255Za0ePFik8Vwn3ytueaaRmi22GIL831XQPgzxVX+IUqB/sWUQQAEQCAqAS5ZffrppzR37lzif5Mx8eIX6vz+hMtJvi7+B4x8rbvuuqbv3ouzHX5hz+9IOPPo/ENFfs8yNDo6upzfccyYMcN8TXzx4svAlP2gBp2SPsYGARDIhQBrBb874S/Wiv8DKhFeHnyZ+/wAAAAASUVORK5CYII=' } }
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