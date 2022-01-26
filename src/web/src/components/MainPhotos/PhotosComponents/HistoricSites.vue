<template>
  <div>
          <v-card-title primary-title>
            Historic Sites 
          </v-card-title>
          <v-divider inset></v-divider>
          <v-form v-model="valid">
              <v-container>
                <v-row>
                  <v-col
                    cols="6"
                  >
                     <v-select
                        v-model="fields.program"
                        :items="programOptions"
                        :rules="generalRules"
                        label="Program Type"
                        dense
                        outlined
                        background-color="white"
                        hide-details
                        class="default mb-5" 
                        :readonly="mode == 'view'"
                        :class="{ 'read-only-form-item': mode == 'view' }"
                    ></v-select>

                    <v-select
                        v-model="fields.photoProjectId"
                        :items="projectOptions"
                        :rules="generalRules"
                        item-text="name"
                        item-value="id"
                        label="Project"
                        dense
                        outlined
                        background-color="white"
                        hide-details
                        class="default mb-5" 
                        :readonly="mode == 'view'"
                      :class="{ 'read-only-form-item': mode == 'view' }"
                    ></v-select>

                    <v-text-field
                      v-model="fields.creator"
                      label="Creator"
                      required
                      dense
                      outlined
                      background-color="white"
                      hide-details
                      class="default mb-5" 
                      :readonly="mode == 'view'"
                    ></v-text-field>

                    <v-menu
                        v-if="mode != 'view'"
                        ref="menu"
                        v-model="menu"
                        :close-on-content-click="false"
                        transition="scale-transition"
                        offset-y
                        min-width="auto"
                    >
                        <template v-slot:activator="{ on, attrs }">
                        <v-text-field
                          v-model="fields.dateCreated"
                          label="Date Photo Taken"
                          append-icon="mdi-calendar"
                          readonly
                          v-bind="attrs"
                          v-on="on"
                          dense
                          outlined
                          background-color="white"
                          hide-details
                        ></v-text-field>
                        </template>
                        <v-date-picker
                        v-if="mode != 'view'"
                        ref="picker"
                        v-model="fields.dateCreated"
                        :max="new Date().toISOString().substr(0, 10)"
                        min="1950-01-01"
                        @change="save"
                        dense
                        outlined
                        background-color="white"
                        hide-details
                        ></v-date-picker>
                    </v-menu>
                    
                    <v-text-field
                      v-else
                      v-model="fields.dateCreated"
                      label="Date Photo Taken"
                      readonly
                      dense
                      outlined
                      background-color="white"
                      hide-details
                    ></v-text-field>
                  </v-col>

                  <v-col
                    cols="6"
                  >
                    <v-select
                        v-model="fields.mediaStorage"
                        label="Office Location"
                        :items="storageOptions"
                        :rules="generalRules"
                        dense
                        outlined
                        background-color="white"
                        hide-details
                        class="default mb-5" 
                        :readonly="mode == 'view'"
                        :class="{ 'read-only-form-item': mode == 'view' }"
                    ></v-select>

                     <v-select
                        v-model="fields.originalMediaId"
                        :items="origMediaOptions"
                        :rules="generalRules"
                        item-text="type"
                        item-value="id"
                        label="Original Media Type"
                        dense
                        outlined
                        background-color="white"
                        hide-details
                        class="default mb-5" 
                        :readonly="mode == 'view'"   
                        :class="{ 'read-only-form-item': mode == 'view' }"                   
                    ></v-select>

                    <v-textarea
                      v-model="fields.originalRecord"
                      label="Original Media Record"
                      required
                      dense
                      outlined
                      background-color="white"
                      hide-details
                      :readonly="mode == 'view'"
                    ></v-textarea>
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
  name: "historicSites",
  props: [ 'fields', 'mode' ],
  data: () =>({
    valid: false,
    generalRules: [ v => !!v || 'This input is required' ],
    date: null,
    menu: false,
    programOptions: [],
    projectOptions: [],
    storageOptions: [],
    origMediaOptions: [],

  }),
  created(){
    axios.get(`${STATIC_URL}/photo-program`).then((resp) => {
      this.programOptions = resp.data.data;
    });

    axios.get(`${STATIC_URL}/photo-project`).then((resp) => {
      this.projectOptions = resp.data.data;     
      this.projectOptions = this.projectOptions
        .slice()
        .sort((a, b) => (a.name.toLowerCase() > b.name.toLowerCase() ? 1 : b.name.toLowerCase() > a.name.toLowerCase() ? -1 : 0)
      );
    });

    axios.get(`${STATIC_URL}/media-storage`).then((resp) => {
      this.storageOptions = resp.data.data;
    });

    axios.get(`${STATIC_URL}/original-media`).then((resp) => {
      this.origMediaOptions = resp.data.data;
    });
  },
  methods:{
    save (date) {
        this.$refs.menu.save(date)
    },
  },
  watch: {
    fields: {
      handler() {
        this.$emit("historicSiteChange", this.fields);
      },
      deep: true,
    },
    valid: {
      handler() {
        this.$emit("siteValidChange", this.valid);
      }
    },
    menu (val) {
      val && setTimeout(() => (this.$refs.picker.activePicker = 'YEAR'))
    },
  },
}
</script>
