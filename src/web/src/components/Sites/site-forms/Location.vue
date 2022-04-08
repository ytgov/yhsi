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
            v-model="place.communityId"
            dense
            outlined
            hide-details
          />
        </v-col>
        <v-col cols="3">
          <v-text-field
            v-model="place.otherCommunity"
            dense
            outlined
            label="Other community"
            hide-details
          />
        </v-col>
        <v-col cols="6">
          <v-text-field
            v-model="place.otherLocality"
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
                v-model="place.physicalAddress"
                dense
                outlined
                label="Address"
                background-color="white"
              />

              <v-text-field
                v-model="place.physicalProvince"
                dense
                outlined
                label="Province"
                background-color="white"
              />
              <v-row>
                <v-col cols="6">
                  <v-text-field
                    v-model="place.physicalCountry"
                    dense
                    outlined
                    label="Country"
                    background-color="white"
                    hide-details
                  />
                </v-col>
                <v-col cols="6">
                  <v-text-field
                    v-model="place.physicalPostalCode"
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
            v-model="place.previousAddress"
            dense
            outlined
            label="Previous address"
          />
          <v-textarea
            v-model="place.locationContext"
            dense
            outlined
            label="Context"
          />
        </v-col>
        <v-col cols="6">
          <v-text-field
            v-model="place.latitude"
            dense
            outlined
            label="Latitude"
          />

          <v-text-field
            v-model="place.longitude"
            dense
            outlined
            label="Longitude"
          />
          <CoordinateDeterminationTypesSelect
            v-model="place.coordinateDetermination"
            dense
            outlined
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
                v-model="place.nTSMapSheet"
                dense
                outlined
                label="NTS map sheet"
              />
            </v-col>
            <v-col cols="6">
              <v-text-field
                v-model="place.hectareArea"
                dense
                outlined
                label="Area(m2)"
              />
            </v-col>
          </v-row>
          <v-text-field
            v-model="place.bordenNumber"
            dense
            outlined
            label="Border number"
          />
          <v-textarea
            v-model="place.locationComment"
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
import { pick } from 'lodash';

import CommunitySelect from '@/components/Sites/site-forms/CommunitySelect';
import CoordinateDeterminationTypesSelect from '@/components/Sites/site-forms/CoordinateDeterminationTypesSelect';

export default {
  name: 'Location',
  components: { CommunitySelect, CoordinateDeterminationTypesSelect },
  props: {
    placeId: {
      type: [Number, String],
      required: true,
    },
  },
  data: () => ({}),
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
  mounted() {},
  methods: {
    ...mapActions({
      savePlace: 'places/save',
    }),
    saveChanges() {
      const data = pick(this.place, [
        'bordenNumber',
        'communityId',
        'coordinateDetermination',
        'hectareArea',
        'latitude',
        'locationComment',
        'locationContext',
        'longitude',
        'nTSMapSheet',
        'otherCommunity',
        'otherLocality',
        'physicalAddress',
        'physicalCountry',
        'physicalPostalCode',
        'physicalProvince',
        'previousAddress',
      ]);
      return this.savePlace(data);
    },
    showMap() {
      this.$refs.map.show(this.latitude, this.longitude);
    },
  },
};
</script>
