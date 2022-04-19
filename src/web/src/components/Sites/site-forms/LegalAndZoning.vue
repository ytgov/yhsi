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
      <v-card
        class="default mb-0"
        tag="section"
      >
        <v-card-title
          tag="h3"
          class="mb-0 text-h6"
        >
          Ownerships
        </v-card-title>
        <v-card-text tag="form">
          <v-row
            v-for="(item, i) in ownerships"
            :key="i"
          >
            <v-col cols="5">
              <v-select
                v-model="item.ownershipType"
                :items="categoryOptions"
                label="Category of Property"
                dense
                outlined
                background-color="white"
                hide-details
              />
            </v-col>
            <v-col cols="5">
              <v-text-field
                v-model="item.comments"
                label="Comments"
                dense
                outlined
                background-color="white"
                hide-details
              />
            </v-col>

            <v-col cols="2">
              <v-btn
                color="warning"
                x-small
                fab
                title="Remove"
                class="my-0 float-right"
                @click="removeOwner(i)"
              >
                <v-icon>mdi-close</v-icon>
              </v-btn>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-btn
            class="my-0"
            color="info"
            @click="addOwner"
          >
            Add Ownership
          </v-btn>
        </v-card-actions>
      </v-card>

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

      <v-card
        class="default mb-0"
        tag="section"
      >
        <v-card-title
          tag="h3"
          class="mb-0 text-h6"
        >
          Previous Ownerships
        </v-card-title>
        <v-card-text tag="form">
          <v-row
            v-for="(item, i) in prevOwnerships"
            :key="i"
            class="row"
          >
            <v-col cols="5">
              <v-text-field
                v-model="item.ownershipDate"
                label="Dates"
                dense
                outlined
                background-color="white"
                hide-details
              />
            </v-col>
            <v-col cols="5">
              <v-text-field
                v-model="item.ownershipNumber"
                label="Title number"
                dense
                outlined
                background-color="white"
                hide-details
              />
            </v-col>

            <v-col cols="2">
              <v-btn
                color="warning"
                x-small
                fab
                title="Remove"
                class="my-0 float-right"
                @click="removePrevOwner(i)"
              >
                <v-icon>mdi-close</v-icon>
              </v-btn>
            </v-col>
            <v-col cols="12">
              <v-text-field
                v-model="item.ownershipName"
                label="Names"
                dense
                outlined
                background-color="white"
                hide-details
              />
            </v-col>
            <v-col
              v-if="i < prevOwnerships.length - 1"
              cols="12"
            >
              <v-divider class="black" />
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-btn
            class="my-0"
            color="info"
            @click="addPrevOwner"
          >
            Add Previous Ownership
          </v-btn>
        </v-card-actions>
      </v-card>
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

import { PLACE_URL, STATIC_URL } from '@/urls';

/* Important**, field data that was not found on the swaggerhub api docs provided was assumed to be in development, hence, some placeholder variables were created. */
export default {
  name: 'LegalAndZoning',
  props: {
    placeId: {
      type: [Number, String],
      required: true,
    },
  },
  data: () => ({
    ownerships: [],
    categoryOptions: [],
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

    axios.get(`${STATIC_URL}/ownership-types`).then((resp) => {
      this.categoryOptions = resp.data.data;
    });
  },
  methods: {
    addOwner() {
      this.ownerships.push({
        ownershipType: 1,
        placeId: this.placeId,
      });
    },
    removeOwner(index) {
      this.ownerships.splice(index, 1);
    },
    addPrevOwner() {
      this.prevOwnerships.push({
        ownershipDate: '',
        ownershipNumber: '',
        ownershipName: '',
        placeId: this.placeId,
      });
    },
    removePrevOwner(index) {
      this.prevOwnerships.splice(index, 1);
    },
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
