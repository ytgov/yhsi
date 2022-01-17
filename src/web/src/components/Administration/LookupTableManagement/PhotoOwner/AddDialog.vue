<template>
  <v-row justify="center">
    <v-dialog v-model="dialog" persistent max-width="600px" @click:outside="reset()">
      <template v-slot:activator="{ on, attrs }">
        <v-btn v-bind="attrs" v-on="on" class="black--text mx-1">
          <v-icon class="mr-1">mdi-plus-circle-outline</v-icon>
          Add Photo Owner
        </v-btn>
      </template>
      <v-card>
        <v-card-title>
          <span class="text-h5">New Photo Owner</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-form
                  ref="addPhotoOwnerForm"
                  :lazy-validation="false"
                  v-model="valid"
                >
                  <v-text-field
                    label="Name"
                    v-model="fields.name"
                    :rules="generalRules"
                  ></v-text-field>
                  <v-text-field
                    label="Contact"
                    v-model="fields.contactPerson"
                  ></v-text-field>
                  <v-text-field
                    label="Email"
                    v-model="fields.email"
                  ></v-text-field>
                  <v-text-field
                    label="Phone"
                    v-model="fields.telephone"
                  ></v-text-field>
                  <v-text-field
                    label="Address"
                    v-model="fields.address"
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
    fields: { 
      name: null,
      contactPerson: null,
      email: null,
      telephone: null,
      address: null, 
    },
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
      let data = this.fields;
      await catalogs.postPhotoOwner(data);
      this.$router.go();
    },
    //not needed
    validate() {
      this.$refs.addPhotoOwnerForm.validate();
    },
    reset() {
      this.dialog = false;
      this.$refs.addPhotoOwnerForm.reset();
    },
    resetValidation() {
      this.$refs.addPhotoOwnerForm.resetValidation();
    },
  },
};
</script>