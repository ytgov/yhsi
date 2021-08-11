<template>
  <div>
    <v-app-bar color="primary" dark flat>
      <v-btn color="primary" @click="goBack()">
        <v-icon>mdi-arrow-left-drop-circle</v-icon>
        <div class="ml-2">Back to Sites</div>
      </v-btn>
      <v-spacer></v-spacer>
      <v-btn color="primary" @click="goToSummary()">
        <v-icon>mdi-book-open-variant</v-icon>
        <div class="ml-2">
          <v-toolbar-title> View site: {{ site }} </v-toolbar-title>
        </div>
      </v-btn>
      <v-spacer></v-spacer>
      <v-btn color="primary" @click="showDialog()">
        <v-icon class="mr-2">mdi-printer</v-icon>
        <div>Print Site</div>
      </v-btn>
    </v-app-bar>
    <PrintDialog
      :dialog="dialog"
      :sitename="'Site Name'"
      @closeDialog="closeDialog"
    />
    <div>
      <v-row>
        <v-col>
          <router-view id="sites-router" />
        </v-col>
        <v-col cols="2">
          <v-list shaped class="list-menu">
            <v-list-item-group v-model="selectedItem" color="primary">
              <v-list-item v-for="(item, i) in items" :key="i" :to="item.route">
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
import PrintDialog from "./SitesGrid/PrintDialog";
export default {
  name: "sitesForm",
  components: {
    PrintDialog,
  },
  data: () => ({
    site: "site name",
    items: null,
    selectedItem: null,
    dialog: false, //tells the print dialog when to show itself
  }),
  created() {
    this.items = [
      {
        name: "Summary",
        icon: "mdi-note-text-outline",
        route: `/sites/${this.param}/summary`,
      },
      {
        name: "Location",
        icon: "mdi-map-check",
        route: `/sites/${this.param}/location`,
      },
      {
        name: "Dates & Condition",
        icon: "mdi-calendar-range",
        route: `/sites/${this.param}/dates_&_condition`,
      },
      {
        name: "Themes & Function",
        icon: "mdi-shape",
        route: `/sites/${this.param}/themes_&_function`,
      },
      {
        name: "Associations",
        icon: "mdi-account-group",
        route: `/sites/${this.param}/associations`,
      },
      {
        name: "Legal & Zoning",
        icon: "mdi-script-text-outline",
        route: `/sites/${this.param}/legal_&_zoning`,
      },
      {
        name: "Photos",
        icon: "mdi-image",
        route: `/sites/${this.param}/photos`,
      },
      {
        name: "Management",
        icon: "mdi-hammer-wrench",
        route: `/sites/${this.param}/management`,
      },
      {
        name: "Description",
        icon: "mdi-alphabetical",
        route: `/sites/${this.param}/description`,
      },
    ];
  },
  methods: {
    goBack() {
      this.$router.push("/sites");
    },
    goToSummary() {
      this.$router.push(`/sites/${this.param}/summary`);
    },
    showDialog() {
      this.dialog = true;
    },
    closeDialog() {
      this.dialog = false;
    },
  },
  computed: {
    param() {
      return this.$route.params.id;
    },
  },
};
</script>


<style scoped>
.list-menu {
  padding: 0px 8px 0px 0px;
}
</style>