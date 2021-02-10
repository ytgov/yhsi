<template>
 <v-card>
    <v-toolbar
      flat
      color="primary"
      dark
    >
      <v-toolbar-title><v-icon>mdi-book-open-variant</v-icon> View site: {{site}}</v-toolbar-title>
    </v-toolbar>
    <div>
      <v-row>
        <v-col>
          <router-view id="sites-router"/> 
        </v-col>
        <v-col cols="2">
          <v-list shaped>
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
    

  </v-card>
</template>

<script>
/*
import formSummary from './SitesFormSubComponents/SitesFormSummary.vue';
import formLocation from './SitesFormSubComponents/SitesFormLocation.vue';/*
import formDates from './SitesFormSubComponents/SitesFormDates.vue';
import formThemes from './SitesFormSubComponents/SitesFormThemes';
*/
export default {
  name: "sitesForm",
  components:{
   // formSummary, formLocation//, formDates, formThemes
  },
  data: () => ({
    site: '',
    items: null,
    selectedItem: null

  }),
  created(){
      this.items = [
        {name: 'Summary', icon: 'mdi-view-dashboard', route: `/sites/${this.param}/summary`},
        {name: "Location", icon: 'mdi-view-dashboard', route: `/sites/${this.param}/location`},
        {name: "Dates & Condition", icon: 'mdi-view-dashboard', route: `/sites/${this.param}/dates`},
        {name: "Themes & Function", icon: 'mdi-view-dashboard', route: `/sites/${this.param}/themes`},
        {name: "Associations", icon: 'mdi-view-dashboard', route: `/sites/${this.param}/associations`},
        {name: "Legal & Zoning", icon: 'mdi-view-dashboard', route: `/sites/${this.param}/legal_&_zoning`},
        {name: "Photos", icon: 'mdi-view-dashboard', route: `/sites/${this.param}/photos`},
        {name: "Management", icon: 'mdi-view-dashboard', route: `/sites/${this.param}/management`},
        {name: "Description", icon: 'mdi-view-dashboard', route: `/sites/${this.param}/description`},
    ]
  },
  methods: {

  },
  computed: {
    param() {
        return this.$route.params.id;
    }
}
}
</script>


<style scoped>
.tabs-left{
    display: flex;
    flex-flow: row-reverse;
}
.v-tab{
  justify-content: left;
}
.modTabs{
  display: flex;
  flex-direction: row;

}
</style>