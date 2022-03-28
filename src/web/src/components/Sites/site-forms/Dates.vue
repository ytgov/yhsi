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
      <v-card
        tag="section"
        class="default mb-4"
      >
        <v-card-title
          tag="h3"
          class="mb-0 text-h6"
        >
          Dates
        </v-card-title>
        <v-card-text tag="form">
          <div
            v-for="(item, i) in dates"
            :key="i"
          >
            <v-row>
              <v-col cols="5">
                <v-select
                  v-model="item.type"
                  label="Date type"
                  :items="dateTypeOptions"
                  item-value="value"
                  item-text="text"
                  dense
                  outlined
                  background-color="white"
                  hide-details
                />
              </v-col>
              <v-col cols="5">
                <v-text-field
                  v-model="item.details"
                  label="Details"
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
                  class="my-0"
                  @click="removeDate(i)"
                >
                  <v-icon>mdi-close</v-icon>
                </v-btn>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="5">
                <v-menu
                  v-model="item.from_menu"
                  :close-on-content-click="false"
                  transition="scale-transition"
                  left
                  nudge-top="26"
                  offset-y
                  min-width="auto"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                      v-model="item.fromDate"
                      label="From date"
                      append-icon="mdi-calendar"
                      readonly
                      outlined
                      dense
                      hide-details
                      background-color="white"
                      v-bind="attrs"
                      v-on="on"
                    />
                  </template>
                  <v-date-picker
                    v-model="item.fromDate"
                    @input="item.from_menu = false"
                  />
                </v-menu>
              </v-col>
              <v-col col="5">
                <v-menu
                  v-model="item.to_menu"
                  :close-on-content-click="false"
                  transition="scale-transition"
                  left
                  nudge-top="26"
                  offset-y
                  min-width="auto"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                      v-model="item.toDate"
                      label="To date"
                      append-icon="mdi-calendar"
                      readonly
                      outlined
                      dense
                      hide-details
                      background-color="white"
                      v-bind="attrs"
                      v-on="on"
                    />
                  </template>
                  <v-date-picker
                    v-model="item.toDate"
                    @input="item.to_menu = false"
                  />
                </v-menu>
              </v-col>
              <v-col cols="2" />
            </v-row>
          </div>
        </v-card-text>
        <v-card-actions>
          <v-btn
            class="my-0"
            color="info"
            @click="addDate"
          >
            Add date
          </v-btn>
        </v-card-actions>
      </v-card>
      <v-divider class="mt-2 mb-4" />
      <v-card class="default mb-5">
        <v-card-text>
          <h3>Construction Periods</h3>

          <div
            v-for="(item, i) in constructionPeriods"
            :key="i"
            class="row"
          >
            <div class="col-md-10">
              <v-select
                v-model="item.type"
                :items="constructionPeriodOptions"
                item-text="text"
                item-value="value"
                label=""
                dense
                outlined
                hide-details
                background-color="white"
              />
            </div>

            <div class="col-md-2">
              <v-btn
                color="warning"
                x-small
                fab
                title="Remove"
                class="my-0 float-right"
                @click="removePeriod(i)"
              >
                <v-icon>mdi-close</v-icon>
              </v-btn>
            </div>
          </div>

          <v-btn
            color="info"
            @click="addPeriod()"
          >
            Add construction period
          </v-btn>
        </v-card-text>
      </v-card>
      <v-divider class="mt-2 mb-2" />

      <div class="row mx-1">
        <div class="col-md-6">
          <v-card class="default">
            <v-card-text>
              <h3>Conditions</h3>
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
            </v-card-text>
          </v-card>
        </div>

        <div class="col-md-6">
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
        </div>
      </div>
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

/* Important**, field data that was not found on the swaggerhub api docs provided was assumed to be in development, hence, some placeholder variables were created. */
export default {
  name: 'Dates',
  data: () => ({
    valid: false,
    loadedId: -1,

    generalRules: [
      (v) => !!v || 'This input is required',
      (v) => v.length <= 20 || 'This input must be less than 20 characters',
    ],

    dates: [],
    dateTypeOptions: [],
    constructionPeriods: [],
    constructionPeriodOptions: [],
    conditionOptions: [],
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
  created: function () {
    let id = this.$route.params.id;

    axios
      .get(`${PLACE_URL}/${id}`)
      .then((resp) => {
        this.fields = resp.data.data;
        this.loadedId = this.fields.id;
        this.constructionPeriods =
          resp.data.relationships.constructionPeriods.data;
        this.dates = resp.data.relationships.dates.data;
        store.dispatch('addSiteHistory', resp.data.data);
        this.$parent.siteName = this.fields.primaryName;
      })
      .catch((error) => console.error(error));

    axios.get(`${STATIC_URL}/construction-period`).then((resp) => {
      this.constructionPeriodOptions = resp.data.data;
    });

    axios.get(`${STATIC_URL}/date-type`).then((resp) => {
      this.dateTypeOptions = resp.data.data;
    });

    axios.get(`${STATIC_URL}/condition`).then((resp) => {
      this.conditionOptions = resp.data.data;
    });

    axios.get(`${STATIC_URL}/site-status`).then((resp) => {
      this.siteStatusOptions = resp.data.data;
    });
  },
  methods: {
    addDate() {
      this.dates.push({
        placeId: this.loadedId,
        type: 1,
        fromDate: '1900-01-01',
        toDate: '1901-01-01',
      });
    },
    removeDate(index) {
      this.dates.splice(index, 1);
    },
    addPeriod() {
      this.constructionPeriods.push({ placeId: this.loadedId, type: 2 });
    },
    removePeriod(index) {
      this.constructionPeriods.splice(index, 1);
    },

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
        .put(`${PLACE_URL}/${this.loadedId}/dates`, body)
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
