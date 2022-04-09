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
      Dates &amp; Condition
    </v-card-title>
    <v-card-text>
      <DatesEditor
        v-model="dates"
        :place-id="placeId"
      />
      <v-divider class="mt-2 mb-4" />
      <ConstructionPeriodsEditor
        v-model="constructionPeriods"
        :place-id="placeId"
      />
      <v-divider class="mt-2 mb-2" />

      <v-card
        class="default"
        tag="section"
      >
        <v-card-title
          tag="h3"
          class="mb-0 text-h6"
        >
          Conditions
        </v-card-title>
        <v-card-text>
          <v-row>
            <v-col cols="6">
              <v-select
                v-model="fields.floorCondition"
                item-text="text"
                item-value="value"
                :items="conditionOptions"
                label="Floor condition"
                dense
                outlined
                background-color="white"
              />
              <v-select
                v-model="fields.roofCondition"
                item-text="text"
                item-value="value"
                :items="conditionOptions"
                label="Roof condition"
                dense
                outlined
                background-color="white"
              />
              <v-select
                v-model="fields.wallCondition"
                item-text="text"
                item-value="value"
                :items="conditionOptions"
                label="Wall condition"
                dense
                outlined
                background-color="white"
              />
              <v-select
                v-model="fields.doorCondition"
                item-text="text"
                item-value="value"
                :items="conditionOptions"
                label="Door condition"
                dense
                outlined
                background-color="white"
              />
            </v-col>
            <v-col cols="6">
              <v-select
                v-model="fields.siteStatus"
                :items="siteStatusOptions"
                item-text="text"
                item-value="value"
                label="Site status"
                dense
                outlined
                background-color="white"
              />

              <v-text-field
                v-model="fields.buildingSize"
                item-text="name"
                item-value="id"
                label="Building size"
                dense
                outlined
                background-color="white"
              />

              <v-text-field
                v-model="fields.resourceType"
                item-text="name"
                item-value="id"
                label="All other resource types"
                dense
                outlined
                background-color="white"
              />

              <v-textarea
                v-model="fields.conditionComment"
                item-text="name"
                item-value="id"
                label="Condition notes"
                dense
                outlined
                background-color="white"
              />
            </v-col>
          </v-row>
        </v-card-text>
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

import store from '@/store';
import { PLACE_URL, STATIC_URL } from '@/urls';

import ConstructionPeriodsEditor from '@/components/Sites/site-forms/dates/ConstructionPeriodsEditor';
import DatesEditor from '@/components/Sites/site-forms/dates/DatesEditor';

/* Important**, field data that was not found on the swaggerhub api docs provided was assumed to be in development, hence, some placeholder variables were created. */
export default {
  name: 'Dates',
  components: {
    ConstructionPeriodsEditor,
    DatesEditor,
  },
  props: {
    placeId: {
      type: [Number, String],
      required: true,
    },
  },
  data: () => ({
    constructionPeriods: [],
    conditionOptions: [],
    dates: [],
    siteStatusOptions: [],

    fields: {
      /* Placeholder variables below this line **Read above** */
      /*Field data from the swaggerhub api docs below this line*/
      buildingSize: '', //
      conditionComment: '', //
      doorCondition: '', //
      floorCondition: '', //
      resourceType: '', //
      roofCondition: '', //
      siteStatus: '', //
      wallCondition: '', //
    },
  }),
  mounted() {
    axios
      .get(`${PLACE_URL}/${this.placeId}`)
      .then((resp) => {
        this.fields = resp.data.data;
        this.constructionPeriods =
          resp.data.relationships.constructionPeriods.data;
        this.dates = resp.data.relationships.dates.data;

        store.dispatch('addSiteHistory', resp.data.data);
      })
      .catch((error) => console.error(error));

    axios.get(`${STATIC_URL}/condition`).then((resp) => {
      this.conditionOptions = resp.data.data;
    });

    axios.get(`${STATIC_URL}/site-status`).then((resp) => {
      this.siteStatusOptions = resp.data.data;
    });
  },
  methods: {
    saveChanges() {
      let body = {
        buildingSize: this.fields.buildingSize,
        conditionComment: this.fields.conditionComment,
        doorCondition: this.fields.doorCondition,
        floorCondition: this.fields.floorCondition,
        resourceType: this.fields.resourceType,
        roofCondition: this.fields.roofCondition,
        siteStatus: this.fields.siteStatus,
        wallCondition: this.fields.wallCondition,
        dates: this.dates,
        constructionPeriods: this.constructionPeriods,
      };

      axios
        .put(`${PLACE_URL}/${this.placeId}/dates`, body)
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
