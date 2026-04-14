<template>
  <v-sheet>
    <v-breadcrumbs
      :items="[
        { text: 'Home', to: '/', exact: true },
        { text: 'Places' },
      ]"
    ></v-breadcrumbs>

    <div class="d-flex align-center mb-4">
      <h1>Places</h1>
      <v-spacer></v-spacer>
      <JsonCSV :data="placesCsv">
        <v-btn color="info" class="mr-2" :disabled="places.length === 0">
          <v-icon class="mr-1">mdi-export</v-icon>
          Export
        </v-btn>
      </JsonCSV>
      <PrintButton
        key="prt-2"
        :data="{ places: placesCsv }"
        :disabled="places.length === 0"
        class="mr-2"
      />
      <v-btn color="primary" @click="$router.push('/places/new')">
        <v-icon class="mr-1">mdi-plus-circle-outline</v-icon>
        Add Place
      </v-btn>
    </div>

    <v-card class="default px-3 py-3">
      <v-card-text>
        <div class="d-flex mb-4">
          <v-text-field
            prepend-inner-icon="mdi-magnify"
            background-color="white"
            outlined
            dense
            label="Search"
            v-model="search"
            hide-details
            class="mr-5"
            v-on:input="placeSearchChange()"
          />
          <v-menu transition="slide-y-transition" bottom :close-on-content-click="false">
            <template v-slot:activator="{ on, attrs }">
              <v-btn color="transparent" class="black--text" v-bind="attrs" v-on="on" style="height: 40px">
                <v-icon class="black--text mr-1">mdi-filter</v-icon>
                Filter
                <v-icon class="black--text">mdi-chevron-right</v-icon>
              </v-btn>
            </template>
            <v-list>
              <v-list-item v-for="(item, i) in filterOptions" :key="i" link>
                <v-text-field clearable v-model="item.value" :label="item.name"></v-text-field>
              </v-list-item>
            </v-list>
          </v-menu>
        </div>

        <v-data-table
          :items="filteredData"
          :headers="headers"
          :loading="loading"
          :search="search"
          :options.sync="options"
          :server-items-length="totalLength"
          @click:row="handleClick"
          :footer-props="{ 'items-per-page-options': [10, 30, 100] }"
          class="clickable-row"
        >
          <template v-slot:item.alternateNames="{ item }">
            <span v-if="item.alternateNames.length > 0">{{ getAlternateNames(item.alternateNames) }}</span>
          </template>
          <template v-slot:item.firstNationNames="{ item }">
            <span v-if="item.firstNationNames.length > 0">{{ getFnNames(item.firstNationNames) }}</span>
          </template>
          <template v-slot:item.placeTypes="{ item }">
            <span v-if="item.placeTypes.length > 0">{{ getPlaceTypeNames(item.placeTypes) }}</span>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>
  </v-sheet>
</template>

<script>
import JsonCSV from 'vue-json-csv';
import PrintButton from './PrintButton';
import _ from 'lodash';
import axios from 'axios';
import { YTPLACE_URL } from '../../../urls';

export default {
  name: 'PlacesGrid',
  components: { JsonCSV, PrintButton },
  data: () => ({
    loading: false,
    places: [],
    placesCsv: [],
    search: '',
    headers: [
      { text: 'Name', value: 'name' },
      { text: 'Alternate Name', value: 'alternateNames', sortable: false },
      { text: 'First Nation Name', value: 'firstNationNames', sortable: false },
      { text: 'Place Type', value: 'placeTypes', sortable: false },
      { text: 'Location Description', value: 'locationDesc' },
      { text: 'Latitude', value: 'latitude' },
      { text: 'Longitude', value: 'longitude' },
      { text: 'Mapsheet', value: 'mapSheet' },
    ],
    page: 0,
    totalLength: 0,
    options: {},
    filterOptions: [
      { name: 'Name', value: '' },
      { name: 'Place Type', value: '' },
      { name: 'Mapsheet', value: '' },
    ],
  }),
  mounted() {
    this.getDataFromApi();
  },
  methods: {
    placeSearchChange: _.debounce(function () {
      this.getDataFromApi();
    }, 400),
    handleClick(value) {
      this.$router.push({ name: 'placeView', params: { id: value.id } });
    },
    async getDataFromApi() {
      this.loading = true;
      const body = _.clone(this.options);
      body.query = [
        { field: 'name', operator: 'contains', value: this.search },
        { field: 'locationDesc', operator: 'contains', value: this.search },
      ];
      try {
        const resp = await axios.post(`${YTPLACE_URL}/search`, body);
        this.places = resp.data.data;
        this.totalLength = resp.data.meta.item_count;
        this.placesCsv = this.places.map((val) => {
          const row = Object.assign({}, val);
          row.placeTypes = row.placeTypes.map((x) => x.placeType);
          row.alternateNames = row.alternateNames.map((x) => x.alternateName);
          row.firstNationNames = row.firstNationNames.map((x) => x.fnName);
          delete row.id;
          delete row.notes;
          return row;
        });
      } catch (err) {
        console.error('Error in getDataFromApi: ' + err);
      }
      this.loading = false;
    },
    getPlaceTypeNames(placeTypes) {
      if (!placeTypes) return null;
      return placeTypes.map((x) => x.placeType).toString();
    },
    getAlternateNames(alternateNames) {
      if (!alternateNames) return null;
      return alternateNames.map((x) => x.alternateName).toString();
    },
    getFnNames(fnNames) {
      if (!fnNames) return null;
      return fnNames.map((x) => x.fnName).toString();
    },
    filterPlaceTypes(item) {
      const sorters = JSON.parse(JSON.stringify(this.filterOptions));
      if (item.placeTypes[0]) {
        return item.placeTypes
          .map((x) => x.placeType)
          .toString()
          .toLowerCase()
          .includes(sorters[1].value.toLowerCase());
      }
      return false;
    },
  },
  computed: {
    filteredData() {
      if (this.filterOptions) {
        const sorters = JSON.parse(JSON.stringify(this.filterOptions));
        let data = JSON.parse(JSON.stringify(this.places));
        if (sorters[0].value) {
          data = data.filter((x) => x.name && x.name.toLowerCase().includes(sorters[0].value.toLowerCase()));
        }
        if (sorters[1].value) {
          data = data.filter(this.filterPlaceTypes);
        }
        if (sorters[2].value) {
          data = data.filter((x) => x.mapSheet && x.mapSheet.toLowerCase().includes(sorters[2].value.toLowerCase()));
        }
        return data;
      }
      return this.places;
    },
  },
  watch: {
    options: {
      handler() {
        this.getDataFromApi();
      },
      deep: true,
    },
  },
};
</script>
