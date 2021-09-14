<template>
  <div>
    <v-card-title style="width: 100%; display: block">
      Location
      <div class="float-right">
        <v-btn class="my-0" color="primary" @click="saveChanges()">Save</v-btn>
      </div>
    </v-card-title>

    <v-divider class="mb-5"></v-divider>

    <v-form v-model="valid">
      <div class="row mx-1">
        <div class="col-md-3">
          <v-select
            dense
            outlined
            v-model="fields.communityId"
            :items="communities"
            label="Community"
            item-text="name"
            item-value="id"
            hide-details
          ></v-select>
        </div>
        <div class="col-md-3">
          <v-text-field
            dense
            outlined
            v-model="fields.otherCommunity"
            label="Other community"
            hide-details
          ></v-text-field>
        </div>
        <div class="col-md-6">
          <v-text-field
            dense
            outlined
            v-model="fields.otherLocality"
            label="Other locality"
            hide-details
          ></v-text-field>
        </div>
        <div class="col-md-6">
          <v-card class="default mb-4">
            <v-card-text>
              <h3>Physical Address</h3>
              <v-textarea
                dense
                outlined
                label="Address"
                background-color="white"
                v-model="fields.physicalAddress"
              ></v-textarea>

              <v-text-field
                dense
                outlined
                v-model="fields.physicalProvince"
                label="Province"
                background-color="white"
              ></v-text-field>
              <v-row>
                <v-col cols="6">
                  <v-text-field
                    dense
                    outlined
                    v-model="fields.physicalCountry"
                    label="Country"
                    background-color="white"
                    hide-details
                  ></v-text-field>
                </v-col>
                <v-col cols="6">
                  <v-text-field
                    dense
                    outlined
                    v-model="fields.physicalPostalCode"
                    label="Postal code"
                    background-color="white"
                    hide-details
                  ></v-text-field>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </div>
        <div class="col-md-6">
          <v-textarea
            dense
            outlined
            label="Previous address"
            v-model="fields.previousAddress"
          ></v-textarea>
          <v-textarea
            dense
            outlined
            label="Context"
            v-model="fields.locationContext"
          ></v-textarea>
        </div>
        <div class="col-md-6">
          <v-text-field
            dense
            outlined
            v-model="fields.latitude"
            label="Latitude"
          ></v-text-field>

          <v-text-field
            dense
            outlined
            v-model="fields.longitude"
            label="Longitude"
          ></v-text-field>
          <v-select
            dense
            outlined
            :items="coordinateDeterminationOptions"
            v-model="fields.coordinateDetermination"
            label="Coordinate determination"
          ></v-select>
        </div>
        <div class="col-md-6">
          <v-row>
            <v-col cols="6">
              <v-text-field
                dense
                outlined
                v-model="fields.nTSMapSheet"
                label="NTS map sheet"
              ></v-text-field>
            </v-col>
            <v-col cols="6">
              <v-text-field
                dense
                outlined
                v-model="fields.hectareArea"
                label="Area(m2)"
              ></v-text-field>
            </v-col>
          </v-row>

          <v-text-field
            dense
            outlined
            v-model="fields.bordenNumber"
            label="Border number"
          ></v-text-field>
          <v-textarea
            dense
            outlined
            label="Misc. info"
            v-model="fields.locationComment"
          ></v-textarea>
        </div>
      </div>
    </v-form>
  </div>
</template>

<script>
import axios from "axios";
import { COMMUNITY_URL, PLACE_URL, STATIC_URL } from "../../../urls";
/* Important, field data that was not found on the swaggerhub api docs provided was assumed to be in development, hence, some placeholder variables were created */
export default {
  name: "formLocation",
  data: () => ({
    valid: false,
    generalRules: [
      (v) => !!v || "This input is required",
      (v) => v.length <= 20 || "This input must be less than 20 characters",
    ],
    /* Placeholder variables below this line **Read above** */
    coordinateDeterminationOptions: [],
    communities: [],
    /*Field data from the swaggerhub api docs below this line*/
    fields: {
      bordenNumber: "", //
      communityId: "", //
      coordinateDetermination: "", //
      hectareArea: "", //
      latitude: "", //
      locationComment: "", //
      locationContext: "", //
      longitude: "", //
      nTSMapSheet: "", //
      otherCommunity: "", //
      otherLocality: "", //
      physicalAddress: "", //
      physicalCountry: "", //
      physicalPostalCode: "", //
      physicalProvince: "", //
      previousAddress: "", //
    },
  }),
  created: function () {
    let id = this.$route.params.id;

    axios
      .get(`${PLACE_URL}/${id}`)
      .then((resp) => {
        this.fields = resp.data.data;
      })
      .catch((error) => console.error(error));

    axios.get(`${COMMUNITY_URL}`).then((resp) => {
      this.communities = resp.data.data;
    });

    axios.get(`${STATIC_URL}/coordinate-determination`).then((resp) => {
      this.coordinateDeterminationOptions = resp.data.data;
    });
  },
};
</script>