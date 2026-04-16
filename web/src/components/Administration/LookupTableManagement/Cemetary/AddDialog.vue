<template>
  <v-dialog v-model="dialog" persistent max-width="600px" @click:outside="reset">
    <template v-slot:activator="{ on, attrs }">
      <v-btn v-bind="attrs" v-on="on" color="primary" class="my-0" style="height: 40px">
        Add Cemetery
      </v-btn>
    </template>
    <v-card>
      <v-card-title>New Cemetery</v-card-title>
      <v-card-text>
        <v-form ref="form" v-model="valid" :lazy-validation="false">
          <v-text-field label="Cemetery Name" v-model="cemetary" :rules="[(v) => !!v || 'Cemetery name is required']"
            outlined dense autofocus></v-text-field>
          <v-text-field label="Community" v-model="community" outlined dense></v-text-field>
          <v-text-field label="Address" v-model="address" outlined dense></v-text-field>
          <v-text-field label="Notes" v-model="notes" outlined dense></v-text-field>
          <v-text-field label="Latitude" v-model="latitude" outlined dense></v-text-field>
          <v-text-field label="Longitude" v-model="longitude" outlined dense></v-text-field>
        </v-form>
      </v-card-text>
      <v-card-actions class="px-6">
        <v-btn outlined color="warning" @click="reset">Cancel</v-btn>
        <v-spacer></v-spacer>
        <v-btn color="success" :disabled="!valid" :loading="saving" @click="save">
          Save
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import catalogs from '../../../../controllers/catalogs';

export default {
  data: () => ({
    dialog: false,
    valid: false,
    cemetary: '',
    community: '',
    address: '',
    notes: '',
    latitude: '',
    longitude: '',
    saving: false,
  }),
  methods: {
    async save() {
      if (!this.$refs.form.validate()) return;
      this.saving = true;
      try {
        await catalogs.postCemetary({
          data: {
            Cemetary: this.cemetary,
            Community: this.community,
            Address: this.address,
            Notes: this.notes,
            Latitude: this.latitude,
            Longitude: this.longitude,
          },
        });
        this.$emit('saved');
        this.reset();
      } catch (e) {
        console.error(e);
      } finally {
        this.saving = false;
      }
    },
    reset() {
      this.dialog = false;
      this.cemetary = '';
      this.community = '';
      this.address = '';
      this.notes = '';
      this.latitude = '';
      this.longitude = '';
      this.$refs.form && this.$refs.form.reset();
    },
  },
};
</script>
