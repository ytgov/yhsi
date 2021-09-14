<template>
  <div>
    <v-card-title style="width: 100%; display: block">
      Associations
      <div class="float-right">
        <v-btn class="my-0" color="primary" @click="saveChanges()">Save</v-btn>
      </div>
    </v-card-title>
    <v-divider inset></v-divider>
    <v-form v-model="valid">
      <div class="row mx-1">
        <div class="col-md-12">
          <v-card class="default mb-5">
            <v-card-text>
              <h3>Associations</h3>
              <div class="row" v-for="(item, i) of associations" :key="i">
                <div class="col-md-5">
                  <v-select
                    v-model="item.type"
                    label="Association type"
                    :items="associationTypeOptions"
                    dense
                    outlined
                    hide-details
                    background-color="white"
                  ></v-select>
                </div>

                <div class="col-md-5">
                  <v-text-field
                    v-model="item.description"
                    label="Association name"
                    dense
                    outlined
                    hide-details
                    background-color="white"
                    required
                  ></v-text-field>
                </div>

                <div class="col-md-2">
                  <v-btn
                    color="warning"
                    x-small
                    fab
                    title="Remove"
                    class="my-0 float-right"
                    @click="removeAssociation(i)"
                    ><v-icon>mdi-close</v-icon></v-btn
                  >
                </div>
              </div>
              <v-btn class="mt-5" color="info" @click="addAssociation()">
                Add Association
              </v-btn>
            </v-card-text>
          </v-card>
        </div>

        <div class="col-md-12">
          <v-card class="default mb-5">
            <v-card-text>
              <h3>First Nation Associations</h3>
              <div
                class="row"
                v-for="(item, i) of firstNationAssociations"
                :key="i"
              >
                <div class="col-md-10">
                  <v-row>
                    <v-col cols="6">
                      <v-select
                        v-model="item.firstNationAssociationType"
                        label="Association"
                        :items="firstNationAssociationTypeOptions"
                        item-text="text"
                        item-value="value"
                        dense
                        outlined
                        hide-details
                        background-color="white"
                      ></v-select>
                    </v-col>
                    <v-col cols="6">
                      <v-select
                        v-model="item.firstNationId"
                        label="First Nation"
                        :items="firstNationOptions"
                        item-value="id"
                        item-text="description"
                        dense
                        outlined
                        hide-details
                        background-color="white"
                      ></v-select>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="12">
                      <v-text-field
                        v-model="item.comments"
                        label="Comments"
                        dense
                        outlined
                        hide-details
                        background-color="white"
                      ></v-text-field>
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
                    @click="removeFNAssociation(i)"
                    ><v-icon>mdi-close</v-icon></v-btn
                  >
                </div>

                <div
                  v-if="i < firstNationAssociations.length - 1"
                  class="col-md-12"
                >
                  <hr />
                </div>
              </div>
              <v-btn class="mt-5" color="info" @click="addFNAssociation()">
                Add Association
              </v-btn>
            </v-card-text>
          </v-card>
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
  name: "formAssociation",
  data: () => ({
    /* input-fields */
    valid: false,
    generalRules: [
      (v) => !!v || "This input is required",
      (v) => v.length <= 20 || "This input must be less than 20 characters",
    ],
    associations: [],
    firstNationAssociations: [],

    associationTypeOptions: [],
    firstNationAssociationTypeOptions: [],
    firstNationOptions: [],
  }),

  created: function () {
    let id = this.$route.params.id;

    axios
      .get(`${PLACE_URL}/${id}`)
      .then((resp) => {
        this.fields = resp.data.data;
        this.associations = resp.data.relationships.associations.data;
        this.firstNationAssociations =
          resp.data.relationships.firstNationAssociations.data;
      })
      .catch((error) => console.error(error));

    axios.get(`${STATIC_URL}/association-type`).then((resp) => {
      this.associationTypeOptions = resp.data.data;
    });
    axios.get(`${STATIC_URL}/first-nation-association-type`).then((resp) => {
      this.firstNationAssociationTypeOptions = resp.data.data;
    });
    axios.get(`${STATIC_URL}/first-nation`).then((resp) => {
      this.firstNationOptions = resp.data.data;
    });
  },
  methods: {
    addAssociation() {
      this.associations.push({});
    },
    removeAssociation(index) {
      this.associations.splice(index, 1);
    },
    addFNAssociation() {
      this.firstNationAssociations.push({});
    },
    removeFNAssociation(index) {
      this.firstNationAssociations.splice(index, 1);
    },
  },
};
</script>