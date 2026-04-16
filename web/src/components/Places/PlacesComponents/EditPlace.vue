<template>
  <v-sheet>
    <v-breadcrumbs :items="breadcrumbs"></v-breadcrumbs>

    <div class="d-flex align-center mb-4">
      <h1>{{ fields.name }}</h1>
      <v-spacer></v-spacer>
      <v-btn outlined color="warning" class="mr-2" @click="cancel">Cancel</v-btn>
      <v-btn color="success" :disabled="!dirty" @click="saveChanges">
        <v-icon class="mr-1">mdi-check</v-icon>
        Save
      </v-btn>
    </div>

    <div class="row">
      <div class="col-md-3">
        <v-text-field
          outlined dense background-color="white" hide-details
          label="Place name" v-model="fields.name" class="mb-4"
        ></v-text-field>

        <v-card class="default px-3 py-3 mb-4">
          <v-card-text>
            <h3 class="mb-3">Alternate Names</h3>
            <div v-for="(item, i) of altNames" :key="i" class="d-flex align-center mb-2">
              <v-text-field
                outlined dense background-color="white" hide-details
                v-model="item.alternateName" label="Alternate name"
              ></v-text-field>
              <v-btn color="warning" x-small fab title="Remove" class="ml-2" @click="removeName(i)">
                <v-icon>mdi-close</v-icon>
              </v-btn>
            </div>
            <v-btn class="mt-3" color="primary" @click="addName">Add Alternate Name</v-btn>
          </v-card-text>
        </v-card>

        <v-select
          outlined dense
          v-model="placeTypes"
          :items="placeTypeOptions"
          item-text="PlaceType"
          item-value="Id"
          multiple
          clearable
          label="Place types"
          class="mb-4"
        ></v-select>

        <v-textarea
          outlined dense background-color="white" hide-details
          label="Notes" v-model="fields.notes"
        ></v-textarea>
      </div>

      <div class="col-md-5">
        <v-card class="default px-3 py-3 mb-4">
          <v-card-text>
            <h3 class="mb-3">First Nation Names</h3>
            <div v-for="(item, i) of fnNames" :key="i">
              <v-row>
                <v-col cols="5">
                  <v-text-field outlined dense background-color="white" hide-details v-model="item.fnName" label="Name"></v-text-field>
                </v-col>
                <v-col cols="5">
                  <v-text-field outlined dense background-color="white" hide-details v-model="item.fnLanguage" label="Language"></v-text-field>
                </v-col>
                <v-col cols="2" class="d-flex align-center">
                  <v-btn color="warning" x-small fab title="Remove" @click="removeFnName(i)">
                    <v-icon>mdi-close</v-icon>
                  </v-btn>
                </v-col>
              </v-row>
              <v-row class="mb-2">
                <v-col cols="12">
                  <v-text-field outlined dense background-color="white" hide-details v-model="item.fnDesription" label="Description"></v-text-field>
                </v-col>
              </v-row>
              <hr v-if="i < fnNames.length - 1" class="mb-3" />
            </div>
            <v-btn class="mt-3" color="primary" @click="addFnName">Add First Nation Name</v-btn>
          </v-card-text>
        </v-card>

        <v-card class="default px-3 py-3 mb-4">
          <v-card-text>
            <h3 class="mb-3">First Nation Associations</h3>
            <div v-for="(item, i) of fnAssociations" :key="i" class="mb-2">
              <v-row>
                <v-col cols="5">
                  <v-select
                    outlined dense background-color="white" hide-details
                    v-model="item.fnAssociationType" label="Association"
                    :items="fnAssociationTypeOptions" item-text="text" item-value="value"
                  ></v-select>
                </v-col>
                <v-col cols="5">
                  <v-select
                    outlined dense background-color="white" hide-details
                    v-model="item.firstNationId" label="First Nation"
                    :items="firstNationOptions" item-value="id" item-text="description"
                  ></v-select>
                </v-col>
                <v-col cols="2" class="d-flex align-center">
                  <v-btn color="warning" x-small fab title="Remove" @click="removeFNAssociation(i)">
                    <v-icon>mdi-close</v-icon>
                  </v-btn>
                </v-col>
              </v-row>
            </div>
            <v-btn class="mt-3" color="primary" @click="addFNAssociation">Add Association</v-btn>
          </v-card-text>
        </v-card>
      </div>

      <div class="col-md-4">
        <GenericRecordPhotosCard
          v-if="infoLoaded"
          record="ytplace"
          :recordId="$route.params.id"
          :showAddPhotoButton="true"
          @newSelectedImage="updateSelectedImage"
        />
      </div>
    </div>

    <MapLoader
      v-if="infoLoaded"
      mode="edit"
      mapType="ytPlace"
      @modifiedDataCoordinates="modifiedDataCoordinates"
      :fields="{
        accuracy: fields.accuracy,
        inyukon: null,
        locationDesc: fields.locationDesc,
        lat: fields.latitude,
        long: fields.longitude,
        Location: null,
        mapSheet: fields.mapSheet,
      }"
    />

    <v-divider class="my-5"></v-divider>

    <v-card class="default px-3 py-3" v-if="infoLoaded">
      <v-card-text>
        <HistoricRecord
          :historicRecords="histories"
          mode="edit"
          :placeId="$route.params.id"
          @historic-record-change="markDirty"
        />
      </v-card-text>
    </v-card>

    <v-overlay :value="loading">
      <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay>
  </v-sheet>
</template>

<script>
import GenericRecordPhotosCard from '@/components/photos/GenericRecordPhotosCard.vue';
import HistoricRecord from './HistoricRecord';
import MapLoader from '../../MapLoader';
import catalogs from '../../../controllers/catalogs';
import { YTPLACE_URL, STATIC_URL } from '../../../urls';
import axios from 'axios';

export default {
  name: 'EditPlace',
  components: { HistoricRecord, MapLoader, GenericRecordPhotosCard },
  data: () => ({
    loading: false,
    infoLoaded: false,
    dirty: false,
    fields: {},
    placeTypes: [],
    placeTypeOptions: [],
    fnNames: [],
    altNames: [],
    fnAssociations: [],
    histories: [],
    modifiedMapFields: null,
    firstNationOptions: [],
    fnAssociationTypeOptions: [],
  }),
  mounted() {
    this.loadStaticData();
    this.load();
  },
  methods: {
    async loadStaticData() {
      const [fnResp, fnAssocResp, placeTypesData] = await Promise.all([
        axios.get(`${STATIC_URL}/first-nation`),
        axios.get(`${STATIC_URL}/first-nation-association-type`),
        catalogs.getPlaceTypes(),
      ]);
      this.firstNationOptions = fnResp.data.data;
      this.fnAssociationTypeOptions = fnAssocResp.data.data;
      this.placeTypeOptions = placeTypesData.body;
    },
    async load() {
      this.loading = true;
      this.infoLoaded = false;
      this.dirty = false;
      const resp = await axios.get(`${YTPLACE_URL}/${this.$route.params.id}`);
      this.setPlace(resp.data);
      this.loading = false;
    },
    setPlace(place) {
      this.fields = place.data;
      this.modifiedMapFields = {
        locationDesc: place.data.locationDesc,
        lat: place.data.latitude,
        long: place.data.longitude,
        accuracy: place.data.accuracy,
        mapSheet: place.data.mapSheet,
      };
      this.histories = place.relationships.histories.data;
      const rawPlaceTypes = place.relationships.placeTypes.data;
      this.placeTypes = rawPlaceTypes.map((x) => x.placeTypeLookupId);
      this.fnNames = place.relationships.fnNames.data;
      this.altNames = place.relationships.altNames.data;
      this.fnAssociations = place.relationships.fnAssociations.data;
      this.infoLoaded = true;
    },
    cancel() {
      this.$router.push({ name: 'placeView', params: { id: this.$route.params.id } });
    },
    async saveChanges() {
      this.loading = true;
      const body = {
        name: this.fields.name,
        locationDesc: this.modifiedMapFields.locationDesc,
        latitude: this.modifiedMapFields.lat,
        longitude: this.modifiedMapFields.long,
        accuracy: this.modifiedMapFields.accuracy,
        mapSheet: this.modifiedMapFields.mapSheet,
        notes: this.fields.notes,
        placeTypes: this.placeTypes,
        fnNames: this.fnNames,
        altNames: this.altNames,
        histories: this.histories,
        fnAssociations: this.fnAssociations,
      };
      try {
        await axios.put(`${YTPLACE_URL}/${this.$route.params.id}`, body);
        this.$store.commit('alerts/setText', 'Place saved');
        this.$store.commit('alerts/setType', 'success');
        this.$store.commit('alerts/setTimeout', 5000);
        this.$store.commit('alerts/setAlert', true);
        this.$router.push({ name: 'placeView', params: { id: this.$route.params.id } });
      } catch {
        const errText = !this.fields.name ? 'Place name is required' : 'Missing required place data';
        this.$store.commit('alerts/setText', errText);
        this.$store.commit('alerts/setType', 'warning');
        this.$store.commit('alerts/setTimeout', 5000);
        this.$store.commit('alerts/setAlert', true);
      }
      this.loading = false;
    },
    addName() {
      this.altNames.push({ alternateName: '', placeId: this.$route.params.id, id: null });
      this.dirty = true;
    },
    removeName(index) {
      this.altNames.splice(index, 1);
      this.dirty = true;
    },
    addFNAssociation() {
      this.fnAssociations.push({ placeId: this.$route.params.id, fnAssociationType: 1, firstNationId: 1 });
      this.dirty = true;
    },
    removeFNAssociation(index) {
      this.fnAssociations.splice(index, 1);
      this.dirty = true;
    },
    addFnName() {
      this.fnNames.push({ placeId: this.$route.params.id });
      this.dirty = true;
    },
    removeFnName(index) {
      this.fnNames.splice(index, 1);
      this.dirty = true;
    },
    markDirty() {
      this.dirty = true;
    },
    modifiedDataCoordinates(val) {
      this.modifiedMapFields = val;
      this.dirty = true;
    },
    updateSelectedImage(val) {
      this.selectedImage = val;
    },
  },
  computed: {
    breadcrumbs() {
      const items = [
        { text: 'Home', to: '/', exact: true },
        { text: 'Places', to: '/places', exact: true },
      ];
      if (this.fields.name) {
        items.push({ text: this.fields.name, to: { name: 'placeView', params: { id: this.$route.params.id } }, exact: true });
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
    placeTypes: {
      handler() {
        if (this.infoLoaded) this.dirty = true;
      },
      deep: true,
    },
    fnAssociations: {
      handler() {
        if (this.infoLoaded) this.dirty = true;
      },
      deep: true,
    },
    fnNames: {
      handler() {
        if (this.infoLoaded) this.dirty = true;
      },
      deep: true,
    },
    altNames: {
      handler() {
        if (this.infoLoaded) this.dirty = true;
      },
      deep: true,
    },
  },
};
</script>
