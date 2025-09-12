<template>
  <v-row justify="center">
    <v-dialog v-model="dialog" persistent max-width="600px" @click:outside="reset()">
      <template v-slot:activator="{ on, attrs }">
        <v-btn v-bind="attrs" v-on="on" class="black--text mx-1">
          <v-icon class="mr-1">mdi-plus-circle-outline</v-icon>
          Add Photo Subject
        </v-btn>
      </template>
      <v-card>
        <v-card-title>
          <span class="text-h5">New Photo Subject</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-form
                  ref="addPhotoSubjectForm"
                  :lazy-validation="false"
                  v-model="valid"
                >
                  <v-text-field
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
      let data = { name: this.input };
      await catalogs.postPhotoSubject(data);
      this.$router.go();
    },
    //not needed
    validate() {
      this.$refs.addSubjectForm.validate();
    },
    reset() {
      this.dialog = false;
      this.$refs.addSubjectForm.reset();
    },
    resetValidation() {
      this.$refs.addSubjectForm.resetValidation();
    },
  },
};
</script>