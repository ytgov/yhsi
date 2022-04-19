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
        v-model="ownerships"
        :place-id="placeId"
      />
      <v-divider class="my-3" />
      <v-row>
        <v-col cols="6">
          <v-text-field
            v-model="fields.zoning"
            label="Zoning"
            dense
            outlined
            background-color="white"
            hide-details
          />
        </v-col>
        <v-col cols="6">
          <v-text-field
            v-model="fields.townSiteMapNumber"
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
            v-model="fields.siteDistrictNumber"
            label="Site district"
            dense
            outlined
            background-color="white"
            hide-details
          />
        </v-col>
        <v-col cols="6">
          <v-text-field
            v-model="fields.groupYHSI"
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
            v-model="fields.lAGroup"
            label="Group"
            dense
            outlined
            background-color="white"
            hide-details
          />
        </v-col>
        <v-col cols="6">
          <v-text-field
            v-model="fields.lot"
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
            v-model="fields.block"
            label="Block"
            dense
            outlined
            background-color="white"
            hide-details
          />
        </v-col>

        <v-col cols="6">
          <v-text-field
            v-model="fields.planNumber"
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
        v-model="previousOwnerships"
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
import axios from 'axios';

import { PLACE_URL } from '@/urls';

import OwnershipsEditor from '@/components/Sites/site-forms/legal-and-zoning/OwnershipsEditor';
import PreviousOwnershipsEditor from '@/components/Sites/site-forms/legal-and-zoning/PreviousOwnershipsEditor';

/* Important**, field data that was not found on the swaggerhub api docs provided was assumed to be in development, hence, some placeholder variables were created. */
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
  data: () => ({
    ownerships: [],
    prevOwnerships: [],
    fields: {
      /*Field data from the swaggerhub api docs below this line*/
      block: '', //
      groupYHSI: '', //
      lAGroup: '', //
      lot: '', //
      planNumber: '', //
      siteDistrictNumber: '', //
      townSiteMapNumber: '', //
      zoning: '', //
    },
  }),
  mounted() {
    axios
      .get(`${PLACE_URL}/${this.placeId}`)
      .then((resp) => {
        this.fields = resp.data.data;
        this.ownerships = resp.data.relationships.ownerships.data;
        this.prevOwnerships = resp.data.relationships.previousOwnerships.data;
      })
      .catch((error) => console.error(error));
  },
  methods: {
    saveChanges() {
      let body = {
        block: this.fields.block,
        groupYHSI: this.fields.groupYHSI,
        lAGroup: this.fields.lAGroup,
        lot: this.fields.lot,
        planNumber: this.fields.planNumber,
        siteDistrictNumber: this.fields.siteDistrictNumber,
        townSiteMapNumber: this.fields.townSiteMapNumber,
        zoning: this.fields.zoning,
        ownerships: this.ownerships,
        prevOwnerships: this.prevOwnerships,
      };

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
