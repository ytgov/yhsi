<template>
  <v-dialog v-model="dialog" persistent max-width="600px" @click:outside="reset">
    <template v-slot:activator="{ on, attrs }">
      <v-btn v-bind="attrs" v-on="on" color="primary" class="my-0" style="height: 40px">
        Add Photo Owner
      </v-btn>
    </template>
    <v-card>
      <v-card-title>New Photo Owner</v-card-title>
      <v-card-text>
        <v-form ref="form" v-model="valid" :lazy-validation="false">
          <v-text-field label="Name" v-model="name" :rules="[(v) => !!v || 'Name is required']" outlined dense
            autofocus></v-text-field>
          <v-text-field label="Contact Person" v-model="contactPerson" outlined dense></v-text-field>
          <v-text-field label="Email" v-model="email" outlined dense></v-text-field>
          <v-text-field label="Phone" v-model="telephone" outlined dense></v-text-field>
          <v-text-field label="Address" v-model="address" outlined dense></v-text-field>
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
    name: '',
    contactPerson: '',
    email: '',
    telephone: '',
    address: '',
    saving: false,
  }),
  methods: {
    async save() {
      if (!this.$refs.form.validate()) return;
      this.saving = true;
      try {
        await catalogs.postPhotoOwner({
          name: this.name,
          contactPerson: this.contactPerson,
          email: this.email,
          telephone: this.telephone,
          address: this.address,
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
      this.name = '';
      this.contactPerson = '';
      this.email = '';
      this.telephone = '';
      this.address = '';
      this.$refs.form && this.$refs.form.reset();
    },
  },
};
</script>
