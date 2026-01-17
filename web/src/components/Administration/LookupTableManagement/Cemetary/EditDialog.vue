<template>
  <v-row justify="center">
    <v-dialog v-model="dialog" persistent max-width="600px">
      <v-card>
        <v-card-title>
          <span class="text-h5">Edit Cemetery</span>
        </v-card-title>
        <v-card-text>
            <v-row>
              <v-col cols="12">
                <v-form
                  ref="editCemetaryForm"
                  :lazy-validation="false"
                  v-model="valid"
                >
                    <v-row class="mt-2">
                        <v-col class="pa-0" cols="6">
                          <v-text-field class="mr-2" outlined dense
                            label="Cemetery Name"
                            v-model="data.Cemetary"
                            :rules="generalRules"
                          ></v-text-field>
                          
                        </v-col>
                        <v-col class="pa-0" cols="6">
                          <v-text-field class="ml-2" outlined dense
                            label="Community"
                            v-model="data.Community"
                    
                          ></v-text-field>
                        
                        </v-col>  
                    </v-row>
                  <v-row>
                    <v-col class="pa-0 " cols="6">
                      <v-text-field class="mr-2" outlined dense
                          label="Latitude"
                          v-model="data.Latitude"
                    
                        ></v-text-field>
                    </v-col>
                    <v-col class="pa-0" cols="6">
                      <v-text-field class="ml-2" outlined dense
                          label="Longitude"
                          v-model="data.Longitude"
                     
                        ></v-text-field>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col class="pa-0" cols="12">
                      <v-text-field outlined dense
                          label="Address"
                          v-model="data.Address"
      
                        ></v-text-field>
                    </v-col>
                    <v-col class="pa-0" cols="12">
                      <v-text-field outlined dense
                          label="Notes"
                          v-model="data.Notes"
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
  props: ["dialog", "data"],
  data: () => ({
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
      this.$emit("closeEditDialog");
    },
    async save() {
      let { Cemetary, Community, Address, Notes, Latitude, Longitude } = this.data;
      let data = {
        data: { Cemetary, Community, Address, Notes, Latitude, Longitude },
      };
      await catalogs.putCemetary(this.data.CemetaryLUpID, data);
      this.$router.go();
    },
    //not needed
    validate() {
      this.$refs.editVesselTypeForm.validate();
    },
    reset() {
      this.$refs.editVesselTypeForm.reset();
    },
    resetValidation() {
      this.$refs.editVesselTypeForm.resetValidation();
    },
  },
  watch: {
    data: {
      handler() {
        this.input = this.data.Type;
      },
      deep: true,
    },
  },
};
</script>
