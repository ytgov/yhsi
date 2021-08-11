<template>
  <div>
    <v-card-title primary-title> Location </v-card-title>
    <v-divider inset></v-divider>
    <v-form v-model="valid">
      <v-container>
        <v-row>
          <v-col cols="6">
            <v-row>
              <v-col cols="6">
                <v-combobox
                  v-model="fields.communityId"
                  :items="communities"
                  label="Community"
                  item-text="name"
                  item-value="id"
                ></v-combobox>
              </v-col>
              <v-col cols="6">
                <v-text-field
                  v-model="fields.otherCommunity"
                  :rules="generalRules"
                  label="Other Community"
                  required
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                <v-alert outlined color="primary">
                  <div class="sub-title">Physical Address</div>
                  <v-textarea
                    label="Address"
                    v-model="fields.physicalAddress"
                  ></v-textarea>

                  <v-text-field
                    v-model="fields.physicalProvince"
                    :rules="generalRules"
                    label="Province"
                    required
                  ></v-text-field>
                  <v-row>
                    <v-col cols="6">
                      <v-text-field
                        v-model="fields.physicalCountry"
                        :rules="generalRules"
                        label="Country"
                        required
                      ></v-text-field>
                    </v-col>
                    <v-col cols="6">
                      <v-text-field
                        v-model="fields.physicalPostalCode"
                        :rules="generalRules"
                        label="Postal Code"
                        required
                      ></v-text-field>
                    </v-col>
                  </v-row>
                </v-alert>
              </v-col>
            </v-row>

            <v-text-field
              v-model="fields.latitude"
              :rules="generalRules"
              label="Latitude"
              required
            ></v-text-field>

            <v-text-field
              v-model="fields.longitude"
              :rules="generalRules"
              label="Longitude"
              required
            ></v-text-field>

            <v-combobox
              v-model="fields.coordinateDetermination"
              label="Coordinate Determination"
            ></v-combobox>
          </v-col>
          <v-col cols="6">
            <v-text-field
              v-model="fields.otherLocality"
              :rules="generalRules"
              label="Other Locality"
              required
            ></v-text-field>
            <v-textarea
              label="Previous Address"
              v-model="fields.previousAddress"
            ></v-textarea>
            <v-textarea
              label="Context"
              v-model="fields.locationContext"
            ></v-textarea>
            <v-row>
              <v-col cols="6">
                <v-text-field
                  v-model="fields.nTSMapSheet"
                  :rules="generalRules"
                  label="NTS Map Sheet"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="6">
                <v-text-field
                  v-model="fields.hectareArea"
                  :rules="generalRules"
                  label="Area(m2)"
                  required
                ></v-text-field>
              </v-col>
            </v-row>
            <v-text-field
              v-model="fields.bordenNumber"
              :rules="generalRules"
              label="Border Number"
              required
            ></v-text-field>
            <v-textarea
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
import { PLACE_URL } from "../../../urls";
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
  },
};
</script>