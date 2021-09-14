<template>
  <div>
    <v-app-bar color="primary" dark flat>
      <v-btn color="primary" @click="goBack()">
        <v-icon>mdi-arrow-left-drop-circle</v-icon>
        <div class="ml-2">Back to Sites</div>
      </v-btn>
      <!--  <v-spacer></v-spacer>
      <v-btn color="primary" @click="goToSummary()">
        <v-icon>mdi-book-open-variant</v-icon>
        <div class="ml-2">
          <v-toolbar-title> View site: {{ site }} </v-toolbar-title>
        </div>
      </v-btn> -->
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
      <router-view id="sites-router" />
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
    dialog: false, //tells the print dialog when to show itself
  }),
  created() {
   /*  this.items = [
      {
        name: "Summary",
        icon: "mdi-note-text-outline",
        route: `/sites/${this.selectedId}/summary`,
      },
      {
        name: "Location",
        icon: "mdi-map-check",
        route: `/sites/${this.selectedId}/location`,
      },
      {
        name: "Dates & Condition",
        icon: "mdi-calendar-range",
        route: `/sites/${this.selectedId}/dates_&_condition`,
      },
      {
        name: "Themes & Function",
        icon: "mdi-shape",
        route: `/sites/${this.selectedId}/themes_&_function`,
      },
      {
        name: "Associations",
        icon: "mdi-account-group",
        route: `/sites/${this.selectedId}/associations`,
      },
      {
        name: "Legal & Zoning",
        icon: "mdi-script-text-outline",
        route: `/sites/${this.selectedId}/legal_&_zoning`,
      },
      {
        name: "Photos",
        icon: "mdi-image",
        route: `/sites/${this.selectedId}/photos`,
      },
      {
        name: "Management",
        icon: "mdi-hammer-wrench",
        route: `/sites/${this.selectedId}/management`,
      },
      {
        name: "Description",
        icon: "mdi-alphabetical",
        route: `/sites/${this.selectedId}/description`,
      },
    ]; */
  },
  methods: {
    goBack() {
      this.$router.push("/sites");
    },
    goToSummary() {
      this.$router.push(`/sites/${this.selectedId}/summary`);
    },
    showDialog() {
      this.dialog = true;
    },
    closeDialog() {
      this.dialog = false;
    },
  },
};
</script>


<style scoped>
.list-menu {
  padding: 0px 8px 0px 0px;
}
</style>