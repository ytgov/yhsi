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
            <CoordinateField axis="latitude" v-model="latitude" numeric warn-outside-yukon
              :paired-longitude="longitude" outlined dense />
            <CoordinateField axis="longitude" v-model="longitude" numeric warn-outside-yukon
              :paired-latitude="latitude" outlined dense />
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
import { isNil } from 'lodash';
import catalogs from '../../../../controllers/catalogs';
import CoordinateField from '@/components/CoordinateField.vue';

export default {
  components: { CoordinateField },
  props: ['dialog', 'item'],
  data: () => ({
    valid: false,
    cemetary: '',
    community: '',
    address: '',
    notes: '',
    latitude: null,
    longitude: null,
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
          // Not `|| null` — a real 0 must survive.
          this.latitude = isNil(val.Latitude) ? null : val.Latitude;
          this.longitude = isNil(val.Longitude) ? null : val.Longitude;
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
