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
      <v-btn color="primary" @click="handleClick('23')">
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
        <v-hover>
          <template v-slot:default="{ hover }">
            <v-card
              class="mx-auto"
              
            >
              <v-img
                :src="item.photo"
                :lazy-src="item.photo"
                class="white--text align-end"
                gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)"
              >
              </v-img>

              <v-card-actions>
                <v-card-subtitle v-if="selectedSorter == 0" v-text="item.name"></v-card-subtitle>
                <v-card-subtitle v-else-if="selectedSorter == 1" v-text="`Rating: ${item.rating}`"></v-card-subtitle>
                <v-card-subtitle v-else v-text="`Photo taken, ${new Date(item.date).toLocaleDateString()}`"></v-card-subtitle>
              </v-card-actions>

              <v-fade-transition>
                <v-overlay
                  v-if="hover"
                  absolute
                  color="#036358"
                >
                  <v-btn @click="handleClick(i)">Edit Photo</v-btn>
                </v-overlay>
              </v-fade-transition>
            </v-card>
          </template>
        </v-hover>
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
      for(let i =0; i<12; i++){
        this.photos.push({name: `photo-${i+1}.png`, photo: `https://picsum.photos/500/300?image=${i * 5 + 10}`, date: new Date(2019,2,(Math.floor(Math.random() * 30)+1)), rating: (Math.floor(Math.random() * 6))});
      }
      this.sortedPhotos = JSON.parse(JSON.stringify(this.photos));
      this.sortSelect('Feature name');
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
        return this.photos.slice().sort((a,b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0));
    },
    sortByRating(){
        return this.photos.slice().sort((a,b) => (a.rating > b.rating) ? 1 : ((b.rating > a.rating) ? -1 : 0));
    },
    sortByAge(){
      //let photos =JSON.parse(JSON.stringify(this.photos));
        return this.photos.slice().sort(((a, b) => b.date - a.date));
    }
  }
};
</script>
