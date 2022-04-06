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
            v-model="yHSIId"
            dense
            outlined
            label="YHSI ID"
            required
            readonly
            append-icon="mdi-lock"
          />

          <DesignationTypesSelect
            v-model="designations"
            dense
            outlined
            clearable
          />

          <CategoryTypesSelect
            v-model="category"
            dense
            outlined
          />

          <SiteCategoryTypesSelect
            v-model="siteCategories"
            dense
            outlined
            clearable
          />

          <RecordTypesSelect
            v-model="records"
            dense
            outlined
            clearable
          />

          <ContributingResourceTypesSelect
            v-model="contributingResources"
            dense
            outlined
            required
          />

          <v-checkbox
            v-model="showInRegister"
            dense
            outlined
            label="Show in Register?"
          />
        </v-col>
        <v-col cols="6">
          <v-text-field
            v-model="primaryName"
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
                v-for="(item, i) in names"
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
                v-for="(item, i) of historicalPatterns"
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
                  v-if="i < historicalPatterns.length - 1"
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
                @click="addPattern()"
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
import { mapActions, mapGetters } from 'vuex';

import store from '@/store';
import { UserRoles } from '@/authorization';

import placeEditsApi from '@/apis/place-edits-api';
import placesSummaryApi from '@/apis/places-summary-api';

import CategoryTypesSelect from '@/components/Sites/CategoryTypesSelect';
import ContributingResourceTypesSelect from '@/components/Sites/ContributingResourceTypesSelect';
import DesignationTypesSelect from '@/components/Sites/DesignationTypesSelect';
import HistoricalPatternTypesSelect from '@/components/Sites/HistoricalPatternTypesSelect';
import RecordTypesSelect from '@/components/Sites/RecordTypesSelect';
import SiteCategoryTypesSelect from '@/components/Sites/SiteCategoryTypesSelect';

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
  data: () => ({
    category: '',
    contributingResources: [],
    designations: [],
    historicalPatterns: [],
    names: [],
    primaryName: '',
    records: [],
    showInRegister: false,
    siteCategories: [],
    yHSIId: '',
  }),
  computed: {
    ...mapGetters({
      currentUserRoles: 'profile/role_list',
      place: 'places/place',
    }),
  },
  mounted() {
    this.initializeOrGetCachedPlace(this.placeId).then((place) => {
      this.category = place.category;
      this.contributingResources = place.contributingResources;
      this.designations = place.designations;
      this.historicalPatterns = place.historicalPatterns;
      this.names = place.names;
      this.primaryName = place.primaryName;
      this.records = place.records;
      this.showInRegister = place.showInRegister;
      this.siteCategories = place.siteCategories;
      this.yHSIId = place.yHSIId;

      store.dispatch('addSiteHistory', place);
    });
  },
  methods: {
    ...mapActions({
      initializeOrGetCachedPlace: 'places/initializeOrGetCached',
    }),
    addName() {
      this.names.push({ description: '', placeId: this.placeId });
    },
    removeName(index) {
      this.names.splice(index, 1);
    },
    addPattern() {
      this.historicalPatterns.push({
        historicalPatternType: 1,
        comments: '',
        placeId: this.placeId,
      });
    },
    removePattern(index) {
      this.historicalPatterns.splice(index, 1);
    },
    saveChanges() {
      const data = {
        yHSIId: this.yHSIId,
        primaryName: this.primaryName,
        designations: this.designations,
        category: this.category,
        siteCategories: this.siteCategories,
        records: this.records,
        showInRegister: this.showInRegister,
        names: this.names,
        contributingResources: this.contributingResources,
        historicalPatterns: this.historicalPatterns,
      };
      if (
        this.currentUserRoles.some((role) =>
          [UserRoles.SITE_ADMIN, UserRoles.ADMINISTRATOR].includes(role)
        )
      ) {
        return this.saveDirectly(data);
      }

      return this.saveAsChangeRequest(data);
    },
    saveAsChangeRequest(data) {
      return placeEditsApi
        .post({ ...this.place, ...data, placeId: this.placeId })
        .then((data) => {
          this.$emit('showAPIMessages', data);
        })
        .catch((error) => {
          this.$emit('showError', error);
        });
    },
    saveDirectly(data) {
      return placesSummaryApi
        .put(this.placeId, data)
        .then((data) => {
          this.$emit('showAPIMessages', data);
        })
        .catch((error) => {
          this.$emit('showError', error);
        });
    },
  },
};
</script>
