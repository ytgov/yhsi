<template>
  <div class="d-flex">
    <SiteFormsSidebar :site-id="id" />
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
        <Summary
          id="summary"
          :place-id="id"
        />
        <Location id="location" />
        <Dates id="dates-and-condition" />
        <Themes id="themes-and-function" />
        <Associations id="associations" />
        <LegalAndZoning id="legal-and-zoning" />
        <Photos id="photos" />
        <Management id="management" />
        <Description id="description" />
      </div>
    </div>
  </div>
</template>

<script>
import { applicationName } from '@/config';

import Associations from '@/components/Sites/site-forms/Associations';
import Dates from '@/components/Sites/site-forms/Dates';
import Description from '@/components/Sites/site-forms/Description';
import LegalAndZoning from '@/components/Sites/site-forms/LegalAndZoning';
import Location from '@/components/Sites/site-forms/Location';
import Management from '@/components/Sites/site-forms/Management';
import Photos from '@/components/Sites/site-forms/Photos';
import PrintDialog from '@/components/Sites/SiteFormsPrintDialog';
import SiteFormsSidebar from '@/components/Sites/SiteFormsSidebar';
import Summary from '@/components/Sites/site-forms/Summary';
import Themes from '@/components/Sites/site-forms/Themes';

export default {
  name: 'SiteForms',
  components: {
    Associations,
    Dates,
    Description,
    LegalAndZoning,
    Location,
    Management,
    Photos,
    PrintDialog,
    SiteFormsSidebar,
    Summary,
    Themes,
  },
  props: {
    id: {
      type: [Number, String],
      required: true,
    },
  },
  data: () => ({
    siteName: applicationName,
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
      this.$emit('showError', msg);
    },
    showSuccess: function (msg) {
      this.$emit('showSuccess', msg);
    },
    showAPIMessages: function (msg) {
      this.$emit('showAPIMessages', msg);
    },
  },
};
</script>

<style scoped>
.list-menu {
  padding: 0px 8px 0px 0px;
}
</style>
