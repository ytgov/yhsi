<template>
  <div>
          <v-card-title primary-title>
            Site Record
          </v-card-title>
          <v-divider inset></v-divider>
          <v-form v-model="valid">
              <v-container>
                <v-row>
                  <!--<v-col
                    cols="6"
                  >
                     <v-text-field
                      v-model="fields.yHSIRecord"
                      class="default mb-5"   
                      label="YHSI Record"
                      required
                      dense
                      outlined
                      background-color="white"
                      hide-details
                    ></v-text-field>

                    <v-text-field
                      v-model="fields.search"
                      label="Search for a Site"
                      required
                      dense
                      outlined
                      background-color="white"
                      hide-details
                    ></v-text-field>
                  </v-col>-->

                  <v-col
                    cols="6"
                  >
                    <v-text-field
                      v-model="fields.bordenRecord"
                      class="default mb-5"   
                      label="Borden Record"
                      required
                      dense
                      outlined
                      background-color="white"
                      hide-details
                      :readonly="mode == 'view'"
                    ></v-text-field>

                     <v-text-field
                      v-model="fields.paleoRecord"
                      class="default mb-5"   
                      label="Paleo Record"
                      required
                      dense
                      outlined
                      background-color="white"
                      hide-details
                      :readonly="mode == 'view'"
                    ></v-text-field>

                    <v-text-field
                      v-model="fields.archivalRecord"
                      class="default mb-5"   
                      label="Archival Record"
                      required
                      dense
                      outlined
                      background-color="white"
                      hide-details
                      :readonly="mode == 'view'"
                    ></v-text-field>

                    <v-checkbox
                      v-model="fields.isOtherRecord"
                      :label="'Other or No Record?'"
                      dense
                      outlined
                      background-color="white"
                      hide-details
                      :readonly="mode == 'view'"
                    ></v-checkbox>
                  </v-col>
                </v-row>
              </v-container>
            </v-form>
        </div> 
</template>

<script>
export default {
    name: "siteRecord",
    props: [ 'fields', 'mode' ],
    data: () =>({
      valid: false,
      generalRules: [
          v => !!v || 'This input is required',
          v => v.length <= 20 || 'This input must be less than 20 characters',
      ],
    }),
  created(){
  },
  methods:{
  },
  watch: {
    fields: {
      handler() {
        this.$emit("siteRecordChange", this.fields);
      },
      deep: true,
    },
  }
}
</script>
