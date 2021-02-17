<template>
  <div>
    <v-app-bar
      color="primary"
      flat    
      dark
    >
      <v-toolbar-title class="mr-2"> Photos </v-toolbar-title>
      <v-menu
        transition="slide-y-transition"
        bottom
        
      >
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            color="primary"
            dark
            v-bind="attrs"
            v-on="on"
          > <v-icon>mdi-swap-vertical</v-icon>
            Sort
          </v-btn>
        </template>
        <v-list>
          <v-list-item-group
            v-model="selectedSorter"
            color="primary"
          >
            <v-list-item
              v-for="(item, i) in sortOptions"
              :key="i"
              link
              @click="sortSelect(item)"
            >
              <v-list-item-title>{{ item.name }}</v-list-item-title>
            </v-list-item>
          </v-list-item-group>
        </v-list>
      </v-menu>
      
      <v-spacer></v-spacer>
      <v-btn color="primary" @click="showDialog()">
         <v-icon>mdi-plus</v-icon>
        <div>
          Add Photo
        </div>
      </v-btn>
    </v-app-bar>
  <v-container grid-list-xs>
    <v-text-field v-model="search" label="Search"></v-text-field>
    <v-row>
      <v-col
        v-for="(item, i) in sortedPhotos"
        :key="`photo-${i}`"
        class="d-flex child-flex"
        cols="2"
      >
      
        <v-card @click="handleClick(1)">
          <v-img
            :src="item.photo"
            :lazy-src="item.photo"
            class="white--text align-end"
            gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)"
          >
          </v-img>

          <v-card-actions>
            <v-card-subtitle v-text="`Photo taken, ${item.date}`"></v-card-subtitle>
          </v-card-actions>
        </v-card>
      

      </v-col>
    </v-row>
  </v-container>
    
  

  </div>
</template>

<script>

export default {
  name: "Grid",
  data: () => ({
    search: "",
    selectedSorter: 0,
    sortOptions: [
      {name: 'Feature name'},
      {name: 'Rating'},
      {name: 'Age'},
    ],
    photos: [],
    sortedPhotos: [],


  }),
  watch: {
    options: {
      handler() {
        this.getDataFromApi();
      },
      deep: true,
    },
    search: {
      handler() {
        this.getDataFromApi();
      },
      deep: true,
    },
  },
  mounted() {
    this.getDataFromApi();
  },
  methods: {
    handleClick(value){   //Redirects the user to the site form
        this.$router.push(`/photos/${value}/feature`);
    },
    getDataFromApi() {
      let images =Math.floor(Math.random() * 21);
      for(let i =0; i<images; i++){
        this.photos.push({name: `photo ${i+1}`, photo: `https://picsum.photos/500/300?image=${i * 5 + 10}`, date: '01/02/2019', rating: (Math.floor(Math.random() * 6))});
      }
      console.log(this.photos);
      this.sortedPhotos = JSON.parse(JSON.stringify(this.photos));
    },
    sortSelect(item){//this function handles the logic for the data sorter
      switch(item.name){
        case 'Feature name':
          this.sortedPhotos = this.sortByName;
          break;
        case 'Rating':
          this.sortedPhotos = this.sortByRating;
          break;
        case 'Age':
          this.sortedPhotos = this.sortByAge;
          break;
      }
    }
  },
  computed:{
    sortByName(){
      let photos =JSON.parse(JSON.stringify(this.photos));
        return photos.sort((a,b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0));
    },
    sortByRating(){
      let photos =JSON.parse(JSON.stringify(this.photos));
        return photos.sort((a,b) => (a.rating > b.rating) ? 1 : ((b.rating > a.rating) ? -1 : 0));
    },
    sortByAge(){
      let photos =JSON.parse(JSON.stringify(this.photos));
        return photos.sort((a,b) => (a.rating > b.rating) ? 1 : ((b.rating > a.rating) ? -1 : 0));
    }
  }
};
</script>
