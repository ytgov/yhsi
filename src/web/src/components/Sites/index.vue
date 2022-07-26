<template>
  <div>
    <v-app-bar color="primary" dark flat>
      <v-btn color="primary" to="/sites" exact>
        <v-icon>mdi-arrow-left-drop-circle</v-icon>
        <div class="ml-2">Back to Sites</div>
      </v-btn>
      <v-spacer></v-spacer>
      {{ siteName }}
      <v-spacer></v-spacer>
      <v-btn color="primary" @click="showDialog()">
        <v-icon class="mr-2">mdi-printer</v-icon>
        <div>Print Site</div>
      </v-btn>
    </v-app-bar>
    <PrintDialog
      :dialog="dialog"
      :sitename="siteName"
      @closeDialog="closeDialog"
      v-on:showError="showError"
      v-on:showSuccess="showSuccess"
      v-on:showAPIMessages="showAPIMessages"
    />
    <div>
      <router-view
        id="sites-router"
        v-on:showError="showError"
        v-on:showSuccess="showSuccess"
        v-on:showAPIMessages="showAPIMessages"
      />
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
    siteName: "",
    dialog: false, //tells the print dialog when to show itself
  }),
  created() {},
  methods: {
    showDialog() {
      this.dialog = true;
    },
    closeDialog() {
      this.dialog = false;
    },
    showError: function (msg) {
      this.$emit("showError", msg);
    },
    showSuccess: function (msg) {
      this.$emit("showSuccess", msg);
    },
    showAPIMessages: function (msg) {
      this.$emit("showAPIMessages", msg);
    },
  },
};
</script>


<style scoped>
.list-menu {
  padding: 0px 8px 0px 0px;
}
</style>