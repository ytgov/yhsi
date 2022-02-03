<template>
  <div>   
          <v-card-title primary-title>
            Feature
          </v-card-title>
          <v-divider inset></v-divider>
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
                      v-model="fields.featureName"
                      class="default mb-5"      
                      label="Feature Name"
                      :rules="generalRules"
                      required
                      dense
                      outlined
                      background-color="white"
                      hide-details
                      :readonly="mode == 'view'"
                    ></v-text-field>

                    <v-textarea
                      v-model="fields.address"
                      label="Address"
                      required
                      dense
                      outlined
                      background-color="white"
                      hide-details
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
                      class="default mb-5"
                      dense
                      outlined
                      background-color="white"
                      hide-details
                      :readonly="mode == 'view'"
                      :class="{ 'read-only-form-item': mode == 'view' }"
                    ></v-select>

                     <v-text-field
                      v-model="fields.location"
                      class="default mb-5"   
                      label="Location"
                      required
                      dense
                      outlined
                      background-color="white"
                      hide-details
                      :readonly="mode == 'view'"
                    ></v-text-field>

                    <v-text-field
                      v-model="fields.nTSMapNumber"
                      label="NTS Map Number"
                      required
                      dense
                      outlined
                      background-color="white"
                      hide-details
                      :readonly="mode == 'view'"
                    ></v-text-field>
                  </v-col>
                </v-row>
              </v-container>
            </v-form>
        </div> 
</template>

<script>

import axios from "axios";
import { STATIC_URL } from "../../../urls";

export default {
  name: "feature",
  props: [ 'fields', 'mode' ],
  data: () =>({
    valid: false,
    generalRules: [ v => !!v || 'This input is required' ],
    availableCommunities: [],
  }),
  created(){
    axios.get(`${STATIC_URL}/community`).then((resp) => {
      this.availableCommunities = resp.data.data;
      this.availableCommunities = this.availableCommunities
        .slice()
        .sort((a, b) => (a.name.toLowerCase() > b.name.toLowerCase() ? 1 : b.name.toLowerCase() > a.name.toLowerCase() ? -1 : 0)
      );
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
