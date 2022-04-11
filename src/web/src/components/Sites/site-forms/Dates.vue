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
              <ConditionTypesSelect
                v-model="fields.floorCondition"
                label="Floor condition"
                dense
                outlined
                background-color="white"
              />
              <ConditionTypesSelect
                v-model="fields.roofCondition"
                label="Roof condition"
                dense
                outlined
                background-color="white"
              />
              <ConditionTypesSelect
                v-model="fields.wallCondition"
                label="Wall condition"
                dense
                outlined
                background-color="white"
              />
              <ConditionTypesSelect
                v-model="fields.doorCondition"
                label="Door condition"
                dense
                outlined
                background-color="white"
              />
            </v-col>
            <v-col cols="6">
              <SiteStatusTypesSelect
                v-model="fields.siteStatus"
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
import { PLACE_URL } from '@/urls';

import ConditionTypesSelect from '@/components/Sites/site-forms/ConditionTypesSelect';
import ConstructionPeriodsEditor from '@/components/Sites/site-forms/dates/ConstructionPeriodsEditor';
import DatesEditor from '@/components/Sites/site-forms/dates/DatesEditor';
import SiteStatusTypesSelect from '@/components/Sites/site-forms/SiteStatusTypesSelect';

/* Important**, field data that was not found on the swaggerhub api docs provided was assumed to be in development, hence, some placeholder variables were created. */
export default {
  name: 'Dates',
  components: {
    ConditionTypesSelect,
    ConstructionPeriodsEditor,
    DatesEditor,
    SiteStatusTypesSelect,
  },
  props: {
    placeId: {
      type: [Number, String],
      required: true,
    },
  },
  data: () => ({
    constructionPeriods: [],
    dates: [],

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
