<template>
  <v-row justify="center">
    <v-dialog v-model="dialog" persistent max-width="600px">
      <template v-slot:activator="{ on, attrs }">
        <v-btn v-bind="attrs" v-on="on" class="black--text mx-1">
          <v-icon class="mr-1">mdi-plus-circle-outline</v-icon>
          Add Place Type
        </v-btn>
      </template>
      <v-card>
        <v-card-title>
          <span class="text-h5">New Place Type</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-form
                  ref="addPlaceTypeForm"
                  :lazy-validation="false"
                  v-model="valid"
                >
                  <v-text-field
                    label="Place Name"
                    v-model="input"
                    :rules="generalRules"
                  ></v-text-field>
                </v-form>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-btn text @click="closeDialog"> Close </v-btn>
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
    generalRules: [(v) => !!v || "This field is required"],
  }),
  methods: {
    closeDialog() {
      this.dialog = false;
      this.reset();
      this.resetValidation();
    },
    async save() {
      let data = {
        placeType: { PlaceType: this.input },
      };
      await catalogs.postPlaceType(data);
      this.$router.go();
    },
    //not needed
    validate() {
      this.$refs.addPlaceTypeForm.validate();
    },
    reset() {
      this.$refs.addPlaceTypeForm.reset();
    },
    resetValidation() {
      this.$refs.addPlaceTypeForm.resetValidation();
    },
  },
};
</script>