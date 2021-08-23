<template>
  <div>
    <v-card-title primary-title> Location </v-card-title>
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
          ></v-select>
        </div>
        <div class="col-md-3">
          <v-text-field
            dense
            outlined
            v-model="fields.otherCommunity"
            label="Other Community"
          ></v-text-field>
        </div>
        <div class="col-md-6">
          <v-text-field
            dense
            outlined
            v-model="fields.otherLocality"
            label="Other Locality"
          ></v-text-field>
        </div>
        <div class="col-md-6">
          <v-card class="default mb-4">
            <v-card-subtitle>Physical Address</v-card-subtitle>
            <v-card-text>
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
                :rules="generalRules"
                label="Province"
                background-color="white"
                required
              ></v-text-field>
              <v-row>
                <v-col cols="6">
                  <v-text-field
                    dense
                    outlined
                    v-model="fields.physicalCountry"
                    :rules="generalRules"
                    label="Country"
                    background-color="white"
                    required
                    hide-details
                  ></v-text-field>
                </v-col>
                <v-col cols="6">
                  <v-text-field
                    dense
                    outlined
                    v-model="fields.physicalPostalCode"
                    :rules="generalRules"
                    label="Postal Code"
                    background-color="white"
                    required
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
            label="Previous Address"
            v-model="fields.previousAddress"
          ></v-textarea>
          <v-textarea
            dense
            outlined
            label="Context"
            v-model="fields.locationContext"
          ></v-textarea>
        </div>
        <div class="col-md-6"></div>
        <div class="col-md-6"></div>
        <div class="col-md-6"></div>
      </div>

      <v-container>
        <v-row>
          <v-col cols="6">
            <v-row>
              <v-col> </v-col>
            </v-row>

            <v-text-field
              dense
              outlined
              v-model="fields.latitude"
              :rules="generalRules"
              label="Latitude"
              required
            ></v-text-field>

            <v-text-field
              dense
              outlined
              v-model="fields.longitude"
              :rules="generalRules"
              label="Longitude"
              required
            ></v-text-field>

            <v-combobox
              dense
              outlined
              v-model="fields.coordinateDetermination"
              label="Coordinate Determination"
            ></v-combobox>
          </v-col>
          <v-col cols="6">
            <v-row>
              <v-col cols="6">
                <v-text-field
                  dense
                  outlined
                  v-model="fields.nTSMapSheet"
                  :rules="generalRules"
                  label="NTS Map Sheet"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="6">
                <v-text-field
                  dense
                  outlined
                  v-model="fields.hectareArea"
                  :rules="generalRules"
                  label="Area(m2)"
                  required
                ></v-text-field>
              </v-col>
            </v-row>
            <v-text-field
              dense
              outlined
              v-model="fields.bordenNumber"
              :rules="generalRules"
              label="Border Number"
              required
            ></v-text-field>
            <v-textarea
              dense
              outlined
              label="Misc. Info"
              v-model="fields.locationComment"
            ></v-textarea>
          </v-col>
        </v-row>
      </v-container>
    </v-form>
  </div>
</template>

<script>
import axios from "axios";
import { COMMUNITY_URL, PLACE_URL } from "../../../urls";
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
        console.log("PLACE", this.fields);
      })
      .catch((error) => console.error(error));

    axios
      .get(`${COMMUNITY_URL}`)
      .then((resp) => {
        this.communities = resp.data.data;
      })
      .catch((error) => console.error(error));
  },
};
</script>