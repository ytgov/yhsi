<template>
  <div>
    <h2 class="mt-2 mb-0 ml-4 d-flex justify-space-between">
      <span class="mt-2">Summary</span>
      <v-btn
        class="my-0"
        color="primary"
        @click="saveChanges"
      >
        Save
      </v-btn>
    </h2>
    <v-divider class="mb-5" />
    <v-form v-model="valid">
      <v-container>
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
              item-text="text"
              item-value="id"
            />

            <v-select
              v-model="fields.records"
              dense
              outlined
              :items="recordOptions"
              item-text="text"
              item-value="value"
              clearable
              label="Records"
            />

            <v-select
              v-model="fields.records"
              dense
              outlined
              :items="recordOptions"
              clearable
              label="Records"
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
              <v-card-text>
                <h3>Secondary Names</h3>
                <v-row
                  v-for="(item, i) of names"
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
                <v-btn
                  class="mt-5"
                  color="info"
                  @click="addName()"
                >
                  Add New Secondary Name
                </v-btn>
              </v-card-text>
            </v-card>

            <v-text-field
              v-model="fields.contributingResources"
              dense
              outlined
              label="Contribuiting resources"
              required
            />

            <v-card class="default mb-5">
              <v-card-text>
                <h3>Historical Patterns</h3>
                <div
                  v-for="(item, i) of historicalPatterns"
                  :key="i"
                  class="row"
                >
                  <div class="col-md-10">
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
                  </div>

                  <div class="col-md-2">
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
                  </div>

                  <div
                    v-if="i < historicalPatterns.length - 1"
                    class="col-md-12"
                  >
                    <hr />
                  </div>
                </div>
                <v-btn
                  class="mt-5"
                  color="info"
                  @click="addPattern()"
                >
                  Add Historical Pattern
                </v-btn>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-form>
  </div>
</template>

<script>
import axios from 'axios';
import store from '@/store';
import { PLACE_URL, STATIC_URL } from '@/urls';

/* Important**, field data that was not found on the swaggerhub api docs provided was assumed to be in development, hence, some placeholder variables were created. */
export default {
  name: 'Summary',
  data: () => ({
    valid: false,
    loadedId: 0,

    designationOptions: [],
    crhpCategoryOptions: [],
    siteCategoryOptions: [],
    recordOptions: [],
    categoryOptions: [
      { text: 'None Selected', id: 0 },
      { text: 'Building', id: 1 },
      { text: 'District', id: 2 },
      { text: 'Place', id: 3 },
      { text: 'Structure', id: 4 },
    ],
    historicalPatternOptions: [],

    generalRules: [
      (v) => !!v || 'This input is required',
      (v) =>
        (v && v.length <= 20) || 'This input must be less than 20 characters',
    ],
    names: [],
    historicalPatterns: [],
    fields: {
      primaryName: '', //
      yHSIId: '', //
      /* Placeholder variables below this line **Read above** */
      secondaryNames: [],
      /*Field data from the swaggerhub api docs below this line*/
      contributingResources: '', //
      category: '', //
      designations: '', //
      records: [], //
      showInRegister: '', //
      siteCategories: [], //
    },
  }),
  created: function () {
    let id = this.$route.params.id;
    this.loadItem(id);

    axios.get(`${STATIC_URL}/designation-type`).then((resp) => {
      this.designationOptions = resp.data.data;
    });
    axios.get(`${STATIC_URL}/designations`).then((resp) => {
      this.crhpCategoryOptions = resp.data.data;
    });
    axios.get(`${STATIC_URL}/site-category`).then((resp) => {
      this.siteCategoryOptions = resp.data.data;
    });
    axios.get(`${STATIC_URL}/record-type`).then((resp) => {
      this.recordOptions = resp.data.data;
    });
    axios.get(`${STATIC_URL}/historical-pattern`).then((resp) => {
      this.historicalPatternOptions = resp.data.data;
    });
  },
  watch: {
    '$route.params.id': {
      handler: function (id) {
        this.entity_id = id;
        this.loadItem(this.entity_id);
      },
      deep: true,
      immediate: true,
    },
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
      this.names.push({ description: '', placeId: this.entity_id });
    },
    removeName(index) {
      this.names.splice(index, 1);
    },
    addPattern() {
      this.historicalPatterns.push({
        historicalPatternType: 1,
        comments: '',
        placeId: this.entity_id,
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
