<template>
  <v-sheet>
    <v-breadcrumbs :items="breadcrumbs"></v-breadcrumbs>

    <div class="d-flex align-center mb-4">
      <h1>{{ fields.name }}</h1>
      <v-spacer></v-spacer>
      <PrintButton
        v-if="infoLoaded"
        :data="printData"
        :name="fields.name"
        :selectedImage="selectedImage"
        class="mr-2"
      />
      <v-btn color="primary" @click="goEdit">
        <v-icon class="mr-1">mdi-pencil</v-icon>
        Edit
      </v-btn>
    </div>

    <div class="row">
      <div class="col-md-3">
        <v-card class="default px-3 py-3 mb-4">
          <v-card-text>
            <h3 class="mb-3">Alternate Names</h3>
            <div v-for="(item, i) of altNames" :key="i" class="mb-2">
              <v-text-field
                outlined dense background-color="white" hide-details
                :value="item.alternateName" readonly label="Alternate name"
              ></v-text-field>
            </div>
            <div v-if="altNames.length === 0" class="text--secondary">None</div>
          </v-card-text>
        </v-card>

        <v-text-field
          outlined dense background-color="white" hide-details
          :value="placeTypeNames.join(', ')" readonly label="Place types"
          class="mb-4"
        ></v-text-field>

        <v-textarea
          outlined dense background-color="white" hide-details
          :value="fields.notes" readonly label="Notes"
        ></v-textarea>
      </div>

      <div class="col-md-5">
        <v-card class="default px-3 py-3 mb-4">
          <v-card-text>
            <h3 class="mb-3">First Nation Names</h3>
            <div v-for="(item, i) of fnNames" :key="i">
              <v-row>
                <v-col cols="6">
                  <v-text-field outlined dense background-color="white" hide-details :value="item.fnName" readonly label="Name"></v-text-field>
                </v-col>
                <v-col cols="6">
                  <v-text-field outlined dense background-color="white" hide-details :value="item.fnLanguage" readonly label="Language"></v-text-field>
                </v-col>
              </v-row>
              <v-row class="mb-2">
                <v-col cols="12">
                  <v-text-field outlined dense background-color="white" hide-details :value="item.fnDesription" readonly label="Description"></v-text-field>
                </v-col>
              </v-row>
              <hr v-if="i < fnNames.length - 1" class="mb-3" />
            </div>
            <div v-if="fnNames.length === 0" class="text--secondary">None</div>
          </v-card-text>
        </v-card>

        <v-card class="default px-3 py-3 mb-4">
          <v-card-text>
            <h3 class="mb-3">First Nation Associations</h3>
            <div v-for="(item, i) of fnAssociations" :key="i" class="mb-2">
              <v-row>
                <v-col cols="6">
                  <v-select
                    outlined dense background-color="white" hide-details
                    :value="item.fnAssociationType" readonly label="Association"
                    :items="fnAssociationTypeOptions" item-text="text" item-value="value"
                  ></v-select>
                </v-col>
                <v-col cols="6">
                  <v-select
                    outlined dense background-color="white" hide-details
                    :value="item.firstNationId" readonly label="First Nation"
                    :items="firstNationOptions" item-value="id" item-text="description"
                  ></v-select>
                </v-col>
              </v-row>
            </div>
            <div v-if="fnAssociations.length === 0" class="text--secondary">None</div>
          </v-card-text>
        </v-card>
      </div>

      <div class="col-md-4">
        <GenericRecordPhotosCard
          v-if="infoLoaded"
          record="ytplace"
          :recordId="$route.params.id"
          :showAddPhotoButton="false"
          @newSelectedImage="updateSelectedImage"
        />
      </div>
    </div>

    <MapLoader
      v-if="infoLoaded"
      mode="view"
      mapType="ytPlace"
      @modifiedDataCoordinates="() => {}"
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
          mode="view"
          :placeId="$route.params.id"
          @historic-record-change="() => {}"
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
import PrintButton from './PrintButton';
import MapLoader from '../../MapLoader';
import { YTPLACE_URL, STATIC_URL } from '../../../urls';
import axios from 'axios';

export default {
  name: 'ViewPlace',
  components: { PrintButton, HistoricRecord, MapLoader, GenericRecordPhotosCard },
  data: () => ({
    loading: false,
    infoLoaded: false,
    fields: {},
    placeTypes: [],
    placeTypeNames: [],
    fnNames: [],
    altNames: [],
    fnAssociations: [],
    histories: [],
    selectedImage: null,
    firstNationOptions: [],
    fnAssociationTypeOptions: [],
  }),
  mounted() {
    this.loadStaticData();
    this.load();
  },
  methods: {
    async loadStaticData() {
      const [fnResp, fnAssocResp] = await Promise.all([
        axios.get(`${STATIC_URL}/first-nation`),
        axios.get(`${STATIC_URL}/first-nation-association-type`),
      ]);
      this.firstNationOptions = fnResp.data.data;
      this.fnAssociationTypeOptions = fnAssocResp.data.data;
    },
    async load() {
      this.loading = true;
      this.infoLoaded = false;
      const resp = await axios.get(`${YTPLACE_URL}/${this.$route.params.id}`);
      this.setPlace(resp.data);
      this.loading = false;
    },
    setPlace(place) {
      this.fields = place.data;
      this.histories = place.relationships.histories.data;
      const rawPlaceTypes = place.relationships.placeTypes.data;
      this.placeTypeNames = rawPlaceTypes.map((x) => x.placeType);
      this.placeTypes = rawPlaceTypes.map((x) => x.placeTypeLookupId);
      this.fnNames = place.relationships.fnNames.data;
      this.altNames = place.relationships.altNames.data;
      this.fnAssociations = place.relationships.fnAssociations.data;
      this.infoLoaded = true;
    },
    goEdit() {
      this.$router.push({ name: 'placeEditView', params: { id: this.$route.params.id } });
    },
    updateSelectedImage(val) {
      this.selectedImage = val;
    },
  },
  computed: {
    breadcrumbs() {
      return [
        { text: 'Home', to: '/', exact: true },
        { text: 'Places', to: '/places', exact: true },
        { text: this.fields.name || '...' },
      ];
    },
    printData() {
      return {
        ...this.fields,
        histories: this.histories,
        placeTypes: this.placeTypes,
        placeTypeNames: this.placeTypeNames,
        fnNames: this.fnNames,
        fnAssociations: this.fnAssociations,
        altNames: this.altNames,
        fnAssociationTypeOptions: this.fnAssociationTypeOptions,
        firstNationOptions: this.firstNationOptions,
      };
    },
  },
};
</script>
