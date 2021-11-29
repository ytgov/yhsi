<template>
    <!-- <div>
          <v-card-title primary-title>
            Dates & Condition
          </v-card-title>
          <v-divider inset></v-divider>
          <v-form v-model="valid">
              <v-container>
                <v-row>
                    <v-col cols="12">
                        <div class="mb-2">Dates</div>
                        <v-alert v-for="(item, i) in fields.dates" :key="`date:${i}`"
                                outlined
                                color="primary"
                            >
                            <div class="sub-title">
                                Date {{i+1}}
                            </div>
                            <v-btn
                                icon
                                color="primary"
                                class="top-right-button"
                                @click="removeItem('dates', i)"
                            >
                                <v-icon dark>mdi-close-circle</v-icon>
                            </v-btn>
                            <v-row>
                                <v-col
                                    cols="6"
                                >
                                    <v-combobox
                                    label="Date Type"
                                    ></v-combobox>
                                    <v-text-field
                                            v-model="item.details"
                                            label="Details"
                                            required
                                    ></v-text-field>
                                </v-col>
                                <v-col
                                    cols="6"
                                >
                                    <v-text-field
                                    v-model="item.from"
                                    label="From Date"
                                    required
                                    ></v-text-field>
                                    <v-text-field
                                    v-model="item.to"
                                    label="To Date"
                                    required
                                    ></v-text-field>
                                </v-col>
                            </v-row>
                        </v-alert>  
                        <v-btn
                        outlined
                        color="primary"
                        @click="addItem('dates')"
                        >
                            Add New
                        </v-btn>
                    </v-col>
                </v-row>
                
                <v-divider class="mt-2 mb-2"></v-divider>
                <div class="mb-2">Construction Periods</div>
                <v-row>
                    <v-col cols="12">
                        <v-alert v-for="(item, i) in fields.constructionPeriods" :key="`period:${i}`"
                                outlined
                                color="primary"
                            >
                            <div class="sub-title">
                                Construction Period {{i+1}}
                            </div>
                            <v-btn
                                icon
                                color="primary"
                                class="top-right-button"
                                @click="removeItem('constructionPeriods', i)"
                            >
                                <v-icon dark>mdi-close-circle</v-icon>
                            </v-btn>
                            <v-row>
                                <v-col
                                    cols="12"
                                >
                                    <v-combobox
                                    v-model="item.period"
                                    :items="fields.construction_periods"
                                    label=""
                                    dense
                                    ></v-combobox>
                                </v-col>
                            </v-row>
                        </v-alert>
                        <v-btn
                        outlined
                        color="primary"
                        @click="addItem('constructionPeriods')"
                        >
                            Add New
                        </v-btn>
                    </v-col>
                </v-row>
                <v-row>
                    <v-col
                        cols="6"
                    >
                        <v-row>
                            <v-col cols="6">
                                <v-combobox
                                v-model="fields.siteStatus"
                                item-text="name"
                                item-value="id"
                                label="Site Status"
                                ></v-combobox>
                            </v-col>
                            <v-col cols="6">
                                <v-combobox
                                v-model="fields.floorCondition"
                                item-text="name"
                                item-value="id"
                                label="Floor Condition"
                                ></v-combobox>
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col cols="6">
                                <v-combobox
                                v-model="fields.roofCondition"
                                item-text="name"
                                item-value="id"
                                label="Roof Condition"
                                ></v-combobox>
                            </v-col>
                            <v-col cols="6">
                            </v-col>
                        </v-row>
                    </v-col>
                    <v-col
                        cols="6"
                    >
                            <v-row>
                            <v-col cols="6">
                                <v-combobox
                                v-model="fields.wallCondition"
                                item-text="name"
                                item-value="id"
                                label="Wall Condition"
                                ></v-combobox>
                            </v-col>
                            <v-col cols="6">
                                <v-combobox
                                v-model="fields.doorCondition"
                                item-text="name"
                                item-value="id"
                                label="Door Condition"
                                ></v-combobox>
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col cols="6">
                            </v-col>
                            <v-col cols="6">
                            </v-col>
                        </v-row>
                    </v-col>
                </v-row>
                <v-row>
                        <v-col cols="6">
                            <v-text-field
                            v-model="fields.buildingSize"
                            item-text="name"
                            item-value="id"
                            label="Building Size"
                            required
                            ></v-text-field>
                            <v-text-field
                            v-model="fields.resourceType"
                            item-text="name"
                            item-value="id"
                            label="All Other Resource Types"
                            required
                            ></v-text-field>
                        </v-col>
                        <v-col cols="6">
                            <v-textarea
                            v-model="fields.conditionComment"
                            item-text="name"
                            item-value="id"
                            label="Condition Notes"
                            ></v-textarea>
                        </v-col>
                </v-row>
                <v-divider class="mt-2 mb-2"></v-divider>
                <v-btn color="success">Save Changes</v-btn>
            </v-container>
        </v-form>
    </div> -->
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
                    v-model="item.type"
                    :items="dateTypeOptions"
                    item-value="value"
                    item-text="text"
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
                        background-color="white"
                        v-bind="attrs"
                        v-on="on"
                      ></v-text-field>
                    </template>
                    <v-date-picker
                      v-model="item.fromDate"
                      @input="item.from_menu = false"
                    ></v-date-picker>
                  </v-menu>
                </div>
                <div class="col-md-6">
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
                        background-color="white"
                        v-bind="attrs"
                        v-on="on"
                      ></v-text-field>
                    </template>
                    <v-date-picker
                      v-model="item.toDate"
                      @input="item.to_menu = false"
                    ></v-date-picker>
                  </v-menu>
                </div>
              </div>
            </v-card-text>
          </v-card>
          <v-btn color="info" @click="addDate()">Add date</v-btn>
          <v-divider class="mt-2 mb-4"></v-divider>
          <v-card class="default mb-5">
            <v-card-text>
              <h3>Construction Periods</h3>

              <div
                class="row"
                v-for="(item, i) of constructionPeriods"
                :key="i"
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
                  ></v-select>
                </div>

                <div class="col-md-2">
                  <v-btn
                    color="warning"
                    x-small
                    fab
                    title="Remove"
                    class="my-0 float-right"
                    @click="removePeriod(i)"
                    ><v-icon>mdi-close</v-icon>
                  </v-btn>
                </div>
              </div>

              <v-btn color="info" @click="addPeriod()">
                Add construction period
              </v-btn>
            </v-card-text>
          </v-card>
          <v-divider class="mt-2 mb-2"></v-divider>
        </div>
      </div>

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
              ></v-select>
              <v-select
                v-model="fields.roofCondition"
                item-text="text"
                item-value="value"
                :items="conditionOptions"
                label="Roof condition"
                dense
                outlined
                background-color="white"
              ></v-select>
              <v-select
                v-model="fields.wallCondition"
                item-text="text"
                item-value="value"
                :items="conditionOptions"
                label="Wall condition"
                dense
                outlined
                background-color="white"
              ></v-select>
              <v-select
                v-model="fields.doorCondition"
                item-text="text"
                item-value="value"
                :items="conditionOptions"
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
            :items="siteStatusOptions"
            item-text="text"
            item-value="value"
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
import store from "../../../store";
import { PLACE_URL, STATIC_URL } from "../../../urls";
/* Important**, field data that was not found on the swaggerhub api docs provided was assumed to be in development, hence, some placeholder variables were created. */
export default {
  name: "formDates",
  data: () => ({
    valid: false,
    loadedId: -1,

    generalRules: [
      (v) => !!v || "This input is required",
      (v) => v.length <= 20 || "This input must be less than 20 characters",
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
        this.loadedId = this.fields.id;
        this.constructionPeriods =
          resp.data.relationships.constructionPeriods.data;
        this.dates = resp.data.relationships.dates.data;
        store.dispatch("addSiteHistory", resp.data.data);
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
        fromDate: "1900-01-01",
        toDate: "1901-01-01",
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
          this.$emit("showAPIMessages", resp.data);
        })
        .catch((err) => {
          this.$emit("showError", err);
        });
    },
  },
};
</script>