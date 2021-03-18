<template>
  <div>
          <v-card-title primary-title>
            Site Record
          </v-card-title>
          <v-divider inset></v-divider>
          <v-form v-model="valid">
              <v-container>
                <v-row>
                  <v-col
                    cols="6"
                  >
                     <v-text-field
                      v-model="fields.yHSIRecord"
                      label="YHSI Record"
                      required
                    ></v-text-field>

                    <v-text-field
                      v-model="fields.search"
                      label="Search for a Site"
                      required
                    ></v-text-field>
                  </v-col>

                  <v-col
                    cols="6"
                  >
                    <v-text-field
                      v-model="fields.bordenRecord"
                      label="Borden Record"
                      required
                    ></v-text-field>

                     <v-text-field
                      v-model="fields.paleoRecord"
                      label="Paleo Record"
                      required
                    ></v-text-field>

                    <v-text-field
                      v-model="fields.archivalRecord"
                      label="Archival Record"
                      required
                    ></v-text-field>

                    <v-checkbox
                      v-model="fields.otherOrNoRecord"
                      :label="'Other or No Record?'"
                    ></v-checkbox>
                  </v-col>
                </v-row>
                <v-btn color="success">Save Changes</v-btn>
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
            fields: {
                /* Placeholder variables below this line **Read above** */
                otherOrNoRecord: false,
                /*Field data from the swaggerhub api docs below this line*/
                archivalRecord: "",//
                bordenRecord: "",//
                paleoRecord: "",//
                yHSIRecord: ""//
            }
    }),
    methods:{
    }
}
</script>
