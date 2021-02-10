<template>
  <div>
          <v-card-title primary-title>
            Summary
          </v-card-title>
          <v-divider inset></v-divider>
          <v-form v-model="valid">
              <v-container>
                <v-row>
                  <v-col
                    cols="6"
                  >
                     <v-text-field
                      v-model="yhsiid"
                      :rules="generalRules"
                      label="YHSI ID"
                      required
                    ></v-text-field>

                    <v-combobox
                      label="Designations"
                    ></v-combobox>

                    <v-combobox
                      label="CRHP Category"
                    ></v-combobox>

                    <v-combobox
                      label="Site Categories"
                    ></v-combobox>

                    <v-combobox
                      label="Records"
                    ></v-combobox>

                    <v-checkbox
                      v-model="show_in_register"
                      :label="'Show in Register?'"
                    ></v-checkbox>
                  </v-col>

                  <v-col
                    cols="6"
                  >
                     <v-text-field
                      v-model="primary_name"
                      :rules="generalRules"
                      label="Primary Name"
                      required
                    ></v-text-field>

                    <div class="mb-2">Contacts</div>
                    <v-alert v-for="(item, i) in secondary_names" :key="i"
                          outlined
                          color="primary"
                        >
                        <div class="sub-title">
                          Secondary name {{i+1}} 
                        </div>
                        <v-btn
                          icon
                          color="primary"
                          class="top-right-button"
                        >
                          <v-icon dark>mdi-minus-circle</v-icon>
                        </v-btn>
                        <v-text-field 
                          :v-model="item"
                          label="Name"
                          required
                        ></v-text-field>
                    </v-alert>
                    <v-btn
                    outlined
                    color="primary"
                    >
                        Add New
                    </v-btn>

                    <v-text-field 
                      v-model="contribuiting_resources"
                      :rules="generalRules"
                      label="Contribuiting Resources"
                      required
                    ></v-text-field>

                    <div class="mb-2">Contacts</div>
                    <v-alert v-for="(item, i) in secondary_names" :key="i"
                          outlined
                          color="primary"
                        >
                        <div class="sub-title">
                          Historical Pattern {{i+1}}
                        </div>
                        <v-btn
                          icon
                          color="primary"
                          class="top-right-button"
                        >
                          <v-icon dark>mdi-minus-circle</v-icon>
                        </v-btn>
                        <v-combobox
                        label="Historical Pattern"
                      ></v-combobox>
                        <v-text-field
                          :v-model="item"
                          :rules="generalRules"
                          label="Comments"
                          required
                        ></v-text-field>
                    </v-alert>
                    <v-btn
                    outlined
                    color="primary"
                    >
                        Add New
                    </v-btn>
                  </v-col>

                </v-row>
              </v-container>
            </v-form>
        </div> 
</template>

<script>
export default {
    name: "form-summary",
    data: () =>({
      /* input-fields */
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
    })
    
}
</script>
