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
                <DateTypesSelect
                  v-model="item.type"
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
                  v-model="datesFromMenus[i]"
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
                    @input="datesFromMenus[i] = false"
                  />
                </v-menu>
              </v-col>
              <v-col col="5">
                <v-menu
                  v-model="datesToMenus[i]"
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
                    @input="datesToMenus[i] = false"
                  />
                </v-menu>
              </v-col>
              <v-col cols="2" />
            </v-row>
            <v-row
              v-if="i < dates.length - 1"
              class="my-0"
            >
              <v-col cols="10">
                <v-divider class="black" />
              </v-col>
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
      <v-card
        tag="section"
        class="default mb-5"
      >
        <v-card-title
          tag="h3"
          class="mb-0 text-h6"
        >
          Construction Periods
        </v-card-title>
        <v-card-text tag="form">
          <v-row
            v-for="(item, i) in constructionPeriods"
            :key="i"
          >
            <v-col cols="10">
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
            </v-col>
            <v-col cols="2">
              <v-btn
                title="Remove"
                color="warning"
                x-small
                fab
                class="my-0"
                @click="removePeriod(i)"
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
            @click="addPeriod()"
          >
            Add construction period
          </v-btn>
        </v-card-actions>
      </v-card>
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

import DateTypesSelect from '@/components/Sites/site-forms/DateTypesSelect';

/* Important**, field data that was not found on the swaggerhub api docs provided was assumed to be in development, hence, some placeholder variables were created. */
export default {
  name: 'Dates',
  components: {
    DateTypesSelect,
  },
  props: {
    placeId: {
      type: [Number, String],
      required: true,
    },
  },
  data: () => ({
    dates: [],
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
    datesFromMenus: [],
    datesToMenus: [],
  }),
  mounted() {
    axios
      .get(`${PLACE_URL}/${this.placeId}`)
      .then((resp) => {
        this.fields = resp.data.data;
        this.placeId = this.fields.id;
        this.constructionPeriods =
          resp.data.relationships.constructionPeriods.data;
        this.dates = resp.data.relationships.dates.data;

        this.datesFromMenus = this.dates.map(() => false);
        this.datesToMenus = this.dates.map(() => false);

        store.dispatch('addSiteHistory', resp.data.data);
      })
      .catch((error) => console.error(error));

    axios.get(`${STATIC_URL}/construction-period`).then((resp) => {
      this.constructionPeriodOptions = resp.data.data;
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
        placeId: this.placeId,
        type: 1,
        fromDate: '1900-01-01',
        toDate: '1901-01-01',
      });
    },
    removeDate(index) {
      this.dates.splice(index, 1);
    },
    addPeriod() {
      this.constructionPeriods.push({ placeId: this.placeId, type: 2 });
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
