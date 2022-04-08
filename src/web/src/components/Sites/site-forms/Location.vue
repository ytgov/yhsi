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
          <CommunitySelect
            v-model="communityId"
            dense
            outlined
            hide-details
          />
        </v-col>
        <v-col cols="3">
          <v-text-field
            v-model="otherCommunity"
            dense
            outlined
            label="Other community"
            hide-details
          />
        </v-col>
        <v-col cols="6">
          <v-text-field
            v-model="otherLocality"
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
                v-model="physicalAddress"
                dense
                outlined
                label="Address"
                background-color="white"
              />

              <v-text-field
                v-model="physicalProvince"
                dense
                outlined
                label="Province"
                background-color="white"
              />
              <v-row>
                <v-col cols="6">
                  <v-text-field
                    v-model="physicalCountry"
                    dense
                    outlined
                    label="Country"
                    background-color="white"
                    hide-details
                  />
                </v-col>
                <v-col cols="6">
                  <v-text-field
                    v-model="physicalPostalCode"
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
            v-model="previousAddress"
            dense
            outlined
            label="Previous address"
          />
          <v-textarea
            v-model="locationContext"
            dense
            outlined
            label="Context"
          />
        </v-col>
        <v-col cols="6">
          <v-text-field
            v-model="latitude"
            dense
            outlined
            label="Latitude"
          />

          <v-text-field
            v-model="longitude"
            dense
            outlined
            label="Longitude"
          />
          <v-select
            v-model="coordinateDetermination"
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
                v-model="nTSMapSheet"
                dense
                outlined
                label="NTS map sheet"
              />
            </v-col>
            <v-col cols="6">
              <v-text-field
                v-model="hectareArea"
                dense
                outlined
                label="Area(m2)"
              />
            </v-col>
          </v-row>
          <v-text-field
            v-model="bordenNumber"
            dense
            outlined
            label="Border number"
          />
          <v-textarea
            v-model="locationComment"
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
import { mapActions, mapGetters } from 'vuex';
import axios from 'axios';

import CommunitySelect from '@/components/Sites/site-forms/CommunitySelect';
import { STATIC_URL } from '@/urls';

/* Important, field data that was not found on the swaggerhub api docs provided was assumed to be in development, hence, some placeholder variables were created */
export default {
  name: 'Location',
  components: { CommunitySelect },
  props: {
    placeId: {
      type: [Number, String],
      required: true,
    },
  },
  data: () => ({
    bordenNumber: '',
    communityId: -1,
    coordinateDetermination: '',
    hectareArea: '',
    latitude: '',
    locationComment: '',
    locationContext: '',
    longitude: '',
    nTSMapSheet: '',
    otherCommunity: '',
    otherLocality: '',
    physicalAddress: '',
    physicalCountry: '',
    physicalPostalCode: '',
    physicalProvince: '',
    previousAddress: '',
    /* Placeholder variables below this line **Read above** */
    coordinateDeterminationOptions: [],
  }),
  computed: {
    ...mapGetters({
      place: 'places/place',
    }),
    showMapButton() {
      if (this.latitude && this.longitude) {
        return true;
      }
      return false;
    },
  },
  mounted() {
    this.updateFormFields(this.place);
    axios.get(`${STATIC_URL}/coordinate-determination`).then((resp) => {
      this.coordinateDeterminationOptions = resp.data.data;
    });
  },
  methods: {
    ...mapActions({
      savePlace: 'places/save',
    }),
    saveChanges() {
      return this.savePlace({
        bordenNumber: this.bordenNumber,
        communityId: this.communityId,
        coordinateDetermination: this.coordinateDetermination,
        hectareArea: this.hectareArea,
        latitude: this.latitude,
        locationComment: this.locationComment,
        locationContext: this.locationContext,
        longitude: this.longitude,
        nTSMapSheet: this.nTSMapSheet,
        otherCommunity: this.otherCommunity,
        otherLocality: this.otherLocality,
        physicalAddress: this.physicalAddress,
        physicalCountry: this.physicalCountry,
        physicalPostalCode: this.physicalPostalCode,
        physicalProvince: this.physicalProvince,
        previousAddress: this.previousAddress,
      }).then(this.updateFormFields);
    },
    showMap() {
      this.$refs.map.show(this.latitude, this.longitude);
    },
    updateFormFields(place) {
      this.bordenNumber = place.bordenNumber;
      this.communityId = place.communityId;
      this.coordinateDetermination = place.coordinateDetermination;
      this.hectareArea = place.hectareArea;
      this.latitude = place.latitude;
      this.locationComment = place.locationComment;
      this.locationContext = place.locationContext;
      this.longitude = place.longitude;
      this.nTSMapSheet = place.nTSMapSheet;
      this.otherCommunity = place.otherCommunity;
      this.otherLocality = place.otherLocality;
      this.physicalAddress = place.physicalAddress;
      this.physicalCountry = place.physicalCountry;
      this.physicalPostalCode = place.physicalPostalCode;
      this.physicalProvince = place.physicalProvince;
      this.previousAddress = place.previousAddress;
    },
  },
};
</script>
