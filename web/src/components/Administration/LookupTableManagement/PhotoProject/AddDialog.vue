<template>
  <v-dialog v-model="dialog" persistent max-width="600px" @click:outside="reset">
    <template v-slot:activator="{ on, attrs }">
      <v-btn v-bind="attrs" v-on="on" color="primary" class="my-0" style="height: 40px">
        Add Photo Project
      </v-btn>
    </template>
    <v-card>
      <v-card-title>New Photo Project</v-card-title>
      <v-card-text>
        <v-form ref="form" v-model="valid" :lazy-validation="false">
          <v-text-field label="Name" v-model="name" :rules="[(v) => !!v || 'Name is required']" outlined dense
            autofocus></v-text-field>
          <v-text-field label="Permit" v-model="permit" outlined dense></v-text-field>
          <v-select label="Section" v-model="section" :items="sectionOptions" item-value="value" item-text="text"
            outlined dense></v-select>
          <v-text-field label="Year" v-model="year" outlined dense></v-text-field>
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
import { STATIC_URL } from '../../../../urls';
import axios from 'axios';

export default {
  data: () => ({
    dialog: false,
    valid: false,
    name: '',
    permit: '',
    section: null,
    year: '',
    saving: false,
    sectionOptions: [],
  }),
  created() {
    axios.get(`${STATIC_URL}/photo-project-section`).then((resp) => {
      this.sectionOptions = resp.data.data;
    });
  },
  methods: {
    async save() {
      if (!this.$refs.form.validate()) return;
      this.saving = true;
      try {
        await catalogs.postPhotoProject({
          name: this.name,
          permit: this.permit,
          section: this.section,
          year: this.year,
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
      this.permit = '';
      this.section = null;
      this.year = '';
      this.$refs.form && this.$refs.form.reset();
    },
  },
};
</script>
