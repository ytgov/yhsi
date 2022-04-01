<template>
    <v-dialog v-model="dialog" persistent max-width="600px" @click:outside="reset()">
      <template v-slot:activator="{ on, attrs }">
        <v-btn v-if="itemType == 'filter'" v-bind="attrs" v-on="on" color="secondary" :disabled="isDisabled">
          <v-icon class="mr-1">mdi-check</v-icon>
          Save Filters
        </v-btn>
        <v-btn v-if="itemType == 'photobatch'" v-bind="attrs" v-on="on" :disabled="isDisabled" class="black--text mx-1">
          <v-icon class="mr-1">mdi-plus-circle-outline</v-icon> 
          Add Batch
        </v-btn>
      </template>
      <v-card>
        <v-card-title>
          <span v-if="itemType == 'filter'" class="text-h7">What would you like to name this filter?</span>
          <span v-if="itemType == 'photobatch'" class="text-h7">What would you like to name this photo batch?</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-form
                  ref="itemForm"
                  :lazy-validation="false"
                  v-model="valid"
                >
                  <v-text-field
                    placeholder="Enter a name"
                    v-model="itemName"
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
  props: ['itemType', 'isDisabled'],
  data: () => ({
    dialog: false,
    itemName: null,
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
      this.$emit('saveDialog',this.itemName);
      this.closeDialog();
    },
    validate() {
      this.$refs.itemForm.validate();
    },
    reset() {
      this.itemName = null;
      this.dialog = false;
      this.$refs.itemForm.reset();
    },
    resetValidation() {
      this.$refs.itemForm.resetValidation();
    },
  },
};
</script>