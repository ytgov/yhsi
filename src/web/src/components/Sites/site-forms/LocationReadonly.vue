<template lang="pug">
v-card.mb-0(
  tag="section"
  outlined
  tile
)
  v-card-title.mb-0.text-h4(tag="h2")
    | Location
  v-card-text
    v-row
      v-col(cols="3")
        CommunitySelect(
          v-model="place.communityId"
          readonly
          dense
          outlined
          hide-details
        )
      v-col(cols="3")
        v-text-field(
          v-model="place.otherCommunity"
          readonly
          dense
          outlined
          label="Other community"
          hide-details
        )
      v-col(cols="6")
        v-text-field(
          v-model="place.otherLocality"
          readonly
          dense
          outlined
          label="Other locality"
          hide-details
        )
      v-col(cols="6")
        v-card.default.mb-4(tag="section")
          v-card-title.mb-0.text-h6(tag="h3")
            | Physical Address
          v-card-text
            v-textarea(
              v-model="place.physicalAddress"
              readonly
              dense
              outlined
              label="Address"
              background-color="white"
            )
            v-text-field(
              v-model="place.physicalProvince"
              readonly
              dense
              outlined
              label="Province"
              background-color="white"
            )
            v-row
              v-col(cols="6")
                v-text-field(
                  v-model="place.physicalCountry"
                  readonly
                  dense
                  outlined
                  label="Country"
                  background-color="white"
                  hide-details
                )
              v-col(cols="6")
                v-text-field(
                  v-model="place.physicalPostalCode"
                  readonly
                  dense
                  outlined
                  label="Postal code"
                  background-color="white"
                  hide-details
                )
      v-col(cols="6")
        v-textarea(
          v-model="place.previousAddress"
          readonly
          dense
          outlined
          label="Previous address"
        )
        v-textarea(
          v-model="place.locationContext"
          readonly
          dense
          outlined
          label="Context"
        )
      v-col(cols="6")
        v-text-field(
          v-model="place.latitude"
          readonly
          dense
          outlined
          label="Latitude"
        )
        v-text-field(
          v-model="place.longitude"
          readonly
          dense
          outlined
          label="Longitude"
        )
        CoordinateDeterminationTypesSelect(
          v-model="place.coordinateDetermination"
          readonly
          dense
          outlined
          hide-details
        )

        v-btn(
          color="secondary",
          :disabled="!showMapButton"
          @click="showMap"
        )
          v-icon.mr-2 mdi-map-marker
          | Show on Map
      v-col(cols="6")
        v-row
          v-col(cols="6")
            v-text-field(
              v-model="place.nTSMapSheet"
              readonly
              dense
              outlined
              label="NTS map sheet"
            )
          v-col(cols="6")
            v-text-field(
              v-model="place.hectareArea"
              readonly
              dense
              outlined
              label="Area(m2)"
            )
        v-text-field(
          v-model="place.bordenNumber"
          readonly
          dense
          outlined
          label="Border number"
        )
        v-textarea(
          v-model="place.locationComment"
          readonly
          dense
          outlined
          label="Misc. info"
        )
  v-card-actions
    v-spacer
    v-tooltip(left)
      template(#activator="{ on, attrs }")
        div(v-on="on")
          v-btn.my-0(
            color="primary"
            disabled
          ) Save
      span There are pending site change requests against this site location.
  map-dialog(ref="map")
</template>

<script>
import { mapGetters } from 'vuex';

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
      if (this.place.latitude && this.place.longitude) {
        return true;
      }
      return false;
    },
  },
  mounted() {},
  methods: {
    showMap() {
      this.$refs.map.show(this.place.latitude, this.place.longitude);
    },
  },
};
</script>
