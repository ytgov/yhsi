<template>
  <v-row justify="center">
    <v-dialog v-model="dialog" persistent max-width="600px" @click:outside="close">
      <v-card>
        <v-card-title>Edit Cemetery</v-card-title>
        <v-card-text>
          <v-form ref="form" v-model="valid" :lazy-validation="false">
            <v-text-field label="Cemetery Name" v-model="cemetary" :rules="[(v) => !!v || 'Cemetery name is required']"
              outlined dense></v-text-field>
            <v-text-field label="Community" v-model="community" outlined dense></v-text-field>
            <v-text-field label="Address" v-model="address" outlined dense></v-text-field>
            <v-text-field label="Notes" v-model="notes" outlined dense></v-text-field>
            <v-text-field label="Latitude" v-model="latitude" outlined dense></v-text-field>
            <v-text-field label="Longitude" v-model="longitude" outlined dense></v-text-field>
          </v-form>
        </v-card-text>
        <v-card-actions class="px-6">
          <v-btn @click="close" outlined color="warning">Cancel</v-btn>
          <v-spacer></v-spacer>
          <v-btn color="success" :disabled="!valid" :loading="saving" @click="save">
            Save
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
import catalogs from '../../../../controllers/catalogs';

export default {
  props: ['dialog', 'item'],
  data: () => ({
    valid: false,
    cemetary: '',
    community: '',
    address: '',
    notes: '',
    latitude: '',
    longitude: '',
    saving: false,
  }),
  watch: {
    item: {
      handler(val) {
        if (val) {
          this.cemetary = val.Cemetary || '';
          this.community = val.Community || '';
          this.address = val.Address || '';
          this.notes = val.Notes || '';
          this.latitude = val.Latitude || '';
          this.longitude = val.Longitude || '';
        }
      },
      immediate: true,
    },
  },
  methods: {
    async save() {
      if (!this.$refs.form.validate()) return;
      this.saving = true;
      try {
        await catalogs.putCemetary(this.item.CemetaryLUpID, {
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
        this.close();
      } catch (e) {
        console.error(e);
      } finally {
        this.saving = false;
      }
    },
    close() {
      this.$emit('close');
    },
  },
};
</script>
