<template>
  <v-sheet>
    <v-breadcrumbs :items="breadcrumbs"></v-breadcrumbs>

    <div class="d-flex align-center mb-4">
      <h1>{{ fields.GivenName }} {{ fields.Surname }}</h1>
      <v-spacer></v-spacer>
      <v-btn outlined color="warning" class="mr-2" @click="cancel">Cancel</v-btn>
      <v-btn color="success" :disabled="!dirty" @click="save">
        <v-icon class="mr-1">mdi-check</v-icon>
        Save
      </v-btn>
    </div>

    <v-card class="default px-3 py-3 mb-4">
      <v-card-text>
        <v-row>
          <v-col cols="7">
            <v-row>
              <v-col cols="4">
                <v-text-field outlined dense background-color="white" label="Surname" v-model="fields.Surname"></v-text-field>
                <v-text-field outlined dense background-color="white" label="Given Name" v-model="fields.GivenName"></v-text-field>
              </v-col>
              <v-col cols="4">
                <v-text-field outlined dense background-color="white" label="Birth Year" v-model="fields.BirthYear"></v-text-field>
                <v-text-field outlined dense background-color="white" label="Death Year" v-model="fields.DeathYear"></v-text-field>
              </v-col>
              <v-col cols="4">
                <v-select
                  outlined dense background-color="white"
                  :items="accuracyList"
                  v-model="fields.BirthAccuracy"
                  item-text="name"
                  item-value="val"
                  label="Birth Accuracy"
                ></v-select>
                <v-select
                  outlined dense background-color="white"
                  :items="accuracyList"
                  v-model="fields.DeathAccuracy"
                  item-text="name"
                  item-value="val"
                  label="Death Accuracy"
                ></v-select>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12">
                <v-textarea outlined dense background-color="white" label="Notes" v-model="fields.Notes"></v-textarea>
              </v-col>
            </v-row>
          </v-col>
          <v-col cols="5">
            <GenericRecordPhotosCard
              v-if="infoLoaded"
              record="people"
              :recordId="$route.params.id"
              :showAddPhotoButton="true"
            />
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <v-card class="default px-3 py-3" v-if="infoLoaded">
      <v-card-text>
        <HistoricRecord
          mode="edit"
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
  name: 'EditPerson',
  components: { HistoricRecord, GenericRecordPhotosCard },
  data: () => ({
    loading: false,
    infoLoaded: false,
    dirty: false,
    fields: {},
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
      this.dirty = false;
      this.fields = await people.getById(this.$route.params.id);
      this.infoLoaded = true;
      this.loading = false;
    },
    cancel() {
      this.$router.push({ name: 'personView', params: { id: this.$route.params.id } });
    },
    async save() {
      this.loading = true;
      const { Surname, GivenName, BirthYear, BirthAccuracy, DeathAccuracy, DeathYear, Notes } = this.fields;
      await people.put(this.$route.params.id, {
        person: { Surname, GivenName, BirthYear, BirthAccuracy, DeathYear, DeathAccuracy, Notes },
      });
      this.loading = false;
      this.$router.push({ name: 'personView', params: { id: this.$route.params.id } });
    },
  },
  computed: {
    breadcrumbs() {
      const items = [
        { text: 'Home', to: '/', exact: true },
        { text: 'People', to: '/people', exact: true },
      ];
      if (this.fields.GivenName) {
        items.push({ text: `${this.fields.GivenName} ${this.fields.Surname}`, to: { name: 'personView', params: { id: this.$route.params.id } }, exact: true });
      }
      items.push({ text: 'Edit' });
      return items;
    },
  },
  watch: {
    fields: {
      handler() {
        if (this.infoLoaded) this.dirty = true;
      },
      deep: true,
    },
  },
};
</script>
