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
                      v-model="fields.yHSIId"
                      label="YHSI ID"
                      required
                    ></v-text-field>

                    <v-combobox
                    v-model="fields.designations"
                      label="Designations"
                    ></v-combobox>

                    <v-combobox
                    v-model="fields.category"
                      label="CRHP Category"
                    ></v-combobox>

                    <v-combobox
                    v-model="fields.siteCategories"
                    label="Site Categories"
                    ></v-combobox>

                    <v-combobox
                    v-model="fields.records"
                    label="Records"
                    ></v-combobox>

                    <v-checkbox
                      v-model="fields.showInRegister"
                      :label="'Show in Register?'"
                    ></v-checkbox>
                  </v-col>

                  <v-col
                    cols="6"
                  >
                     <v-text-field
                      v-model="fields.primaryName"
                      label="Primary Name"
                      required
                    ></v-text-field>

                    <div class="mb-2">Secondary Names</div>
                    <v-alert v-for="(item, i) in secondaryNames" :key="`secondary-name-${i}`"
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
                      v-model="fields.contributingResources"
                      label="Contribuiting Resources"
                      required
                    ></v-text-field>

                    <div class="mb-2">Historical Patterns</div>
                    <v-alert v-for="(item, i) in historicalPatterns" :key="`historical-pattern-${i}`"
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
/* Important**, field data that was not found on the swaggerhub api docs provided was assumed to be in development, hence, some placeholder variables were created. */
export default {
    name: "formSummary",
    data: () =>({
            valid: false,
            generalRules: [
                v => !!v || 'This input is required',
                v => v.length <= 20 || 'This input must be less than 20 characters',
            ],
            /* Placeholder variables below this line **Read above** */
            secondaryNames: ['1','2'],
            historicalPatterns: ['1','2'],
            /*Field data from the swaggerhub api docs below this line*/
            fields:  { 
                contributingResources: '',//
                category: '',//
                designations: '',//
                primaryName: '',//
                records: '', //
                showInRegister: '',//
                siteCategories: '',//
                yHSIId: '',//
              }
    })   
}
</script>
