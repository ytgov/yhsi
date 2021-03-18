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
                    <v-alert v-for="(item, i) in fields.secondaryNames" :key="`secondary-name-${i}`"
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
                          @click="removeItem('secondaryNames', i)"
                        >
                          <v-icon dark>mdi-minus-circle</v-icon>
                        </v-btn>
                        <v-text-field 
                          v-model="item.name"
                          label="Name"
                          required
                        ></v-text-field>
                    </v-alert>
                    <v-btn
                    outlined
                    color="primary"
                    @click="addItem('secondaryNames')"
                    >
                        Add New
                    </v-btn>

                    <v-text-field 
                      v-model="fields.contributingResources"
                      label="Contribuiting Resources"
                      required
                    ></v-text-field>

                    <div class="mb-2">Historical Patterns</div>
                    <v-alert v-for="(item, i) in fields.historicalPatterns" :key="`historical-pattern-${i}`"
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
                          @click="removeItem('historicalPatterns', i)"
                        >
                          <v-icon dark>mdi-minus-circle</v-icon>
                        </v-btn>
                        <v-combobox
                        v-model="item.pattern"
                        label="Historical Pattern"
                      ></v-combobox>
                        <v-text-field
                          v-model="item.comment"
                          label="Comments"
                          required
                        ></v-text-field>
                    </v-alert>
                    <v-btn
                    outlined
                    color="primary"
                    @click="addItem('historicalPatterns')"
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
            fields:  { 
                /* Placeholder variables below this line **Read above** */
                secondaryNames: [{name: ''},{name: ''}],
                historicalPatterns: [{pattern: '', comments: ''},{pattern: '', comments: ''}],
                /*Field data from the swaggerhub api docs below this line*/
                contributingResources: '',//
                category: '',//
                designations: '',//
                primaryName: '',//
                records: '', //
                showInRegister: '',//
                siteCategories: '',//
                yHSIId: '',//
              }
    }),
    methods:{
        removeItem(objName, position){
            if (position > -1) {
              this.fields[objName].splice(position, 1);
            }
        },
        addItem(objName){
          switch(objName){// Selects which structure to add to the new element of the array
            case 'historicalPatterns':
              this.fields[objName].push({pattern: '', comments: ''});
              break;
            case 'secondaryNames':
              this.fields[objName].push({name: ''});
              break;
          }
        }
    }
}
</script>
