<template>
    <div>
          <v-card-title primary-title>
            Location
          </v-card-title>
          <v-divider inset></v-divider>
          <v-form v-model="summary.valid">
              <v-container>
                <v-row>
                  <v-col
                    cols="6"
                  >
                    <v-row>
                      <v-col
                        cols="6"
                      >
                        <v-combobox
                          label="Community"
                        ></v-combobox>
                      </v-col>
                      <v-col
                        cols="6"
                      >
                        <v-text-field
                          v-model="summary.yhsiid"
                          :rules="summary.generalRules"
                          label="Other Community"
                          required
                        ></v-text-field>
                      </v-col>
                    </v-row>
                    <v-row>
                      <v-col>
                        <v-alert
                          outlined
                          color="primary"
                        >
                          <div class="sub-title">
                            Physical Address
                          </div>
                        <v-textarea
                          label="Address"
                          v-model="summary.primary_name"
                        ></v-textarea>

                        <v-text-field
                          v-model="summary.yhsiid"
                          :rules="summary.generalRules"
                          label="Province"
                          required
                        ></v-text-field>
                        <v-row>
                          <v-col cols="6">
                            <v-text-field
                              v-model="summary.yhsiid"
                              :rules="summary.generalRules"
                              label="Country"
                              required
                            ></v-text-field>
                          </v-col>
                          <v-col cols="6">
                            <v-text-field
                              v-model="summary.yhsiid"
                              :rules="summary.generalRules"
                              label="Postal Code"
                              required
                            ></v-text-field>
                          </v-col>
                        </v-row>
                        </v-alert>
                      </v-col>
                    </v-row>

                    <v-text-field
                            v-model="summary.yhsiid"
                            :rules="summary.generalRules"
                            label="Latitude"
                            required
                    ></v-text-field>
                    
                    <v-text-field
                            v-model="summary.yhsiid"
                            :rules="summary.generalRules"
                            label="Longitude"
                            required
                    ></v-text-field>

                    <v-combobox
                      label="Coordinate Determination"
                    ></v-combobox>
                  </v-col>
                  <v-col
                    cols="6"
                  >
                     <v-text-field
                      v-model="summary.primary_name"
                      :rules="summary.generalRules"
                      label="Other Locality"
                      required
                    ></v-text-field>
                    <v-textarea
                      label="Previous Address"
                      v-model="summary.primary_name"
                    ></v-textarea>
                    <v-textarea
                      label="Contact"
                      v-model="summary.primary_name"
                    ></v-textarea>
                    <v-row>
                      <v-col cols="6">
                        <v-text-field
                          v-model="summary.primary_name"
                          :rules="summary.generalRules"
                          label="NTS Map Sheet"
                          required
                        ></v-text-field>
                      </v-col>
                      <v-col cols="6">
                        <v-text-field
                          v-model="summary.primary_name"
                          :rules="summary.generalRules"
                          label="Area(m2)"
                          required
                        ></v-text-field>
                      </v-col>
                    </v-row>
                    <v-text-field
                      v-model="summary.primary_name"
                      :rules="summary.generalRules"
                      label="Border Number"
                      required
                    ></v-text-field>
                    <v-textarea
                      label="Misc. Info"
                      v-model="summary.primary_name"
                    ></v-textarea>
                  </v-col>

                </v-row>
              </v-container>
            </v-form>
        </div>
</template>

<script>
export default {
    name: "formLocation",
    data: () => ({
        summary:{
            valid: false,
            yhsiid: '',
            designations: '',
            crhp: '',
            site_categories: '',
            records: '',
            show_in_register: false,
            primary_name: '',
            secondary_names: ['YUKON RIVER','OTHER NAME'],  
            contribuiting_resources: '',
            historical_pattern_1: '',
            historical_pattern_2: '',
            generalRules: [
                v => !!v || 'This input is required',
                v => v.length <= 20 || 'This input must be less than 20 characters',
            ],
        },
    })
}
</script>