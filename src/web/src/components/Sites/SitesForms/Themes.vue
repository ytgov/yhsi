<template>
  <div>
    <v-card-title style="width: 100%; display: block">
      Themes & Function
      <div class="float-right">
        <v-btn class="my-0" color="primary" @click="saveChanges()">Save</v-btn>
      </div>
    </v-card-title>
    <v-divider class="mb-5"></v-divider>
    <v-form v-model="valid">
      <div class="row mx-1">
        <div class="col-md-12">
          <v-textarea
            label="YHS Themes"
            v-model="fields.yHSThemes"
            dense
            rows="4"
            outlined
            hide-details
            background-color="white"
          ></v-textarea>
        </div>

        <div class="col-md-12">
          <v-card class="default mb-0">
            <v-card-text>
              <h3>Themes</h3>
              <div class="row" v-for="(item, i) of themes" :key="i">
                <div class="col-md-10">
                  <v-select
                    v-model="item.placeThemeId"
                    :items="themeCategoryOptions"
                    item-text="display"
                    item-value="id"
                    label="Category / Type"
                    dense
                    hide-details
                    outlined
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
                    @click="removeTheme(i)"
                    ><v-icon>mdi-close</v-icon></v-btn
                  >
                </div>
              </div>
              <v-btn class="mt-5" color="info" @click="addTheme()">
                Add Theme
              </v-btn>
            </v-card-text>
          </v-card>
        </div>

        <div class="col-md-12">
          <v-card class="default mb-0">
            <v-card-text>
              <h3>Functional Uses</h3>
              <div class="row" v-for="(item, i) of functionalUses" :key="i">
                <div class="col-md-10">
                  <v-row>
                    <v-col cols="4">
                      <v-select
                        label="Use type"
                        :items="useTypeOptions"
                        v-model="item.functionalUseType"
                        item-text="text"
                        item-value="value"
                        dense
                        outlined
                        hide-details
                        background-color="white"
                      ></v-select>
                    </v-col>
                    <v-col cols="8">
                      <v-autocomplete
                        v-model="item.functionalTypeId"
                        :items="functionalCategoryOptions"
                        item-text="description"
                        item-value="id"
                        label="Functional Category / Type"
                        dense
                        outlined
                        hide-details
                        background-color="white"
                      ></v-autocomplete>
                    </v-col>
                  </v-row>
                </div>

                <div class="col-md-2">
                  <v-btn
                    color="warning"
                    x-small
                    fab
                    title="Remove"
                    class="my-0 float-right"
                    @click="removeUse(i)"
                    ><v-icon>mdi-close</v-icon></v-btn
                  >
                </div>
              </div>
              <v-btn class="mt-5" color="info" @click="addUse()">
                Add Functional Use
              </v-btn>
            </v-card-text>
          </v-card>
        </div>
        <div class="col-md-6">
          <v-textarea
            label="YHS Current Use"
            v-model="fields.currentUseComment"
            dense
            outlined
            background-color="white"
            hide-details
          ></v-textarea>
        </div>
        <div class="col-md-6">
          <v-textarea
            label="YHS Past Use"
            v-model="fields.yHSPastUse"
            dense
            outlined
            hide-details
            background-color="white"
          ></v-textarea>
        </div>
      </div>
    </v-form> -->
  </div>
</template>

<script>
import axios from "axios";
import store from "../../../store";
import { PLACE_URL, STATIC_URL } from "../../../urls";
/* Important**, field data that was not found on the swaggerhub api docs provided was assumed to be in development, hence, some placeholder variables were created. */
export default {
  name: "formThemes",
  data: () => ({
    valid: false,
    loadedId: -1,
    generalRules: [
      (v) => !!v || "This input is required",
      (v) => v.length <= 20 || "This input must be less than 20 characters",
    ],

    themes: [],
    themeCategoryOptions: [],
    functionalUses: [],

    useTypeOptions: [],
    functionalCategoryOptions: [],

    fields: {
      /*Field data from the swaggerhub api docs below this line*/
      currentUseComment: "", //
      yHSPastUse: "", //
      yHSThemes: "", //
    },
  }),
  created: function () {
    let id = (this.loadedId = this.$route.params.id);
    this.loadedId = id;

    axios
      .get(`${PLACE_URL}/${id}`)
      .then((resp) => {
        this.fields = resp.data.data;
        this.themes = resp.data.relationships.themes.data;
        this.functionalUses = resp.data.relationships.functionalUses.data;
        store.dispatch("addSiteHistory", resp.data.data);
        this.$parent.siteName = this.fields.primaryName;
      })
      .catch((error) => console.error(error));

    axios.get(`${STATIC_URL}/place-theme`).then((resp) => {
      this.themeCategoryOptions = resp.data.data;
    });

    axios.get(`${STATIC_URL}/functional-use-type`).then((resp) => {
      this.useTypeOptions = resp.data.data;
    });

    axios.get(`${STATIC_URL}/functional-type`).then((resp) => {
      this.functionalCategoryOptions = resp.data.data;
    });
  },
  methods: {
    addTheme() {
      this.themes.push({ placeId: this.loadedId, placeThemeId: 1 });
    },
    removeTheme(index) {
      this.themes.splice(index, 1);
    },
    addUse() {
      this.functionalUses.push({ placeId: this.loadedId, functionalUseType: 2, functionalTypeId: 1 });
    },
    removeUse(index) {
      this.functionalUses.splice(index, 1);
    },
    saveChanges() {
      let body = {
        themes: this.themes,
        functionalUses: this.functionalUses,
        currentUseComment: this.fields.currentUseComment,
        yHSPastUse: this.fields.yHSPastUse,
        yHSThemes: this.fields.yHSThemes,
      };

      axios
        .put(`${PLACE_URL}/${this.loadedId}/themes`, body)
        .then((resp) => {
          //this.setPlace(resp.data);
          this.$emit("showAPIMessages", resp.data);
        })
        .catch((err) => {
          this.$emit("showError", err);
        });
    },
  },
};
</script>