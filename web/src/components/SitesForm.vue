<template>
 <v-card>
    <v-toolbar
      flat
      color="primary"
      dark
    >
      <v-toolbar-title><v-icon>mdi-book-open-variant</v-icon> View site: {{site}}</v-toolbar-title>
    </v-toolbar>
    <v-tabs vertical  class="tabs-left">
      <v-tab>
        <v-icon left>
          mdi-account
        </v-icon>
        Summary
      </v-tab>
      <v-tab>
        <v-icon left>
          mdi-account
        </v-icon>
        Location
      </v-tab>
      <v-tab>
        <v-icon left>
          mdi-account
        </v-icon>
        Dates & Condition
      </v-tab>
      <v-tab>
        <v-icon left>
          mdi-account
        </v-icon>
        Themes & Function
      </v-tab>
      <v-tab>
        <v-icon left>
          mdi-account
        </v-icon>
        Associations
      </v-tab>
      <v-tab>
        <v-icon left>
          mdi-account
        </v-icon>
        Legal & Zoning
      </v-tab>
      <v-tab>
        <v-icon left>
          mdi-account
        </v-icon>
        Photos
      </v-tab>
      <v-tab>
        <v-icon left>
          mdi-account
        </v-icon>
        Management
      </v-tab>
      <v-tab>
        <v-icon left>
          mdi-account
        </v-icon>
        Description
      </v-tab>
      <v-tab-item>
        <v-card flat>
          <v-card-title primary-title>
            Summary
          </v-card-title>
          <v-divider inset></v-divider>
          <v-form v-model="summary.valid">
              <v-container>
                <v-row>
                  <v-col
                    cols="6"
                  >

                     <v-text-field
                      v-model="summary.yhsiid"
                      :rules="summary.generalRules"
                      label="YHSI ID"
                      required
                    ></v-text-field>

                     <v-text-field
                      v-model="summary.designations"
                      :rules="summary.generalRules"
                      label="Designations"
                      required
                    ></v-text-field>

                     <v-text-field
                      v-model="summary.crhp"
                      :rules="summary.generalRules"
                      label="CRHP Category"
                      required
                    ></v-text-field>

                     <v-text-field
                      v-model="summary.site_categories"
                      :rules="summary.generalRules"
                      label="Site Categories"
                      required
                    ></v-text-field>

                     <v-text-field
                      v-model="summary.records"
                      :rules="summary.generalRules"
                      label="Records"
                      required
                    ></v-text-field>

                    <v-checkbox
                      v-model="summary.show_in_register"
                      :label="'Show in Register?'"
                    ></v-checkbox>
                  </v-col>

                  <v-col
                    cols="6"
                  >
                     <v-text-field
                      v-model="summary.primary_name"
                      :rules="summary.generalRules"
                      label="Primary Name"
                      required
                    ></v-text-field>
                    <v-alert
                          outlined
                          color="primary"
                        >
                          <div class="sub-title">
                            Secondary names
                          </div>
                        <v-text-field v-for="(item, i) in summary.secondary_names" :key="i"
                          :v-model="item"
                          :label="`Name ${i+1}`"
                          required
                        ></v-text-field>
                    </v-alert>

                     <v-text-field 
                      v-model="summary.contribuiting_resources"
                      :rules="summary.generalRules"
                      label="Contribuiting Resources"
                      required
                    ></v-text-field>

                    <v-alert
                          outlined
                          color="primary"
                        >
                          <div class="sub-title">
                            Historical Pattern 1
                          </div>
                      <v-text-field
                        v-model="summary.historical_pattern_1"
                        :rules="summary.generalRules"
                        label="Historical Pattern"
                        required
                      ></v-text-field>
                    </v-alert>
                    <v-alert
                          outlined
                          color="primary"
                        >
                          <div class="sub-title">
                            Historical Pattern 2
                          </div>
                      <v-text-field
                        v-model="summary.historical_pattern_1"
                        :rules="summary.generalRules"
                        label="Historical Pattern"
                        required
                      ></v-text-field>
                    </v-alert>
                  </v-col>

                </v-row>
              </v-container>
            </v-form>
        </v-card>
      </v-tab-item>
      <v-tab-item>
        <v-card flat>
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

                        <v-text-field
                          v-model="summary.yhsiid"
                          :rules="summary.generalRules"
                          label="Community"
                          required
                        ></v-text-field>
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

                    <v-text-field
                            v-model="summary.yhsiid"
                            :rules="summary.generalRules"
                            label="Coordinate Determination"
                            required
                  ></v-text-field>
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
        </v-card>
      </v-tab-item>
    </v-tabs>
  </v-card>
</template>

<script>
export default {
  data: () => ({
    site: '',
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
    location:{

    },
    dates_Condition:{

    },
    themes_Function:{

    },
    associations:{

    },
    legal_Zoning:{

    },
    photos:{

    },
    management:{

    },
    description:{

    }
  }),
  beforeCreate(){//gets the id from the url before creating the component
    console.log(this.$route.params.id);
  }
}
</script>


<style scoped>
.tabs-left{
    display: flex;
    flex-flow: row-reverse;
}
.v-tab{
  justify-content: left;
}
</style>