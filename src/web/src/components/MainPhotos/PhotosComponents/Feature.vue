<template>
  <div>   
  <Accordion>
    <template v-slot:title>
      <v-card-title primary-title style="display:inline-block">
        Feature
      </v-card-title>
    </template>
    <template v-slot:content>
      <v-form 
        v-model="valid" 
        ref="featureForm"
        :lazy-validation="false"
      >
          <v-container>
            <v-row>
              <v-col
                cols="6"
              >
                  <v-text-field
                  v-if="itemType == 'photo'"
                  v-model="fields.featureName" 
                  label="Feature Name"
                  :rules="generalRules"
                  required
                  dense
                  outlined
                  background-color="white"
                  :readonly="mode == 'view'"
                ></v-text-field>
                <v-text-field
                  v-if="itemType == 'batch'"
                  v-model="fields.name"
                  class="default"      
                  label="Batch Name"
                  :rules="generalRules"
                  required
                  dense
                  outlined
                  background-color="white"
                  :readonly="mode == 'view'"
                ></v-text-field>

                <v-textarea
                  v-model="fields.address"
                  label="Address"
                  required
                  dense
                  outlined
                  background-color="white"
                  :readonly="mode == 'view'"
                  rows="3"
                ></v-textarea>
              </v-col>

              <v-col cols="6">
                <v-select
                  v-model="fields.communityId"
                  :items="availableCommunities"
                  :rules="generalRules"
                  clearable
                  item-text="name"
                  item-value="id"
                  label="Community"
                  class="default"
                  dense
                  outlined
                  background-color="white"
                  :readonly="mode == 'view'"
                  :class="{ 'read-only-form-item': mode == 'view' }"
                ></v-select>

                  <v-text-field
                  v-model="fields.location"
                  class="default   "
                  label="Location"
                  required
                  dense
                  outlined
                  background-color="white"
                  :readonly="mode == 'view'"
                ></v-text-field>
            
                <v-autocomplete
                  v-model="fields.nTSMapNumber"
                  :items="mapSheetOptions"
                  :readonly="mode == 'view'"
                  :class="{ 'read-only-form-item': mode == 'view' }"
                  clearable
                  label="Mapsheet"
                  item-text="name"
                  item-value="id"
                  dense
                  outlined
                  background-color="white"
                  hide-details
                ></v-autocomplete>
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
import { STATIC_URL } from "../../../urls";

export default {
  name: "feature",
  components: { Accordion },
  props: [ 'fields', 'mode', 'itemType' ],
  data: () =>({
    valid: false,
    generalRules: [ v => !!v || 'This field is required' ],
    availableCommunities: [],
    mapSheetOptions: [],
  }),
  created(){
    axios.get(`${STATIC_URL}/community`).then((resp) => {
      this.availableCommunities = resp.data.data;
      this.availableCommunities = this.availableCommunities
        .slice()
        .sort((a, b) => (a.name.toLowerCase() > b.name.toLowerCase() ? 1 : b.name.toLowerCase() > a.name.toLowerCase() ? -1 : 0)
      );
    });

    axios.get(`${STATIC_URL}/mapsheet`).then((resp) => {
      this.mapSheetOptions = resp.data.data;
      this.mapSheetOptions = this.mapSheetOptions.map((x) => (x = {id: x.map50k, name: x.map50k}));
      this.mapSheetOptions = this.mapSheetOptions       
        .slice()
        .sort((a, b) => (a.name > b.name ? 1 : b.name > a.name ? -1 : 0));
    });

  },
  methods:{
    validate() {
      this.$refs.featureForm.validate();
    },
  },
  watch: {
    fields: {
      handler() {
        this.$emit("featureChange", this.fields);
      },
      deep: true,
    },
    valid: {
      handler() {
        this.$emit("featureValidChange", this.valid);
      }
    },
  }
}
</script>
