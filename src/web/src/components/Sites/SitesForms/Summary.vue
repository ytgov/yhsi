<template>
  <div>
    <v-card-title style="width: 100%; display: block">
      Summary
      <div class="float-right">
        <v-btn class="my-0" color="primary" @click="saveChanges()">Save</v-btn>
      </div>
    </v-card-title>
    <v-divider class="mb-5"></v-divider>
    <v-form v-model="valid">
      <div class="row mx-1">
        <div class="col-md-6">
          <v-text-field
            dense
            outlined
            v-model="fields.yHSIId"
            label="YHSI ID"
            required
            readonly
            append-icon="mdi-lock"
          ></v-text-field>

          <v-select
            dense
            outlined
            v-model="fields.designations"
            :items="designationOptions"
            clearable
            label="Designations"
          ></v-select>

          <v-select
            dense
            outlined
            v-model="fields.category"
            clearable
            label="CRHP category"
            :items="categoryOptions"
            item-text="text"
            item-value="id"
          ></v-select>

          <v-select
            dense
            outlined
            v-model="fields.siteCategories"
            :items="siteCategoryOptions"
            item-text="text"
            item-value="text"
            multiple
            clearable
            label="Site categories"
          ></v-select>

          <v-select
            dense
            outlined
            v-model="fields.records"
            :items="recordOptions"
            clearable
            label="Records"
          ></v-select>

          <v-checkbox
            dense
            outlined
            v-model="fields.showInRegister"
            label="Show in Register?"
          ></v-checkbox>
        </div>

        <div class="col-md-6">
          <v-text-field
            dense
            outlined
            v-model="fields.primaryName"
            label="Primary name"
            required
          ></v-text-field>

          <v-card class="default mb-5">
            <v-card-text>
              <h3>Secondary Names</h3>
              <div class="row" v-for="(item, i) of names" :key="i">
                <div class="col-md-10">
                  <v-text-field
                    dense
                    outlined
                    background-color="white"
                    v-model="item.description"
                    label="Secondary name"
                    hide-details
                  >
                  </v-text-field>
                </div>

                <div class="col-md-2">
                  <v-btn
                    color="warning"
                    x-small
                    fab
                    title="Remove"
                    class="my-0 float-right"
                    @click="removeName(i)"
                    ><v-icon>mdi-close</v-icon></v-btn
                  >
                     <v-text-field
                      v-model="fields.primaryName"
                      label="Primary Name"
                      required
                    ></v-text-field>

                    <div class="mb-2">Secondary Names</div>
                    <v-alert v-for="(item, i) in fields.secondaryNames" :key="`secondary-name-${i}`"
                          outlined
                          color="primary"
                        >
                        <div class="sub-title">
                          Secondary name {{i+1}} 
                        </div>
                        <v-btn
                          icon
                          color="primary"
                          class="top-right-button"
                          @click="removeItem('secondaryNames', i)"
                        >
                          <v-icon dark>mdi-close-circle</v-icon>
                        </v-btn>
                        <v-text-field 
                          v-model="item.name"
                          label="Name"
                          required
                        ></v-text-field>
                    </v-alert>
                    <v-btn
                    outlined
                    color="primary"
                    @click="addItem('secondaryNames')"
                    >
                        Add New
                    </v-btn>

                    <v-text-field 
                      v-model="fields.contributingResources"
                      label="Contributing Resources"
                      required
                    ></v-text-field>

                    <div class="mb-2">Historical Patterns</div>
                    <v-alert v-for="(item, i) in fields.historicalPatterns" :key="`historical-pattern-${i}`"
                          outlined
                          color="primary"
                        >
                        <div class="sub-title">
                          Historical Pattern {{i+1}}
                        </div>
                        <v-btn
                          icon
                          color="primary"
                          class="top-right-button"
                          @click="removeItem('historicalPatterns', i)"
                        >
                          <v-icon dark>mdi-close-circle</v-icon>
                        </v-btn>
                        <v-combobox
                        v-model="item.pattern"
                        label="Historical Pattern"
                      ></v-combobox>
                        <v-text-field
                          v-model="item.comment"
                          label="Comments"
                          required
                        ></v-text-field>
                    </v-alert>
                    <v-btn
                    outlined
                    color="primary"
                    @click="addItem('historicalPatterns')"
                    >
                        Add New
                    </v-btn>
                  </v-col>
                  <v-text-field
            dense
            outlined
            v-model="fields.contributingResources"
            label="Contribuiting resources"
            required
          ></v-text-field>

          <v-card class="default mb-5">
            <v-card-text>
              <h3>Historical Patterns</h3>
              <div class="row" v-for="(item, i) of historicalPatterns" :key="i">
                <div class="col-md-10">
                  <v-select
                    dense
                    outlined
                    :items="historicalPatternOptions"
                    v-model="item.historicalPatternType"
                    item-text="text"
                    item-value="value"
                    background-color="white"
                    label="Historical pattern"
                  ></v-select>
                  <v-text-field
                    dense
                    outlined
                    v-model="item.comments"
                    background-color="white"
                    label="Comments"
                    required
                    hide-details
                  ></v-text-field>
                </div>

                <div class="col-md-2">
                  <v-btn
                    color="warning"
                    x-small
                    fab
                    title="Remove"
                    class="my-0 float-right"
                    @click="removePattern(i)"
                    ><v-icon>mdi-close</v-icon>
                  </v-btn>
                </div>

                <div v-if="i < historicalPatterns.length - 1" class="col-md-12">
                  <hr />
                </div>
              </div>
              <v-btn class="mt-5" color="info" @click="addPattern()">
                Add Historical Pattern
              </v-btn>
            </v-card-text>
          </v-card>
                </v-row>
                <v-divider class="mt-2 mb-2"></v-divider>
                <v-btn color="success">Save Changes</v-btn>
              </v-container>
            </v-form>
        </div> 
</template>

<script>
import axios from "axios";
import { PLACE_URL, STATIC_URL } from "../../../urls";
/* Important**, field data that was not found on the swaggerhub api docs provided was assumed to be in development, hence, some placeholder variables were created. */
export default {
  name: "formSummary",
  data: () => ({
    valid: false,
    loadedId: 0,

    designationOptions: [],
    crhpCategoryOptions: [],
    siteCategoryOptions: [],
    recordOptions: [],
    categoryOptions: [
      { text: "None Selected", id: 0 },
      { text: "Building", id: 1 },
      { text: "District", id: 2 },
      { text: "Place", id: 3 },
      { text: "Structure", id: 4 },
    ],
    historicalPatternOptions: [],

    generalRules: [
      (v) => !!v || "This input is required",
      (v) =>
        (v && v.length <= 20) || "This input must be less than 20 characters",
    ],
    names: [],
    historicalPatterns: [],
    fields: {
      primaryName: "", //
      yHSIId: "", //
      /* Placeholder variables below this line **Read above** */
      secondaryNames: [],
      /*Field data from the swaggerhub api docs below this line*/
      contributingResources: "", //
      category: "", //
      designations: "", //
      records: "", //
      showInRegister: "", //
      siteCategories: "", //
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
    "$route.params.id": {
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

      this.loadedId = id;

      axios
        .get(`${PLACE_URL}/${id}`)
        .then((resp) => {
          this.fields = resp.data.data;
          this.names = resp.data.relationships.names.data;
          this.historicalPatterns = resp.data.relationships.historicalPatterns.data;
        })
        .catch((error) => console.error(error));
    },

    addName() {
      this.names.push({ description: "", placeId: this.entity_id });
    },
    removeName(index) {
      this.names.splice(index, 1);
    },
    addPattern() {
      this.historicalPatterns.push({ pattern: "", comments: "" });
    },
    removePattern(index) {
      this.historicalPatterns.splice(index, 1);
    },
    saveChanges() {
      console.log("SAVING", this.fields);
    },
  },
};
</script>
