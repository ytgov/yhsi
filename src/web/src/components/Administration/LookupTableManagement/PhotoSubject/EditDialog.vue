<template>
  <v-row justify="center">
    <v-dialog v-model="dialog" persistent max-width="600px" @click:outside="reset()">
      <v-card>
        <v-card-title>
          <span class="text-h5">Edit Photo Subject</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-form
                  ref="editPhotoSubjectForm"
                  :lazy-validation="false"
                  v-model="valid"
                >
                  <v-text-field
                    ref="editInput"
                    label="Subject Name"
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
  props: ["dialog", "data"],
  data: () => ({
    input: null,
    valid: false,
    generalRules: [(v) => !!v || "This field is required"],
  }),
  methods: {
    closeDialog() {
      this.$emit("closeEditDialog");
    },
    async save() {
      let data = { name: this.input } ;
      await catalogs.putPhotoSubject(this.data.Id, data);
      this.$router.go();
    },
    //not needed
    validate() {
      this.$refs.editPhotoSubjectForm.validate();
    },
    reset() {
      this.$refs.editPhotoSubjectForm.reset();
      this.$emit("closeEditDialog");
    },
    resetValidation() {
      this.$refs.editPhotoSubjectForm.resetValidation();
    },
  },
  watch: {
    data: {
      handler() {
        this.input = this.data.Name;
      },
      deep: true,
    },
  },
};
</script>