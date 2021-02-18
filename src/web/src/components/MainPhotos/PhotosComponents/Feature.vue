<template>
  <div>
          <v-card-title primary-title>
            Feature
          </v-card-title>
          <v-divider inset></v-divider>
          <v-form v-model="valid">
              <v-container>
                <v-row>
                  <v-col
                    cols="6"
                  >
                     <v-text-field
                      v-model="fields.featureName"
                      label="Feature Name"
                      required
                    ></v-text-field>

                    <v-textarea
                      v-model="fields.address"
                      label="Address"
                      required
                    ></v-textarea>
                  </v-col>

                  <v-col
                    cols="6"
                  >
                    <v-combobox
                        v-model="fields.communityName"
                        label="Community"
                    ></v-combobox>

                     <v-text-field
                      v-model="fields.location"
                      label="Location"
                      required
                    ></v-text-field>

                    <v-text-field
                      v-model="fields.nTSMapNumber"
                      label="NTS Map Number"
                      required
                    ></v-text-field>
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
                search: '',
                /*Field data from the swaggerhub api docs below this line*/
                address: "",//
                communityId: 0,//
                communityName: "",//
                featureName: "",//
                location: "",//
                nTSMapNumber: "",//
            }
    }),
    methods:{
    }
}
</script>
