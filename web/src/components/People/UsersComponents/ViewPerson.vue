<template>
  <v-sheet>
    <v-breadcrumbs :items="breadcrumbs"></v-breadcrumbs>

    <div class="d-flex align-center mb-4">
      <h1>{{ fields.GivenName }} {{ fields.Surname }}</h1>
      <v-spacer></v-spacer>
      <v-btn color="primary" class="mr-2" @click="goEdit">
        <v-icon class="mr-1">mdi-pencil</v-icon>
        Edit
      </v-btn>
      <v-btn color="info" @click="downloadPdf" :loading="loadingPdf">
        <v-icon class="mr-1">mdi-printer</v-icon>
        Print
      </v-btn>
    </div>

    <v-card class="default px-3 py-3 mb-4">
      <v-card-text>
        <v-row>
          <v-col cols="7">
            <v-row>
              <v-col cols="4">
                <v-text-field outlined dense background-color="white" label="Surname" :value="fields.Surname" readonly></v-text-field>
                <v-text-field outlined dense background-color="white" label="Given Name" :value="fields.GivenName" readonly></v-text-field>
              </v-col>
              <v-col cols="4">
                <v-text-field outlined dense background-color="white" label="Birth Year" :value="fields.BirthYear" readonly></v-text-field>
                <v-text-field outlined dense background-color="white" label="Death Year" :value="fields.DeathYear" readonly></v-text-field>
              </v-col>
              <v-col cols="4">
                <v-text-field outlined dense background-color="white" label="Birth Accuracy" :value="accuracyLabel(fields.BirthAccuracy)" readonly></v-text-field>
                <v-text-field outlined dense background-color="white" label="Death Accuracy" :value="accuracyLabel(fields.DeathAccuracy)" readonly></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12">
                <v-textarea outlined dense background-color="white" label="Notes" :value="fields.Notes" readonly></v-textarea>
              </v-col>
            </v-row>
          </v-col>
          <v-col cols="5">
            <GenericRecordPhotosCard
              v-if="infoLoaded"
              record="people"
              :recordId="$route.params.id"
              :showAddPhotoButton="false"
            />
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <v-card class="default px-3 py-3" v-if="infoLoaded">
      <v-card-text>
        <HistoricRecord
          mode="view"
          :personID="$route.params.id"
        />
      </v-card-text>
    </v-card>

    <v-overlay :value="loading">
      <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay>
  </v-sheet>
</template>

<script>
import people from '../../../controllers/people';
import HistoricRecord from './HistoricRecord';
import GenericRecordPhotosCard from '@/components/photos/GenericRecordPhotosCard.vue';

export default {
  name: 'ViewPerson',
  components: { HistoricRecord, GenericRecordPhotosCard },
  data: () => ({
    loading: false,
    infoLoaded: false,
    fields: {},
    loadingPdf: false,
    accuracyList: [
      { name: 'Estimated', val: 'E' },
      { name: 'Approximate', val: 'A' },
    ],
  }),
  mounted() {
    this.load();
  },
  methods: {
    async load() {
      this.loading = true;
      this.infoLoaded = false;
      this.fields = await people.getById(this.$route.params.id);
      this.infoLoaded = true;
      this.loading = false;
    },
    goEdit() {
      this.$router.push({ name: 'personEditView', params: { id: this.$route.params.id } });
    },
    accuracyLabel(val) {
      const match = this.accuracyList.find((a) => a.val === val);
      return match ? match.name : val;
    },
    async downloadPdf() {
      this.loadingPdf = true;
      const res = await people.getPdf(parseInt(this.$route.params.id));
      const blob = new Blob([res], { type: 'application/octetstream' });
      const url = window.URL || window.webkitURL;
      const link = url.createObjectURL(blob);
      const a = document.createElement('a');
      a.setAttribute('download', 'Person.pdf');
      a.setAttribute('href', link);
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      this.loadingPdf = false;
    },
  },
  computed: {
    breadcrumbs() {
      const items = [
        { text: 'Home', to: '/', exact: true },
        { text: 'People', to: '/people', exact: true },
      ];
      if (this.fields.GivenName) {
        items.push({ text: `${this.fields.GivenName} ${this.fields.Surname}` });
      }
      return items;
    },
  },
};
</script>
