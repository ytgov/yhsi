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
            v-model="fields.yHSIId"
            dense
            outlined
            label="YHSI ID"
            required
            readonly
            append-icon="mdi-lock"
          />

          <v-select
            v-model="fields.designations"
            dense
            outlined
            multiple
            :items="designationOptions"
            clearable
            label="Designations"
          />

          <v-select
            v-model="fields.category"
            dense
            outlined
            clearable
            label="CRHP category"
            :items="categoryOptions"
          />

          <v-select
            v-model="fields.siteCategories"
            dense
            outlined
            clearable
            multiple
            label="Site Categories"
            :items="siteCategoryOptions"
          />

          <v-select
            v-model="fields.records"
            dense
            outlined
            multiple
            :items="recordOptions"
            item-text="text"
            item-value="value"
            clearable
            label="Records"
          />

          <v-text-field
            v-model="fields.contributingResources"
            dense
            outlined
            multiple
            label="Contribuiting resources"
            required
          />

          <v-checkbox
            v-model="fields.showInRegister"
            dense
            outlined
            label="Show in Register?"
          />
        </v-col>
        <v-col cols="6">
          <v-text-field
            v-model="fields.primaryName"
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
                  <v-select
                    v-model="item.historicalPatternType"
                    dense
                    outlined
                    :items="historicalPatternOptions"
                    item-text="text"
                    item-value="value"
                    background-color="white"
                    label="Historical pattern"
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
import axios from 'axios';
import store from '@/store';

import { PLACE_URL, STATIC_URL } from '@/urls';
import categoryTypesApi from '@/apis/category-types-api';

export default {
  name: 'Summary',
  props: {
    placeId: {
      type: [Number, String],
      required: true,
    },
  },
  data: () => ({
    loadedId: 0,
    designationOptions: [],
    recordOptions: [],
    categoryOptions: [],
    historicalPatternOptions: [],
    siteCategoriesOptions: [],
    names: [],
    historicalPatterns: [],
    fields: {
      primaryName: '',
      yHSIId: '',
      secondaryNames: [],
      contributingResources: [],
      category: '',
      designations: [],
      records: [],
      showInRegister: false,
      siteCategories: [],
    },
  }),
  mounted() {
    this.loadItem(this.placeId);

    axios.get(`${STATIC_URL}/designation-type`).then((resp) => {
      this.designationOptions = resp.data.data;
    });
    categoryTypesApi.getAll().then(({ data }) => {
      this.categoryOptions = data;
    });
    axios.get(`${STATIC_URL}/record-type`).then((resp) => {
      this.recordOptions = resp.data.data;
    });
    axios.get(`${STATIC_URL}/historical-pattern`).then((resp) => {
      this.historicalPatternOptions = resp.data.data;
    });
  },
  methods: {
    loadItem(id) {
      if (id == this.loadedId) return;

      axios
        .get(`${PLACE_URL}/${id}`)
        .then((resp) => {
          this.setPlace(resp.data);
        })
        .catch((error) => console.error(error));
    },
    setPlace(place) {
      this.loadedId = place.data.id;
      this.fields = place.data;
      this.names = place.relationships.names.data;
      this.historicalPatterns = place.relationships.historicalPatterns.data;
      this.fields.designations = parseInt(place.data.designations);
      this.fields.records = parseInt(place.data.records);

      store.dispatch('addSiteHistory', place.data);
      this.$parent.siteName = this.fields.primaryName;
    },
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
      let body = {
        yHSIId: this.fields.yHSIId,
        primaryName: this.fields.primaryName,
        designations: this.fields.designations,
        category: this.fields.category,
        siteCategories: this.fields.siteCategories,
        records: this.fields.records,
        showInRegister: this.fields.showInRegister,
        secondaryNames: this.names,
        contributingResources: this.fields.contributingResources,
        historicalPatterns: this.historicalPatterns,
      };

      axios
        .put(`${PLACE_URL}/${this.loadedId}/summary`, body)
        .then((resp) => {
          //this.setPlace(resp.data);
          this.$emit('showAPIMessages', resp.data);
        })
        .catch((err) => {
          this.$emit('showError', err);
        });
    },
    removeItem(objName, position) {
      if (position > -1) {
        this.fields[objName].splice(position, 1);
      }
    },
  },
};
</script>
