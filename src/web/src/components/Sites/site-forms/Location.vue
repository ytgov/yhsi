<template>
  <v-card
    class="mb-0"
    tag="section"
    outlined
    tile
  >
    <v-card-title
      class="mb-0 text-h4"
      tag="h2"
    >
      Location
    </v-card-title>
    <v-card-text>
      <v-row>
        <v-col cols="3">
          <v-select
            v-model="fields.communityId"
            dense
            outlined
            :items="communities"
            label="Community"
            item-text="name"
            item-value="id"
            hide-details
          />
        </v-col>
        <v-col cols="3">
          <v-text-field
            v-model="fields.otherCommunity"
            dense
            outlined
            label="Other community"
            hide-details
          />
        </v-col>
        <v-col cols="6">
          <v-text-field
            v-model="fields.otherLocality"
            dense
            outlined
            label="Other locality"
            hide-details
          />
        </v-col>
        <v-col cols="6">
          <v-card
            class="default mb-4"
            tag="section"
          >
            <v-card-title
              tag="h3"
              class="mb-0 text-h6"
            >
              Physical Address
            </v-card-title>
            <v-card-text>
              <v-textarea
                v-model="fields.physicalAddress"
                dense
                outlined
                label="Address"
                background-color="white"
              />

              <v-text-field
                v-model="fields.physicalProvince"
                dense
                outlined
                label="Province"
                background-color="white"
              />
              <v-row>
                <v-col cols="6">
                  <v-text-field
                    v-model="fields.physicalCountry"
                    dense
                    outlined
                    label="Country"
                    background-color="white"
                    hide-details
                  />
                </v-col>
                <v-col cols="6">
                  <v-text-field
                    v-model="fields.physicalPostalCode"
                    dense
                    outlined
                    label="Postal code"
                    background-color="white"
                    hide-details
                  />
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="6">
          <v-textarea
            v-model="fields.previousAddress"
            dense
            outlined
            label="Previous address"
          />
          <v-textarea
            v-model="fields.locationContext"
            dense
            outlined
            label="Context"
          />
        </v-col>
        <v-col cols="6">
          <v-text-field
            v-model="fields.latitude"
            dense
            outlined
            label="Latitude"
          />

          <v-text-field
            v-model="fields.longitude"
            dense
            outlined
            label="Longitude"
          />
          <v-select
            v-model="fields.coordinateDetermination"
            dense
            outlined
            :items="coordinateDeterminationOptions"
            label="Coordinate determination"
            hide-details
          />

          <v-btn
            color="secondary"
            :disabled="!showMapButton"
            @click="showMap"
          >
            <v-icon class="mr-2"> mdi-map-marker </v-icon>
            Show on Map
          </v-btn>
        </v-col>
        <v-col cols="6">
          <v-row>
            <v-col cols="6">
              <v-text-field
                v-model="fields.nTSMapSheet"
                dense
                outlined
                label="NTS map sheet"
              />
            </v-col>
            <v-col cols="6">
              <v-text-field
                v-model="fields.hectareArea"
                dense
                outlined
                label="Area(m2)"
              />
            </v-col>
          </v-row>
          <v-text-field
            v-model="fields.bordenNumber"
            dense
            outlined
            label="Border number"
          />
          <v-textarea
            v-model="fields.locationComment"
            dense
            outlined
            label="Misc. info"
          />
        </v-col>
      </v-row>
    </v-card-text>

    <v-card-actions>
      <v-spacer />
      <v-btn
        class="my-0"
        color="primary"
        @click="saveChanges"
      >
        Save
      </v-btn>
    </v-card-actions>
    <map-dialog ref="map" />
  </v-card>
</template>

<script>
import axios from 'axios';

import store from '@/store';
import { COMMUNITY_URL, PLACE_URL, STATIC_URL } from '@/urls';

/* Important, field data that was not found on the swaggerhub api docs provided was assumed to be in development, hence, some placeholder variables were created */
export default {
  name: 'Location',
  data: () => ({
    valid: false,
    loadedId: -1,
    generalRules: [
      (v) => !!v || 'This input is required',
      (v) => v.length <= 20 || 'This input must be less than 20 characters',
    ],
    /* Placeholder variables below this line **Read above** */
    coordinateDeterminationOptions: [],
    communities: [],
    /*Field data from the swaggerhub api docs below this line*/
    fields: {
      bordenNumber: '', //
      communityId: '', //
      coordinateDetermination: '', //
      hectareArea: '', //
      latitude: '', //
      locationComment: '', //
      locationContext: '', //
      longitude: '', //
      nTSMapSheet: '', //
      otherCommunity: '', //
      otherLocality: '', //
      physicalAddress: '', //
      physicalCountry: '', //
      physicalPostalCode: '', //
      physicalProvince: '', //
      previousAddress: '', //
    },
  }),
  computed: {
    showMapButton: function () {
      if (this.fields.latitude && this.fields.longitude) {
        return true;
      }
      return false;
    },
  },
  created: function () {
    this.loadedId = this.$route.params.id;

    axios
      .get(`${PLACE_URL}/${this.loadedId}`)
      .then((resp) => {
        this.fields = resp.data.data;
        this.fields.communityId = 29;

        store.dispatch('addSiteHistory', resp.data.data);
        this.$parent.siteName = this.fields.primaryName;
      })
      .catch((error) => console.error(error));

    axios.get(`${COMMUNITY_URL}`).then((resp) => {
      this.communities = resp.data.data;
    });

    axios.get(`${STATIC_URL}/coordinate-determination`).then((resp) => {
      this.coordinateDeterminationOptions = resp.data.data;
    });
  },
  methods: {
    saveChanges() {
      let body = {
        bordenNumber: this.fields.bordenNumber,
        communityId: this.fields.communityId,
        coordinateDetermination: this.fields.coordinateDetermination,
        hectareArea: this.fields.hectareArea,
        latitude: this.fields.latitude,
        locationComment: this.fields.locationComment,
        locationContext: this.fields.locationContext,
        longitude: this.fields.longitude,
        nTSMapSheet: this.fields.nTSMapSheet,
        otherCommunity: this.fields.otherCommunity,
        otherLocality: this.fields.otherLocality,
        physicalAddress: this.fields.physicalAddress,
        physicalCountry: this.fields.physicalCountry,
        physicalPostalCode: this.fields.physicalPostalCode,
        physicalProvince: this.fields.physicalProvince,
        previousAddress: this.fields.previousAddress,
      };

      axios
        .put(`${PLACE_URL}/${this.loadedId}/location`, body)
        .then((resp) => {
          this.$emit('showAPIMessages', resp.data);
        })
        .catch((err) => {
          this.$emit('showError', err);
        });
    },
    showMap() {
      this.$refs.map.show(this.fields.latitude, this.fields.longitude);
    },
  },
};
</script>
