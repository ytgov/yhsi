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
            hide-details
          ></v-select>

          <v-btn color="secondary" @click="showMap()" :disabled="!showMapButton"
            ><v-icon class="mr-2">mdi-map-marker</v-icon>Show on Map</v-btn
          >
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
<!--
          </v-row>
                <v-divider class="mt-2 mb-2"></v-divider>
                <v-btn color="success">Save Changes</v-btn>
              </v-container>
            </v-form>
            -->
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

    <map-dialog ref="map"></map-dialog>
  </div>
</template>

<script>
import axios from "axios";
import store from "../../../store";
import { COMMUNITY_URL, PLACE_URL, STATIC_URL } from "../../../urls";
/* Important, field data that was not found on the swaggerhub api docs provided was assumed to be in development, hence, some placeholder variables were created */
export default {
  name: "formLocation",
  data: () => ({
    valid: false,
    loadedId: -1,
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
  computed: {
    showMapButton: function () {
      if (this.fields.latitude && this.fields.longitude) {
        return true;
      }
      return false;
    },
  },
  created: function () {
    this.loadedId = this.$route.params.id;

    axios
      .get(`${PLACE_URL}/${this.loadedId}`)
      .then((resp) => {
        this.fields = resp.data.data;

        store.dispatch("addSiteHistory", resp.data.data);
        this.$parent.siteName = this.fields.primaryName;
      })
      .catch((error) => console.error(error));

    axios.get(`${COMMUNITY_URL}`).then((resp) => {
      this.communities = resp.data.data;
    });

    axios.get(`${STATIC_URL}/coordinate-determination`).then((resp) => {
      this.coordinateDeterminationOptions = resp.data.data;
    });
  },
  methods: {
    saveChanges() {
      let body = {
        bordenNumber: this.fields.bordenNumber,
        communityId: this.fields.communityId,
        coordinateDetermination: this.fields.coordinateDetermination,
        hectareArea: this.fields.hectareArea,
        latitude: this.fields.latitude,
        locationComment: this.fields.locationComment,
        locationContext: this.fields.locationContext,
        longitude: this.fields.longitude,
        nTSMapSheet: this.fields.nTSMapSheet,
        otherCommunity: this.fields.otherCommunity,
        otherLocality: this.fields.otherLocality,
        physicalAddress: this.fields.physicalAddress,
        physicalCountry: this.fields.physicalCountry,
        physicalPostalCode: this.fields.physicalPostalCode,
        physicalProvince: this.fields.physicalProvince,
        previousAddress: this.fields.previousAddress,
      };

      axios
        .put(`${PLACE_URL}/${this.loadedId}/location`, body)
        .then((resp) => {
          this.$emit("showAPIMessages", resp.data);
        })
        .catch((err) => {
          this.$emit("showError", err);
        });
    },
    showMap() {
      this.$refs.map.show(this.fields.latitude, this.fields.longitude);
    },
  },
};
</script>