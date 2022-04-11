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
        v-model="place.dates"
        :place-id="placeId"
      />
      <v-divider class="mt-2 mb-4" />
      <ConstructionPeriodsEditor
        v-model="place.constructionPeriods"
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
                v-model="place.floorCondition"
                label="Floor condition"
                dense
                outlined
                background-color="white"
              />
              <ConditionTypesSelect
                v-model="place.roofCondition"
                label="Roof condition"
                dense
                outlined
                background-color="white"
              />
              <ConditionTypesSelect
                v-model="place.wallCondition"
                label="Wall condition"
                dense
                outlined
                background-color="white"
              />
              <ConditionTypesSelect
                v-model="place.doorCondition"
                label="Door condition"
                dense
                outlined
                background-color="white"
              />
            </v-col>
            <v-col cols="6">
              <SiteStatusTypesSelect
                v-model="place.siteStatus"
                dense
                outlined
                background-color="white"
              />

              <v-text-field
                v-model="place.buildingSize"
                label="Building size"
                dense
                outlined
                background-color="white"
              />

              <v-text-field
                v-model="place.resourceType"
                label="All other resource types"
                dense
                outlined
                background-color="white"
              />

              <v-textarea
                v-model="place.conditionComment"
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
import { mapActions, mapGetters } from 'vuex';
import { pick } from 'lodash';

import ConditionTypesSelect from '@/components/Sites/site-forms/ConditionTypesSelect';
import ConstructionPeriodsEditor from '@/components/Sites/site-forms/dates/ConstructionPeriodsEditor';
import DatesEditor from '@/components/Sites/site-forms/dates/DatesEditor';
import SiteStatusTypesSelect from '@/components/Sites/site-forms/SiteStatusTypesSelect';

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
  data: () => ({}),
  computed: {
    ...mapGetters({
      place: 'places/place',
    }),
  },
  mounted() {},
  methods: {
    ...mapActions({
      savePlace: 'places/save',
    }),
    saveChanges() {
      const data = pick(this.place, [
        'buildingSize',
        'conditionComment',
        'constructionPeriods',
        'dates',
        'doorCondition',
        'floorCondition',
        'resourceType',
        'roofCondition',
        'siteStatus',
        'wallCondition',
      ]);

      return this.savePlace(data);
    },
  },
};
</script>
