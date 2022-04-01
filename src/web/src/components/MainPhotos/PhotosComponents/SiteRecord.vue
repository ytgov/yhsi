<template>
  <div>
  <Accordion>
    <template v-slot:title>
      <v-card-title primary-title style="display:inline-block">
        Site Record
      </v-card-title>
    </template>
    <template v-slot:content>
          <v-form v-model="valid"
            ref="siteRecordForm">
              <v-container>
                <v-row>
                  <!--<v-col
                    cols="6"
                  >
                     <v-text-field
                      v-model="fields.yHSIRecord"
                      label="YHSI Record"
                      required
                      dense
                      outlined
                      background-color="white"
                    ></v-text-field>

                    <v-text-field
                      v-model="fields.search"
                      label="Search for a Site"
                      required
                      dense
                      outlined
                      background-color="white"
                    ></v-text-field>
                  </v-col>-->

                  <v-col
                    cols="6"
                  >
                    <v-text-field
                      v-model="fields.bordenRecord"
                      class="default"   
                      label="Borden Record"
                      required
                      dense
                      outlined
                      background-color="white"
                      :readonly="mode == 'view'"
                    ></v-text-field>

                     <v-text-field
                      v-model="fields.paleoRecord"
                      label="Paleo Record"
                      required
                      dense
                      outlined
                      background-color="white"
                      :readonly="mode == 'view'"
                    ></v-text-field>

                    <v-text-field
                      v-model="fields.archivalRecord" 
                      label="Archival Record"
                      required
                      dense
                      outlined
                      background-color="white"
                      :readonly="mode == 'view'"
                    ></v-text-field>

                    <v-checkbox
                      v-model="fields.isOtherRecord"
                      :label="'Other or No Record?'"
                      dense
                      outlined
                      background-color="white"
                      :readonly="mode == 'view'"
                    ></v-checkbox>

                    <v-checkbox
                      v-model="fields.isSiteDefault"
                      :label="'Is Site Default?'"
                      dense
                      outlined
                      background-color="white"
                      :readonly="mode == 'view'"
                    ></v-checkbox>
                  </v-col>

                  <v-col
                    cols="6"
                  >
                    <v-combobox
                      v-if="itemType == 'photo' && mode != 'add'"
                      v-model="itemLinks"
                      label="Item Links"
                      multiple
                      readonly
                      dense
                      outlined
                      class="read-only-form-item"
                    ></v-combobox>
                      <v-card color="#fff2d5"
                        v-for="(item, i) in sites"
                        :key="`site-${i}`">
                      <v-card-text>
                        <v-btn v-if="mode == 'edit'"
                          color="warning"
                          x-small
                          fab
                          title="Remove"
                          class="float-right"
                          style="margin-top: -6px!important;margin-bottom: 0px!important;"
                          @click="deleteSiteLink()"
                          ><v-icon>mdi-close</v-icon></v-btn
                        >
                        <h3>Associated Site</h3>
                      </v-card-text>
                        <v-text-field
                          v-model="item.primaryName"
                          label="Primary Name"
                          class="mx-3"
                          readonly
                          dense
                          outlined
                          background-color="white"
                        ></v-text-field>
                        <v-row class="mx-3">
                          <v-text-field
                            v-model="item.yHSIId"
                            label="YHSI Id"
                            class="mb-5"
                            readonly
                            dense
                            outlined
                            background-color="white"
                            hide-details
                          ></v-text-field>
                          <v-text-field
                            v-model="item.communityName"
                            label="Community"
                            class="ml-3 mb-5"
                            readonly
                            dense
                            outlined
                            background-color="white"
                            hide-details
                          ></v-text-field>
                        </v-row>
                        <div class="mx-3 mb-3">
                          <a @click="clickSite(item.id)">
                            <span underline>View Site Details</span>
                          </a>
                        </div>
                      </v-card>
                  </v-col>

                </v-row>
              </v-container>
            </v-form>
      </template>
    </Accordion>
  </div> 
</template>

<script>
import Accordion from "../Accordion"
import axios from "axios";
import { EXTRA_PHOTOS_URL } from "../../../urls";

export default {
    name: "siteRecord",
  components: { Accordion },
    props: [ 'fields', 'mode', 'itemType' ],
    data: () =>({
      valid: false,
      generalRules: [
          v => !!v || 'This field is required'
      ],
      itemLinks: [],
      sites: [],
    }),
  created(){
    if(this.fields.rowId) {
      axios.get(`${EXTRA_PHOTOS_URL}/${this.fields.rowId}/item-link`).then((resp) => {
        let itemNames = resp.data;
        itemNames = itemNames.map(a => a.itemName);
        this.itemLinks = itemNames;
      });
      // Get the site info
      axios.get(`${EXTRA_PHOTOS_URL}/${this.fields.rowId}/place`).then((resp) => {
        this.sites = resp.data;
      });
    }
  },
  methods:{
    validate() {
      this.$refs.siteRecordForm.validate();
    },
    clickSite(siteId) {
      this.$router.push(`/sites/${siteId}/summary`);
    },
    deleteSiteLink() {
      axios.delete(`${EXTRA_PHOTOS_URL}/${this.fields.rowId}/place`).then(() => {
        this.sites = [];
        this.$store.commit("alerts/setText",'Site association removed');
        this.$store.commit("alerts/setType", "success");
        this.$store.commit("alerts/setTimeout", 5000);
        this.$store.commit("alerts/setAlert", true);
      });
    }
  },
  watch: {
    fields: {
      handler() {
        this.$emit("siteRecordChange", this.fields);
      },
      deep: true,
    },
  }
}
</script>
