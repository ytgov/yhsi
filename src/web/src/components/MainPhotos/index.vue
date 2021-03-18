<template>
 <div>
   <v-app-bar
      color="primary"
      dark
      flat    
    >
      <v-btn color="primary" @click="goBack()">
        <v-icon>mdi-arrow-left-drop-circle</v-icon>
        <div class="ml-2">
           Back to Photos
        </div>
      </v-btn>
      <v-spacer></v-spacer>
      <v-btn color="primary" @click="goToFeature()">
        <v-icon>mdi-image-edit</v-icon>
        <div class="ml-2">
          <v-toolbar-title> Edit Photo </v-toolbar-title>
        </div>
      </v-btn>
      <v-spacer></v-spacer>
      <Search :data="photos"/>
      <v-btn color="primary" @click="showDialog()">
        <v-icon class="mr-2">mdi-printer</v-icon> 
        <div>
          Print Record
        </div>
      </v-btn>
    </v-app-bar>
    <PrintDialog :dialog="dialog" :photoname="'Photo Name'" @closeDialog="closeDialog"/>
    <div>
      <v-row>
        <v-col>
          <router-view id="sites-router"/> 
        </v-col>
        <v-col cols="2">
          <v-list shaped class="list-menu">
            <v-list-item-group
              v-model="selectedItem"
              color="primary"
            >
              <v-list-item
                v-for="(item, i) in items"
                :key="i"
                :to="item.route"
              >
                <v-list-item-icon>
                  <v-icon v-text="item.icon"></v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title v-text="item.name"></v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list-item-group>
          </v-list>
        </v-col>
      </v-row>
    </div>
  </div>
</template>

<script>
import PrintDialog from "./PrintDialog";
import Search from "./PhotosComponents/Search";
export default {
  name: "Photos",
  components: { PrintDialog, Search },
  data: () => ({
    site: 'site name',
    items: null,
    selectedItem: null,
    dialog: false, //tells the print dialog when to show itself,
    photos: []
  }),
  created(){
    this.items = [
      {name: "Feature", icon: 'mdi-note-text-outline', route: `/photos/${this.param}/feature`},
      {name: "Site Record", icon: 'mdi-map-check', route: `/photos/${this.param}/site_record`},
      {name: "Historic Sites", icon: 'mdi-calendar-range', route: `/photos/${this.param}/historic_sites`},
      {name: "Photo", icon: 'mdi-shape', route: `/photos/${this.param}/photo`},
    ];
    this.getDataFromApi();
  },
  methods: {
    getDataFromApi() {
      for(let i =0; i<12; i++){
        this.photos.push({id: i, name: `photo-${i+1}.png`, photo: `https://picsum.photos/500/300?image=${i * 5 + 10}`, date: new Date(2019,2,(Math.floor(Math.random() * 30)+1)), rating: (Math.floor(Math.random() * 6))});
      }
    },
    goBack(){
      this.$router.push('/photos');
    },
    goToFeature(){
      this.$router.push(`/photos/${this.param}/feature`);
    },
    showDialog(){
      this.dialog =  true;
    },
    closeDialog(){
      this.dialog = false;
    }
  },
  computed: {
    param() {
        return this.$route.params.id;
    }
  }
};
</script>


<style scoped>
.list-menu{
  padding: 0px 8px 0px 0px;
}

</style>