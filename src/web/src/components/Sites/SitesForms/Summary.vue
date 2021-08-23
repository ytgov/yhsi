<template>
  <div>
    <v-card-title primary-title> Summary </v-card-title>
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
            label="CRHP Category"
          ></v-select>

          <v-select
            dense
            outlined
            v-model="fields.siteCategories"
            :items="siteCategoryOptions"
            clearable
            label="Site Categories"
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
            label="Primary Name"
            required
          ></v-text-field>

          <div class="mb-2">Secondary Names</div>
          <v-alert
            v-for="(item, i) of fields.secondaryNames"
            :key="i"
            outlined
            color="primary"
          >
            <div class="sub-title">Secondary name {{ i + 1 }}</div>
            <v-btn
              icon
              color="primary"
              class="top-right-button"
              @click="removeItem('secondaryNames', i)"
            >
              <v-icon dark>mdi-minus-circle</v-icon>
            </v-btn>
            <v-text-field
              v-model="item.name"
              label="Name"
              required
            ></v-text-field>
          </v-alert>
          <v-btn outlined color="primary" @click="addItem('secondaryNames')">
            Add New
          </v-btn>

          <v-text-field
            dense
            outlined
            v-model="fields.contributingResources"
            label="Contribuiting Resources"
            required
          ></v-text-field>

          <div class="mb-2">Historical Patterns</div>
          <v-alert
            v-for="(item, i) of historicalPatterns"
            :key="i"
            outlined
            color="primary"
          >
            <div class="sub-title">Historical Pattern {{ i + 1 }}</div>
            <v-btn
              icon
              color="primary"
              class="top-right-button"
              @click="removeItem('historicalPatterns', i)"
            >
              <v-icon dark>mdi-minus-circle</v-icon>
            </v-btn>
            <v-combobox
              dense
              outlined
              v-model="item.pattern"
              label="Historical Pattern"
            ></v-combobox>
            <v-text-field
              dense
              outlined
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
        </div>
      </div>
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

    generalRules: [
      (v) => !!v || "This input is required",
      (v) => v.length <= 20 || "This input must be less than 20 characters",
    ],
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
          console.log("PLACE", this.fields);

          if (!this.fields.historicalPatterns)
            this.fields.historicalPatterns = [];

          if (!this.fields.secondaryNames) this.fields.secondaryNames = [];
        })
        .catch((error) => console.error(error));
    },

    removeItem(objName, position) {
      if (position > -1) {
        this.fields[objName].splice(position, 1);
      }
    },
    addItem(objName) {
      console.log(objName);
      switch (
        objName // Selects which structure to add to the new element of the array
      ) {
        case "historicalPatterns":
          this.historicalPatterns.push({ pattern: "", comments: "" });
          break;
        case "secondaryNames":
          this.fields[objName].push({ name: "" });
          break;
      }
    },
  },
};
</script>
