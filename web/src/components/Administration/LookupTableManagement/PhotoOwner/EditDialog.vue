<template>
  <v-row justify="center">
    <v-dialog v-model="dialog" persistent max-width="600px" @click:outside="reset()">
      <v-card>
        <v-card-title>
          <span class="text-h5">Edit Photo Owner</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-form
                  ref="editPhotoOwnerForm"
                  :lazy-validation="false"
                  v-model="valid"
                >
                  <v-text-field
                    ref="editInput"
                    label="Photo Owner Name"
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
  props: ["dialog", "data"],
  data: () => ({
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
      this.$emit("closeEditDialog");
    },
    async save() {
      let data = this.fields;
      await catalogs.putPhotoOwner(this.data.Id, data);
      this.$router.go();
    },
    //not needed
    validate() {
      this.$refs.editPhotoOwnerForm.validate();
    },
    reset() {
      this.$refs.editPhotoOwnerForm.reset();
      this.$emit("closeEditDialog");
    },
    resetValidation() {
      this.$refs.editPhotoOwnerForm.resetValidation();
    },
  },
  watch: {
    data: {
      handler() {
        this.fields.name = this.data.Name;
        this.fields.contactPerson = this.data.ContactPerson;
        this.fields.email = this.data.Email;
        this.fields.telephone = this.data.Telephone;
        this.fields.address = this.data.Address;
      },
      deep: true,
    },
  },
};
</script>