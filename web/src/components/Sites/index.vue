<template>
 <div>
   <v-app-bar
      color="primary"
      dark
      flat
      
    >
      <v-btn color="primary" @click="goBack()">
        <v-icon class="mr-2">mdi-arrow-left-drop-circle</v-icon> 
        <div>
          Back to sites
        </div>
      </v-btn>
      <v-spacer></v-spacer>
      <v-btn icon>
        <v-icon>mdi-book-open-variant</v-icon>
      </v-btn>
      <v-toolbar-title> View site: {{site}} </v-toolbar-title>
    </v-app-bar>
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


export default {
  name: "sitesForm",
  components: {

  },
  data: () => ({
    site: 'site name',
    items: null,
    selectedItem: null
  }),
  created(){
    this.items = [
      {name: "Summary", icon: 'mdi-note-text-outline', route: `/sites/${this.param}/summary`},
      {name: "Location", icon: 'mdi-map-check', route: `/sites/${this.param}/location`},
      {name: "Dates & Condition", icon: 'mdi-calendar-range', route: `/sites/${this.param}/dates_&_condition`},
      {name: "Themes & Function", icon: 'mdi-shape', route: `/sites/${this.param}/themes_&_function`},
      {name: "Associations", icon: 'mdi-account-group', route: `/sites/${this.param}/associations`},
      {name: "Legal & Zoning", icon: 'mdi-script-text-outline', route: `/sites/${this.param}/legal_&_zoning`},
      {name: "Photos", icon: 'mdi-image', route: `/sites/${this.param}/photos`},
      {name: "Management", icon: 'mdi-hammer-wrench', route: `/sites/${this.param}/management`},
      {name: "Description", icon: 'mdi-alphabetical', route: `/sites/${this.param}/description`},
    ]
  },
  methods: {
    goBack(){
      this.$router.push('/sites');
    }
  },
  computed: {
    param() {
        return this.$route.params.id;
    }
  }
}
</script>


<style scoped>
.list-menu{
  padding: 0px 8px 0px 0px;
}

</style>