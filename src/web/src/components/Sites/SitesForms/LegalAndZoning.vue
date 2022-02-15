<template>
    <!-- <div>
          <v-card-title primary-title>
            Legal & Zoning
          </v-card-title>
          <v-divider inset></v-divider>
          <v-form v-model="valid">
              <v-container>
                <v-row>
                    <v-col
                        cols="12"
                    >
                        <div class="mb-2">Ownerships</div>
                        <v-alert v-for="(item, i) in fields.ownerships" :key="`theme-${i+1}`"
                          outlined
                          color="primary"
                        >
                            <div class="sub-title">
                                Ownership {{ i+1 }}
                            </div>
                            <v-btn
                                icon
                                color="primary"
                                class="top-right-button"
                                @click="removeItem('ownerships', i)"
                            >
                                <v-icon dark>mdi-close-circle</v-icon>
                            </v-btn>
                            <v-row>
                                <v-col cols="6">
                                    <v-combobox
                                    v-model="item.category"
                                    label="Category of Property"
                                    ></v-combobox>
                                </v-col>
                                <v-col cols="6">
                                    <v-text-field 
                                    v-model="item.comments"
                                    label="Comments"
                                    required
                                    ></v-text-field>
                                </v-col>
                            </v-row>
                        </v-alert>
                        <v-btn
                        outlined
                        color="primary"
                        @click="addItem('ownerships')"
                        >
                            Add New
                        </v-btn>
                    </v-col>
                </v-row>
                 <v-row>
                    <v-col cols="6">
                        <v-text-field 
                        v-model="fields.zoning"
                        label="Zoning"
                        required
                        ></v-text-field> -->
  <div>
    <v-card-title style="width: 100%; display: block">
      Legal & Zoning
      <div class="float-right">
        <v-btn class="my-0" color="primary" @click="saveChanges()">Save</v-btn>
      </div>
    </v-card-title>
    <v-divider class="mb-5"></v-divider>
    <v-form v-model="valid">
      <div class="row mx-1">
        <div class="col-md-12">
          <v-card class="default mb-0">
            <v-card-text>
              <h3>Ownerships</h3>
              <div class="row" v-for="(item, i) of ownerships" :key="i">
                <div class="col-md-5">
                  <v-select
                    v-model="item.ownershipType"
                    :items="categoryOptions"
                    label="Category of Property"
                    dense
                    outlined
                    background-color="white"
                    hide-details
                  ></v-select>
                </div>
                <div class="col-md-5">
                  <v-text-field
                    v-model="item.comments"
                    label="Comments"
                    dense
                    outlined
                    background-color="white"
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
                    @click="removeOwner(i)"
                    ><v-icon>mdi-close</v-icon></v-btn
                  >
                </div>
              </div>
              <v-btn class="mt-5" color="info" @click="addOwner()">
                Add Ownership
              </v-btn>
            </v-card-text>
          </v-card>
        </div>

        <div class="col-md-6">
          <v-text-field
            v-model="fields.zoning"
            label="Zoning"
            dense
            outlined
            background-color="white"
            hide-details
          ></v-text-field>
        </div>
        <div class="col-md-6">
          <v-text-field
            v-model="fields.townSiteMapNumber"
            label="Town site map number"
            dense
            outlined
            background-color="white"
            hide-details
          ></v-text-field>
        </div>
        <div class="col-md-6">
          <v-text-field
            v-model="fields.siteDistrictNumber"
            label="Site district"
            dense
            outlined
            background-color="white"
            hide-details
          ></v-text-field>
        </div>
        <div class="col-md-6">
          <v-text-field
            v-model="fields.groupYHSI"
            label="Group YHSI"
            dense
            outlined
            background-color="white"
            hide-details
          ></v-text-field>
        </div>
        <div class="col-md-6">
          <v-text-field
            v-model="fields.lAGroup"
            label="Group"
            dense
            outlined
            background-color="white"
            hide-details
          ></v-text-field>
        </div>
        <div class="col-md-6">
          <v-text-field
            v-model="fields.lot"
            label="Lot"
            dense
            outlined
            background-color="white"
            hide-details
          ></v-text-field>
        </div>
        <div class="col-md-6">
          <v-text-field
            v-model="fields.block"
            label="Block"
            dense
            outlined
            background-color="white"
            hide-details
          ></v-text-field>
        </div>

        <div class="col-md-6">
          <v-text-field
            v-model="fields.planNumber"
            label="Plan number"
            dense
            outlined
            background-color="white"
            hide-details
          ></v-text-field>
        </div>

        <div class="col-md-12">
          <v-card class="default mb-0">
            <v-card-text>
              <h3>Previous Ownerships</h3>
              <div class="row" v-for="(item, i) of prevOwnerships" :key="i">
                <div class="col-md-5">
                  <v-text-field
                    v-model="item.ownershipDate"
                    label="Dates"
                    dense
                    outlined
                    background-color="white"
                    hide-details
                  ></v-text-field>
                </div>
                <div class="col-md-5">
                  <v-text-field
                    v-model="item.ownershipNumber"
                    label="Title number"
                    dense
                    outlined
                    background-color="white"
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
                    @click="removePrevOwner(i)"
                    ><v-icon>mdi-close</v-icon></v-btn
                  >
                </div>
                <div class="col-md-12">
                  <v-text-field
                    v-model="item.ownershipName"
                    label="Names"
                    dense
                    outlined
                    background-color="white"
                    hide-details
                  ></v-text-field>
                </div>
                <div v-if="i < prevOwnerships.length - 1" class="col-md-12">
                  <hr />
                </div>
              </div>
              <v-btn class="mt-5" color="info" @click="addPrevOwner()">
                Add Previous Ownership
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
import store from "../../../store";
import { PLACE_URL, STATIC_URL } from "../../../urls";
/* Important**, field data that was not found on the swaggerhub api docs provided was assumed to be in development, hence, some placeholder variables were created. */
export default {
  name: "formLegalAndZoning",
  data: () => ({
    valid: false,
    loadedId: -1,
    ownerships: [],
    categoryOptions: [],
    prevOwnerships: [],
    fields: {
      /*Field data from the swaggerhub api docs below this line*/
      block: "", //
      groupYHSI: "", //
      lAGroup: "", //
      lot: "", //
      planNumber: "", //
      siteDistrictNumber: "", //
      townSiteMapNumber: "", //
      zoning: "", //
    },
  }),
  created: function () {
    let id = this.$route.params.id;
    this.loadedId = id;

    axios
      .get(`${PLACE_URL}/${id}`)
      .then((resp) => {
        this.fields = resp.data.data;
        this.ownerships = resp.data.relationships.ownerships.data;
        this.prevOwnerships = resp.data.relationships.previousOwnerships.data;
        store.dispatch("addSiteHistory", resp.data.data);
        this.$parent.siteName = this.fields.primaryName;
      })
      .catch((error) => console.error(error));

    axios.get(`${STATIC_URL}/ownership-types`).then((resp) => {
      this.categoryOptions = resp.data.data;
    });
  },
  methods: {
    addOwner() {
      this.ownerships.push({
        ownershipType: 1,
        placeId: this.loadedId,
      });
    },
    removeOwner(index) {
      this.ownerships.splice(index, 1);
    },
    addPrevOwner() {
      this.prevOwnerships.push({
        ownershipDate: "",
        ownershipNumber: "",
        ownershipName: "",
        placeId: this.loadedId,
      });
    },
    removePrevOwner(index) {
      this.prevOwnerships.splice(index, 1);
    },
    saveChanges() {
      let body = {
        block: this.fields.block,
        groupYHSI: this.fields.groupYHSI,
        lAGroup: this.fields.lAGroup,
        lot: this.fields.lot,
        planNumber: this.fields.planNumber,
        siteDistrictNumber: this.fields.siteDistrictNumber,
        townSiteMapNumber: this.fields.townSiteMapNumber,
        zoning: this.fields.zoning,
        ownerships: this.ownerships,
        prevOwnerships: this.prevOwnerships,
      };

      axios
        .put(`${PLACE_URL}/${this.loadedId}/legal`, body)
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