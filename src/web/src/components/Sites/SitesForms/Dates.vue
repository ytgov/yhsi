<template>
  <div>
    <v-card-title style="width: 100%; display: block">
      Dates & Condition
      <div class="float-right">
        <v-btn class="my-0" color="primary" @click="saveChanges()">Save</v-btn>
      </div>
    </v-card-title>
    <v-divider class="mb-5"></v-divider>
    <v-form v-model="valid">
      <div class="row mx-1">
        <div class="col-md-12">
          <h3>Dates</h3>

          <v-card class="default mb-4" v-for="(item, i) in dates" :key="i">
            <v-card-title>
              Date {{ 1 + i }}
              <v-spacer></v-spacer>
              <v-btn
                color="warning"
                x-small
                fab
                class="my-0"
                @click="removeDate(i)"
                ><v-icon>mdi-close</v-icon></v-btn
              ></v-card-title
            >

            <v-card-text>
              <div class="row">
                <div class="col-md-6">
                  <v-select
                    label="Date type"
                    dense
                    outlined
                    background-color="white"
                    hide-details
                  ></v-select>
                </div>
                <div class="col-md-6">
                  <v-text-field
                    v-model="item.details"
                    label="Details"
                    dense
                    outlined
                    background-color="white"
                    hide-details
                  ></v-text-field>
                </div>
                <div class="col-md-6">
                  <v-text-field
                    v-model="item.from"
                    label="From date"
                    dense
                    outlined
                    background-color="white"
                    hide-details
                  ></v-text-field>
                </div>
                <div class="col-md-6">
                  <v-text-field
                    v-model="item.to"
                    label="To date"
                    dense
                    outlined
                    background-color="white"
                    hide-details
                  ></v-text-field>
                </div>
              </div>
            </v-card-text>
          </v-card>
          <v-btn color="info" @click="addDate()">Add date</v-btn>
        </div>
      </div>

      <v-divider class="mt-2 mb-2"></v-divider>

      <div class="row mx-1">
        <div class="col-md-12">
          <h3>Construction Periods</h3>

          <v-card
            class="default mb-4"
            v-for="(item, i) in constructionPeriods"
            :key="i"
          >
            <v-card-title>
              Construction Period {{ 1 + i }}
              <v-spacer></v-spacer>
              <v-btn
                color="warning"
                x-small
                fab
                class="my-0"
                @click="removePeriod(i)"
                ><v-icon>mdi-close</v-icon></v-btn
              >
            </v-card-title>

            <v-card-text>
              <div class="row">
                <div class="col-md-6">
                  <v-select
                    v-model="item.period"
                    :items="fields.construction_periods"
                    label=""
                    dense
                    outlined
                    hide-details
                    background-color="white"
                  ></v-select>
                </div>
              </div>
            </v-card-text>
          </v-card>

          <v-btn color="info" @click="addPeriod()">
            Add construction period
          </v-btn>
        </div>
      </div>
      <v-divider class="mt-2 mb-5"></v-divider>

      <div class="row mx-1">
        <div class="col-md-6">
          <v-card class="default">
            <v-card-text>
              <h3>Conditions</h3>
              <v-select
                v-model="fields.floorCondition"
                item-text="name"
                item-value="id"
                label="Floor condition"
                dense
                outlined
                background-color="white"
              ></v-select>
              <v-select
                v-model="fields.roofCondition"
                item-text="name"
                item-value="id"
                label="Roof condition"
                dense
                outlined
                background-color="white"
              ></v-select>
              <v-select
                v-model="fields.wallCondition"
                item-text="name"
                item-value="id"
                label="Wall condition"
                dense
                outlined
                background-color="white"
              ></v-select>
              <v-select
                v-model="fields.doorCondition"
                item-text="name"
                item-value="id"
                label="Door condition"
                dense
                outlined
                background-color="white"
              ></v-select>
            </v-card-text>
          </v-card>
        </div>

        <div class="col-md-6">
          <v-select
            v-model="fields.siteStatus"
            item-text="name"
            item-value="id"
            label="Site status"
            dense
            outlined
            background-color="white"
          ></v-select>

          <v-text-field
            v-model="fields.buildingSize"
            item-text="name"
            item-value="id"
            label="Building size"
            dense
            outlined
            background-color="white"
          ></v-text-field>

          <v-text-field
            v-model="fields.resourceType"
            item-text="name"
            item-value="id"
            label="All other resource types"
            dense
            outlined
            background-color="white"
          ></v-text-field>

          <v-textarea
            v-model="fields.conditionComment"
            item-text="name"
            item-value="id"
            label="Condition notes"
            dense
            outlined
            background-color="white"
          ></v-textarea>
        </div>
      </div>
    </v-form>
  </div>
</template>

<script>
import axios from "axios";
import { PLACE_URL } from "../../../urls";
/* Important**, field data that was not found on the swaggerhub api docs provided was assumed to be in development, hence, some placeholder variables were created. */
export default {
  name: "formDates",
  data: () => ({
    valid: false,

    generalRules: [
      (v) => !!v || "This input is required",
      (v) => v.length <= 20 || "This input must be less than 20 characters",
    ],

    dates: [],
    constructionPeriods: [{}],

    fields: {
      /* Placeholder variables below this line **Read above** */
      dates: [
        { type: "construction", details: "wasd", from: "", to: "" },
        { type: "construction", details: "", from: "", to: "" },
      ],
      construction_periods: ["1", "2"], //select input
      /*Field data from the swaggerhub api docs below this line*/
      buildingSize: "", //
      conditionComment: "", //
      doorCondition: "", //
      floorCondition: "", //
      resourceType: "", //
      roofCondition: "", //
      siteStatus: "", //
      wallCondition: "", //
    },
  }),
  created: function () {
    let id = this.$route.params.id;

    axios
      .get(`${PLACE_URL}/${id}`)
      .then((resp) => {
        this.fields = resp.data.data;
        console.log("PLACE", this.fields);
      })
      .catch((error) => console.error(error));
  },
  methods: {
    addDate() {
      this.dates.push({});
    },
    removeDate(index) {
      this.dates.splice(index, 1);
    },
    addPeriod() {
      this.constructionPeriods.push({});
    },
    removePeriod(index) {
      this.constructionPeriods.splice(index, 1);
    },
  },
};
</script>