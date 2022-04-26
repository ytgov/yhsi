<template>
  <div>
  <Accordion>
    <template v-slot:title>
      <v-card-title primary-title style="display:inline-block">
        Historic Sites
      </v-card-title>
    </template>
    <template v-slot:content>
          <v-form v-model="valid"
            ref="historicSiteForm">
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
                      :readonly="mode == 'view'"
                    ></v-text-field>

                  <div v-if="itemType == 'photo'">
                   <v-text-field
                      v-if="mode == 'view'"
                      v-model="fields.dateCreated"
                      label="Date Uploaded"
                      readonly
                      dense
                      outlined
                      background-color="white"
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
                          v-model="fields.datePhotoTaken"
                          label="Date Photo Taken"
                          append-icon="mdi-calendar"
                          readonly
                          v-bind="attrs"
                          v-on="on"
                          dense
                          outlined
                          background-color="white"
                        ></v-text-field>
                        </template>
                        <v-date-picker
                        v-if="mode != 'view'"
                        ref="picker"
                        v-model="fields.datePhotoTaken"
                        :max="new Date().toISOString().substr(0, 10)"
                        min="1950-01-01"
                        @change="save"
                        dense
                        outlined
                        background-color="white"
                        ></v-date-picker>
                    </v-menu>
                    
                    <v-text-field
                      v-else
                      v-model="fields.datePhotoTaken"
                      label="Date Photo Taken"
                      readonly
                      dense
                      outlined
                      background-color="white"
                    ></v-text-field>
                    </div>
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
                        :readonly="mode == 'view'"   
                        :class="{ 'read-only-form-item': mode == 'view' }"                   
                    ></v-select>

                    <v-textarea
                      v-model="fields.originalRecord"
                      label="Original Media Record"
                      rows="3"
                      required
                      dense
                      outlined
                      background-color="white"
                      :readonly="mode == 'view'"
                    ></v-textarea>
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
  name: "historicSites",
  components: { Accordion },
  props: [ 'fields', 'mode' ,'itemType' ],
  data: () =>({
    valid: false,
    generalRules: [ v => !!v || 'This field is required' ],
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
    validate() {
      this.$refs.historicSiteForm.validate();
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
