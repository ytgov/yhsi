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
      Legal &amp; Zoning
    </v-card-title>
    <v-card-text tag="section">
      <OwnershipsEditor
        v-model="place.ownerships"
        :place-id="placeId"
      />
      <v-divider class="my-3" />
      <v-row>
        <v-col cols="6">
          <v-text-field
            v-model="place.zoning"
            label="Zoning"
            dense
            outlined
            background-color="white"
            hide-details
          />
        </v-col>
        <v-col cols="6">
          <v-text-field
            v-model="place.townSiteMapNumber"
            label="Town site map number"
            dense
            outlined
            background-color="white"
            hide-details
          />
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="6">
          <v-text-field
            v-model="place.siteDistrictNumber"
            label="Site district"
            dense
            outlined
            background-color="white"
            hide-details
          />
        </v-col>
        <v-col cols="6">
          <v-text-field
            v-model="place.groupYHSI"
            label="Group YHSI"
            dense
            outlined
            background-color="white"
            hide-details
          />
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="6">
          <v-text-field
            v-model="place.lAGroup"
            label="Group"
            dense
            outlined
            background-color="white"
            hide-details
          />
        </v-col>
        <v-col cols="6">
          <v-text-field
            v-model="place.lot"
            label="Lot"
            dense
            outlined
            background-color="white"
            hide-details
          />
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="6">
          <v-text-field
            v-model="place.block"
            label="Block"
            dense
            outlined
            background-color="white"
            hide-details
          />
        </v-col>

        <v-col cols="6">
          <v-text-field
            v-model="place.planNumber"
            label="Plan number"
            dense
            outlined
            background-color="white"
            hide-details
          />
        </v-col>
      </v-row>

      <v-divider class="my-3" />

      <PreviousOwnershipsEditor
        v-model="place.previousOwnerships"
        :place-id="placeId"
      />
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
  </v-card>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import { pick } from 'lodash';
import axios from 'axios';

import { PLACE_URL } from '@/urls';

import OwnershipsEditor from '@/components/Sites/site-forms/legal-and-zoning/OwnershipsEditor';
import PreviousOwnershipsEditor from '@/components/Sites/site-forms/legal-and-zoning/PreviousOwnershipsEditor';

export default {
  name: 'LegalAndZoning',
  components: {
    OwnershipsEditor,
    PreviousOwnershipsEditor,
  },
  props: {
    placeId: {
      type: [Number, String],
      required: true,
    },
  },
  computed: {
    ...mapGetters({
      place: 'places/place',
    }),
  },
  methods: {
    ...mapActions({
      savePlace: 'places/save',
    }),
    saveChanges() {
      const body = pick(this.place, [
        'block',
        'groupYHSI',
        'lAGroup',
        'lot',
        'planNumber',
        'siteDistrictNumber',
        'townSiteMapNumber',
        'zoning',
        'ownerships',
        'previousOwnerships',
      ]);

      axios
        .put(`${PLACE_URL}/${this.placeId}/legal`, body)
        .then((resp) => {
          this.$emit('showAPIMessages', resp.data);
        })
        .catch((err) => {
          this.$emit('showError', err);
        });
    },
  },
};
</script>
