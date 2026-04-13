<template>
  <v-row justify="center">
    <v-dialog v-model="dialog" persistent max-width="600px" @click:outside="close">
      <v-card>
        <v-card-title>Edit Photo Owner</v-card-title>
        <v-card-text>
          <v-form ref="form" v-model="valid" :lazy-validation="false">
            <v-text-field label="Name" v-model="name" :rules="[(v) => !!v || 'Name is required']" outlined
              dense></v-text-field>
            <v-text-field label="Contact Person" v-model="contactPerson" outlined dense></v-text-field>
            <v-text-field label="Email" v-model="email" outlined dense></v-text-field>
            <v-text-field label="Phone" v-model="telephone" outlined dense></v-text-field>
            <v-text-field label="Address" v-model="address" outlined dense></v-text-field>
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
    name: '',
    contactPerson: '',
    email: '',
    telephone: '',
    address: '',
    saving: false,
  }),
  watch: {
    item: {
      handler(val) {
        if (val) {
          this.name = val.Name || '';
          this.contactPerson = val.ContactPerson || '';
          this.email = val.Email || '';
          this.telephone = val.Telephone || '';
          this.address = val.Address || '';
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
        await catalogs.putPhotoOwner(this.item.Id, {
          name: this.name,
          contactPerson: this.contactPerson,
          email: this.email,
          telephone: this.telephone,
          address: this.address,
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
