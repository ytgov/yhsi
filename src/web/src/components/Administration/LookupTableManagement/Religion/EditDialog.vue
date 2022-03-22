<template>
  <v-row justify="center">
    <v-dialog v-model="dialog" persistent max-width="600px">
      <v-card>
        <v-card-title>
          <span class="text-h5">Edit Religion</span>
        </v-card-title>
        <v-card-text>
            <v-row>
              <v-col cols="12">
                <v-form
                  ref="editReligionForm"
                  :lazy-validation="false"
                  v-model="valid"
                >
                  <v-row class="mt-2">
                    <v-col cols="12">
                      <v-text-field
                        ref="editInput"
                        label="Religion"
                        v-model="input"
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
      let data = {
        vesselType: { Type: this.input },
      };
      await catalogs.putReligion(this.data.Id, data);
      this.$router.go();
    },
    //not needed
    validate() {
      this.$refs.editReligionForm.validate();
    },
    reset() {
      this.$refs.editReligionForm.reset();
    },
    resetValidation() {
      this.$refs.editReligionForm.resetValidation();
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