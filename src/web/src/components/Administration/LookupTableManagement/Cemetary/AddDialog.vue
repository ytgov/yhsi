<template>
  <v-row justify="center">
    <v-dialog v-model="dialog" persistent max-width="600px" @click:outside="reset()">
      <template v-slot:activator="{ on, attrs }">
        <v-btn v-bind="attrs" v-on="on" class="black--text mx-1">
          <v-icon class="mr-1">mdi-plus-circle-outline</v-icon>
          Add Cemetary
        </v-btn>
      </template>
      <v-card>
        <v-card-title>
          <span class="text-h5">New Cemetary</span>
        </v-card-title>
        <v-card-text>
            <v-row>
              <v-col cols="12">
                <v-form
                  ref="addCemetaryForm"
                  :lazy-validation="false"
                  v-model="valid"
                >
                  <v-row class="mt-2">
                      <v-col class="pa-0" cols="6">
                        <v-text-field class="mr-2" outlined dense
                          label="Cemetary Name"
                          v-model="Cemetary"
                          :rules="generalRules"
                        ></v-text-field>
                        
                      </v-col>
                      <v-col class="pa-0" cols="6">
                        <v-text-field class="ml-2" outlined dense
                          label="Community"
                          v-model="Community"
                          :rules="generalRules"
                        ></v-text-field>
                      
                      </v-col>  
                  </v-row>
                <v-row>
                   <v-col class="pa-0 " cols="6">
                     <v-text-field class="mr-2" outlined dense
                        label="Latitude"
                        v-model="Latitude"
                        :rules="generalRules"
                      ></v-text-field>
                   </v-col>
                   <v-col class="pa-0" cols="6">
                     <v-text-field class="ml-2" outlined dense
                        label="Longitude"
                        v-model="Longitude"
                        :rules="generalRules"
                      ></v-text-field>
                   </v-col>
                </v-row>
                <v-row>
                  <v-col class="pa-0" cols="12">
                    <v-text-field outlined dense
                        label="Address"
                        v-model="Address"
                        :rules="generalRules"
                      ></v-text-field>
                  </v-col>
                   <v-col class="pa-0" cols="12">
                     <v-text-field outlined dense
                        label="Notes"
                        v-model="Notes"
                        :rules="generalRules"
                      ></v-text-field>
                   </v-col>
                </v-row>
                </v-form>
              </v-col>
            </v-row>
        </v-card-text>
        <v-card-actions>
          <v-btn text @click="closeDialog" class="black--text"> Close </v-btn>
          <v-spacer></v-spacer>
          <v-btn color="success" text :disabled="!valid" @click="save">
            Save
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
import catalogs from "../../../../controllers/catalogs";
export default {
  props: [],
  data: () => ({
    dialog: false,
    input: null,
    valid: false,
    Cemetary: "",
    Community: "",
    Address: "",
    Notes: "",
    Latitude: "",
    Longitude: "",
    generalRules: [(v) => !!v || "This field is required"],
  }),
  methods: {
    closeDialog() {
      this.dialog = false;
      this.reset();
      this.resetValidation();
    },
    async save() {
      let { Cemetary, Community, Address, Notes, Latitude, Longitude } = this;
      let data = {
        data: { Cemetary, Community, Address, Notes, Latitude, Longitude },
      };
      await catalogs.postCemetary(data);
      this.$router.go();
    },
    //not needed
    validate() {
      this.$refs.addCemetaryForm.validate();
    },
    reset() {
      this.$refs.addCemetaryForm.reset();
    },
    resetValidation() {
      this.$refs.addCemetaryForm.resetValidation();
    },
  },
};
</script>