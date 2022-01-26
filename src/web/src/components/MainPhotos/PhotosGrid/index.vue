<template>
  <div>
    <v-app-bar color="primary" flat dark>
      <v-toolbar-title class="mr-2"> Photos </v-toolbar-title>
      <v-menu transition="slide-y-transition" bottom>
        <template v-slot:activator="{ on, attrs }">
          <v-btn color="primary" dark v-bind="attrs" v-on="on">
            <v-icon>mdi-swap-vertical</v-icon>
            Sort
          </v-btn>
        </template>
        <v-list>
          <v-list-item-group v-model="selectedSorter" color="primary">
            <v-list-item v-for="(item, i) in sortOptions" :key="i" link>
              <v-list-item-title>{{ item.name }}</v-list-item-title>
            </v-list-item>
          </v-list-item-group>
        </v-list>
      </v-menu>
      <v-spacer></v-spacer>
      <!--<Search :data="photos" />-->
      <v-btn color="primary" @click="handleClick('add')">
        <v-icon>mdi-plus</v-icon>
        <div>Add Photo</div>
      </v-btn>
    </v-app-bar>
    <v-container grid-list-xs>
      <v-row>
        <v-col class="d-flex">
          <v-text-field
            v-model="search"
            @keyup.enter="getDataFromApi"
            label="Search"
          >
          </v-text-field>
          <v-btn @click="getDataFromApi" icon class="mt-auto mb-auto">
            <v-icon>mdi-magnify</v-icon>
          </v-btn>
        </v-col>
      </v-row>
      <v-row v-if="!loading">
        <v-col
          v-for="(item, i) in sortedData"
          :key="`photo-${i}`"
          class="d-flex child-flex"
          cols="2"
        >
          <v-hover>
            <template v-slot:default="{ hover }">
              <v-card class="mx-auto" @click="sortData()">
                <v-img
                  :src="item.thumbFile.base64"
                  :lazy-src="item.thumbFile.base64"
                  class="white--text align-end"
                  aspect-ratio="1"
                >
                </v-img>

                <v-card-actions>
                  <v-card-subtitle
                    v-if="selectedSorter == 0"
                    v-text="item.featureName"
                  ></v-card-subtitle>
                  <v-card-subtitle
                    v-else-if="selectedSorter == 1"
                    v-text="`Rating: ${item.rating}`"
                  ></v-card-subtitle>
                  <v-card-subtitle
                    v-else
                    v-text="
                      `Photo taken, ${new Date(item.dateCreated).toLocaleDateString()}`
                    "
                  ></v-card-subtitle>
                </v-card-actions>

                <v-fade-transition>
                  <v-overlay v-if="hover" absolute color="#036358">
                    <v-btn @click="handleClick('view',item.rowId)">View Photo</v-btn>
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

import axios from "axios";
//import Search from "../PhotosComponents/Search";
import { PHOTO_URL } from "../../../urls";

export default {
  name: "Grid",
  //components: { Search },
  data: () => ({
    search: "",
    selectedSorter: 0,
    sortOptions: [
      { name: "Feature name" },
      { name: "Rating" },
      { name: "Age" },
    ],
    photos: [],
    sortedData: [],
    numberOfPages: 10,
    page: 1,
    totalLength: 0,
    page_size: 12,
    loading: true,
  }),
  watch: {
    selectedSorter: {
      handler() {
        this.sortData();
      },
      deep: true,
    },    
    page() {
      this.getDataFromApi();
    },
  },
  mounted() {
    if(this.$store.getters["photos/searchText"]) {
      this.search = this.$store.getters["photos/searchText"];
    };
    this.getDataFromApi();
  },
  methods: {
    handleClick(pageState, rowId) {
      //Redirects the user to the site form
      this.$store.commit("photos/setRowId", rowId);
      this.$router.push(`/photos/${pageState}`);
    },
    getDataFromApi() {  
      this.loading = true;
      let body = {};
      body.query = [
        { field: "featureName", operator: "contains", value: this.search },
      ];
      body.page = this.page;

      axios
        .post(`${PHOTO_URL}/search`, body)
        .then((resp) => {
          this.photos = resp.data.data.map((x) => {
            x.thumbFile.base64 = `data:image/png;base64,${this.toBase64(x.thumbFile.data)}`;
            return x;
          });
          this.totalLength = resp.data.meta.item_count;
          this.numberOfPages = resp.data.meta.page_count;
          this.page_size = resp.data.meta.page_size;
          this.sortData();

        })
        .catch((err) => console.error('Error in getDataFromApi: '+ err))        
        .finally(() => {
          this.loading = false;
        });
    },

    sortData() {
      //this function handles the logic for the data sorter
      switch (this.selectedSorter) {
        case 0:
          this.sortedData = this.sortByName;
          break;
        case 1:
          this.sortedData = this.sortByRating;
          break;
        case 2:
          this.sortedData = this.sortByAge;
          break;
      }
    },
    toBase64(arr) {
      return btoa(
        arr.reduce((data, byte) => data + String.fromCharCode(byte), "")
      );
    },
  },
  computed: {
    sortByName: function () {
      return this.photos
        .slice()
        //.filter((a) => a.featureName.toLowerCase().includes(this.search.toLowerCase()))
        .sort((a, b) => (a.featureName.toLowerCase() > b.featureName.toLowerCase() ? 1 : b.featureName.toLowerCase() > a.featureName.toLowerCase() ? -1 : 0));
    },
    sortByRating() {
      return this.photos
        //.filter((a) => a.featureName.toLowerCase().includes(this.search.toLowerCase()))
        .slice()
        .sort((a, b) =>
          a.rating > b.rating ? 1 : b.rating > a.rating ? -1 : 0
        );
    },
    sortByAge() {
      //let photos =JSON.parse(JSON.stringify(this.photos));
      return this.photos
        //.filter((a) => a.featureName.toLowerCase().includes(this.search.toLowerCase()))
        .slice()
        .sort((a, b) =>
          a.dateCreated > b.dateCreated ? 1 : b.dateCreated > a.dateCreated ? -1 : 0
        );
    },
  },
};
</script>

<style scoped>
.loading {
  font-size: 18px;
  color: #979797 !important;
  margin: auto;
  margin-top: 20%;
}
</style>