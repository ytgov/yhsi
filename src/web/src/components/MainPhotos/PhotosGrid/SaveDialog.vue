<template>
    <v-dialog v-model="dialog" persistent max-width="600px" @click:outside="reset()">
      <template v-slot:activator="{ on, attrs }">
        <v-btn v-bind="attrs" v-on="on" color="secondary" :disabled="isDisabled">
          <v-icon class="mr-1">mdi-check</v-icon>
          Save Filter(s)
        </v-btn>
      </template>
      <v-card>
        <v-card-title>
          <span class="text-h7">What would you like to call this filter?</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-form
                  ref="saveFilterForm"
                  :lazy-validation="false"
                  v-model="valid"
                >
                  <v-text-field
                    placeholder="Enter a name"
                    v-model="filterName"
                    :rules="generalRules"
                  ></v-text-field>
                </v-form>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-btn text @click="closeDialog" class="black--text"> Close </v-btn>
          <v-spacer></v-spacer>
          <v-btn color="success" text :disabled="!valid" @click="onSave">
            Save
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
</template>

<script>
export default {
  props: ['query', 'isDisabled'],
  data: () => ({
    dialog: false,
    filterName: null,
    valid: false,
    generalRules: [(v) => !!v || "This field is required"],
  }),
  methods: {
    closeDialog() {
      this.dialog = false;
      this.reset();
      this.resetValidation();
    },
    onSave() {
      this.$emit('saveFilter',this.filterName);
      this.closeDialog();
    },
    validate() {
      this.$refs.saveFilterForm.validate();
    },
    reset() {
      this.filterName = null;
      this.dialog = false;
      this.$refs.saveFilterForm.reset();
    },
    resetValidation() {
      this.$refs.saveFilterForm.resetValidation();
    },
  },
};
</script>