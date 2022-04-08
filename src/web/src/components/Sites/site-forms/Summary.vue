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
      Summary
    </v-card-title>
    <v-card-text>
      <v-row>
        <v-col cols="6">
          <v-text-field
            v-model="place.yHSIId"
            dense
            outlined
            label="YHSI ID"
            required
            readonly
            append-icon="mdi-lock"
          />

          <DesignationTypesSelect
            v-model="place.designations"
            dense
            outlined
            clearable
          />

          <CategoryTypesSelect
            v-model="place.category"
            dense
            outlined
          />

          <SiteCategoryTypesSelect
            v-model="place.siteCategories"
            dense
            outlined
            clearable
          />

          <RecordTypesSelect
            v-model="place.records"
            dense
            outlined
            clearable
          />

          <ContributingResourceTypesSelect
            v-model="place.contributingResources"
            dense
            outlined
            required
          />

          <v-checkbox
            v-model="place.showInRegister"
            dense
            outlined
            label="Show in Register?"
          />
        </v-col>
        <v-col cols="6">
          <v-text-field
            v-model="place.primaryName"
            dense
            outlined
            label="Primary name"
            required
          />
          <v-card class="default mb-5">
            <v-card-title
              tag="h3"
              class="mb-0 text-h6"
            >
              Secondary Names
            </v-card-title>
            <v-card-text>
              <v-row
                v-for="(item, i) in place.names"
                :key="i"
              >
                <v-col cols="10">
                  <v-text-field
                    v-model="item.description"
                    dense
                    outlined
                    background-color="white"
                    label="Secondary name"
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
                    @click="removeName(i)"
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
                @click="addName"
              >
                Add New Secondary Name
              </v-btn>
            </v-card-actions>
          </v-card>

          <v-card class="default mb-5">
            <v-card-text>
              <h3>Historical Patterns</h3>
              <v-row
                v-for="(item, i) of place.historicalPatterns"
                :key="i"
                class="row"
              >
                <v-col cols="10">
                  <HistoricalPatternTypesSelect
                    v-model="item.historicalPatternType"
                    dense
                    outlined
                    background-color="white"
                  />
                  <v-text-field
                    v-model="item.comments"
                    dense
                    outlined
                    background-color="white"
                    label="Comments"
                    required
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
                    @click="removePattern(i)"
                  >
                    <v-icon>mdi-close</v-icon>
                  </v-btn>
                </v-col>

                <v-col
                  v-if="i < place.historicalPatterns.length - 1"
                  cols="12"
                >
                  <hr />
                </v-col>
              </v-row>
            </v-card-text>
            <v-card-actions>
              <v-btn
                class="my-0"
                color="info"
                @click="addPattern"
              >
                Add Historical Pattern
              </v-btn>
            </v-card-actions>
          </v-card>
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
  </v-card>
</template>

<script>
import { pick } from 'lodash';
import { mapActions, mapGetters } from 'vuex';

import CategoryTypesSelect from '@/components/Sites/site-forms/CategoryTypesSelect';
import ContributingResourceTypesSelect from '@/components/Sites/site-forms/ContributingResourceTypesSelect';
import DesignationTypesSelect from '@/components/Sites/site-forms/DesignationTypesSelect';
import HistoricalPatternTypesSelect from '@/components/Sites/site-forms/HistoricalPatternTypesSelect';
import RecordTypesSelect from '@/components/Sites/site-forms/RecordTypesSelect';
import SiteCategoryTypesSelect from '@/components/Sites/site-forms/SiteCategoryTypesSelect';

export default {
  name: 'Summary',
  components: {
    CategoryTypesSelect,
    ContributingResourceTypesSelect,
    DesignationTypesSelect,
    HistoricalPatternTypesSelect,
    RecordTypesSelect,
    SiteCategoryTypesSelect,
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
    addName() {
      this.place.names.push({ description: '', placeId: this.placeId });
    },
    removeName(index) {
      this.place.names.splice(index, 1);
    },
    addPattern() {
      this.place.historicalPatterns.push({
        historicalPatternType: 1,
        comments: '',
        placeId: this.placeId,
      });
    },
    removePattern(index) {
      this.place.historicalPatterns.splice(index, 1);
    },
    saveChanges() {
      const data = pick(this.place, [
        'yHSIId',
        'primaryName',
        'designations',
        'category',
        'siteCategories',
        'records',
        'showInRegister',
        'names',
        'contributingResources',
        'historicalPatterns',
      ]);
      return this.savePlace(data);
    },
  },
};
</script>
