<template>
  <div class="d-flex">
    <SiteFormsSidebar :site-id="id" />
    <div>
      <v-app-bar
        color="primary"
        dark
        flat
      >
        <v-btn
          color="primary"
          to="/sites"
          exact
        >
          <v-icon>mdi-arrow-left-drop-circle</v-icon>
          <div class="ml-2">Back to Sites</div>
        </v-btn>
        <v-spacer />
        <v-progress-circular
          v-if="loading"
          indeterminate
          size="20"
          width="2"
        />
        <span v-else>
          {{ siteName }}
        </span>
        <v-spacer />
        <v-btn
          color="primary"
          @click="showDialog"
        >
          <v-icon class="mr-2">mdi-printer</v-icon>
          <div>Print Site</div>
        </v-btn>
      </v-app-bar>
      <PrintDialog
        :dialog="dialog"
        :sitename="siteName"
        @closeDialog="closeDialog"
        @showError="showError"
        @showSuccess="showSuccess"
        @showAPIMessages="showAPIMessages"
      />
      <div>
        <template v-if="loading">
          <v-skeleton-loader
            v-for="n in 6"
            :key="n"
            type="card"
          />
        </template>
        <template v-else>
          <component
            :is="summaryComponent"
            id="summary"
            :place-id="id"
          />
          <component
            :is="locationComponent"
            id="location"
            :place-id="id"
          />
          <component
            :is="datesComponent"
            id="dates-and-condition"
            :place-id="id"
          />
          <component
            :is="themesAndFunctionsComponent"
            id="themes-and-function"
            :place-id="id"
          />
          <component
            :is="associationsComponent"
            id="associations"
            :place-id="id"
          />
          <component
            :is="legalAndZoningComponent"
            id="legal-and-zoning"
            :place-id="id"
          />
        </template>
        <Photos id="photos" />
        <Management id="management" />
        <Description id="description" />
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import goTo from 'vuetify/lib/services/goto';

import AssociationsSiteFormEditor from '@/components/Sites/site-forms/AssociationsSiteFormEditor';
import AssociationsSiteFormViewer from '@/components/Sites/site-forms/AssociationsSiteFormViewer';
import DatesAndConditions from '@/components/Sites/site-forms/DatesAndConditions';
import DatesAndConditionsViewer from '@/components/Sites/site-forms/DatesAndConditionsViewer';
import Description from '@/components/Sites/site-forms/Description';
import LegalAndZoning from '@/components/Sites/site-forms/LegalAndZoning';
import LegalAndZoningViewer from '@/components/Sites/site-forms/LegalAndZoningViewer';
import Location from '@/components/Sites/site-forms/Location';
import LocationReadonly from '@/components/Sites/site-forms/LocationReadonly';
import Management from '@/components/Sites/site-forms/Management';
import Photos from '@/components/Sites/site-forms/Photos';
import PrintDialog from '@/components/Sites/SiteFormsPrintDialog';
import SiteFormsSidebar from '@/components/Sites/SiteFormsSidebar';
import Summary from '@/components/Sites/site-forms/Summary';
import SummaryReadonly from '@/components/Sites/site-forms/SummaryReadonly';
import ThemesAndFunctions from '@/components/Sites/site-forms/ThemesAndFunctions';
import ThemesAndFunctionsViewer from '@/components/Sites/site-forms/ThemesAndFunctionsViewer';

export default {
  name: 'SiteForms',
  components: {
    AssociationsSiteFormEditor,
    AssociationsSiteFormViewer,
    DatesAndConditions,
    DatesAndConditionsViewer,
    Description,
    LegalAndZoning,
    LegalAndZoningViewer,
    Location,
    LocationReadonly,
    Management,
    Photos,
    PrintDialog,
    SiteFormsSidebar,
    Summary,
    SummaryReadonly,
    ThemesAndFunctions,
    ThemesAndFunctionsViewer,
  },
  props: {
    id: {
      type: [Number, String],
      required: true,
    },
  },
  data: () => ({
    dialog: false, //tells the print dialog when to show itself
  }),
  computed: {
    ...mapGetters('places', {
      hasPendingChanges: 'hasPendingChanges',
      loading: 'loading',
      siteName: 'primaryName',
    }),
    associationsComponent() {
      if (this.hasPendingChanges) return AssociationsSiteFormViewer;

      return AssociationsSiteFormEditor;
    },
    datesComponent() {
      if (this.hasPendingChanges) return DatesAndConditionsViewer;

      return DatesAndConditions;
    },
    legalAndZoningComponent() {
      if (this.hasPendingChanges) return LegalAndZoningViewer;

      return LegalAndZoning;
    },
    locationComponent() {
      if (this.hasPendingChanges) return LocationReadonly;

      return Location;
    },
    summaryComponent() {
      if (this.hasPendingChanges) return SummaryReadonly;

      return Summary;
    },
    themesAndFunctionsComponent() {
      if (this.hasPendingChanges) return ThemesAndFunctionsViewer;

      return ThemesAndFunctions;
    },
  },
  mounted() {
    this.initializePlace(this.id).then((place) => {
      this.addSiteHistory(place);
      if (this.$route.hash) {
        goTo(this.$route.hash, { offset: 75 });
      }
    })
    .catch(err => {
      console.log("ERROR LOADING PLACE", err.message)
      this.$router.push("/sites")
    });
  },
  methods: {
    ...mapActions({
      initializePlace: 'places/initialize',
      addSiteHistory: 'addSiteHistory',
    }),
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
