<template>
    <v-dialog v-model="dialog" persistent max-width="600px" @click:outside="reset()">
      <v-card>
        <v-card-title>
          <span class="text-h7">What would you like to name this photo batch?</span>
        </v-card-title>
        <v-card-text>
          <v-form
            ref="itemForm"
            :lazy-validation="false"
            v-model="valid"
          >
            <v-text-field
              outlined
              dense
              placeholder="Enter a name"
              v-model="photoBatchAttributes.name"
              :rules="generalRules"
            ></v-text-field>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-btn color="warning" outlined @click="closeDialog">
            Cancel
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn color="primary" :disabled="!valid" @click="onSave">
            Save
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
</template>

<script>
import axios from "axios";
import { mapActions, mapGetters } from 'vuex';

import { PHOTO_BATCH_URL } from "../../../urls";

export default {
  data: () => ({
    dialog: false,
    photoBatchAttributes: {
      name: null,
    },
    valid: false,
    generalRules: [(v) => !!v || "This field is required"],
  }),
  mounted(){
    this.loadProfile();
  },
  computed: {
    ...mapGetters({
      currentUserId: 'profile/id',
    }),
  },
  methods: {
    openDialog() {
      this.dialog = true;
    },
    closeDialog() {
      this.dialog = false;
      this.reset();
      this.resetValidation();
    },
    onSave() {
      this.validate();
      if (!this.valid) return;

      let body = { name: this.photoBatchAttributes.name, userId: this.currentUserId }
      console.log("Creating photo batch");
      console.log({body});
      axios
        .post(`${PHOTO_BATCH_URL}`, body)
        .then((resp) => {
          this.$store.commit("photos/setBatchId", resp.data.data[0].id);
          this.$store.commit("alerts/setText",'Batch added');
          this.$store.commit("alerts/setType", "success");
          this.$store.commit("alerts/setTimeout", 5000);
          this.$store.commit("alerts/setAlert", true);
          this.$emit('created', resp.data.data[0].id);
        })
        .catch((err) => {
          this.$store.commit("alerts/setText",err);
          this.$store.commit("alerts/setType", "warning");
          this.$store.commit("alerts/setTimeout", 5000);
          this.$store.commit("alerts/setAlert", true); 
        });
    },
    validate() {
      this.$refs.itemForm.validate();
    },
    reset() {
      this.photoBatchAttributes.name = null;
      this.dialog = false;
      this.$refs.itemForm.reset();
    },
    resetValidation() {
      this.$refs.itemForm.resetValidation();
    },
    ...mapActions({
      loadProfile: 'profile/loadProfile',
    })  
  },
};
</script>
