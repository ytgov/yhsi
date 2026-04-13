<template>
  <v-row justify="center">
    <v-dialog v-model="dialog" persistent max-width="600px" @click:outside="close">
      <v-card>
        <v-card-title>Edit Photo Project</v-card-title>
        <v-card-text>
          <v-form ref="form" v-model="valid" :lazy-validation="false">
            <v-text-field label="Name" v-model="name" :rules="[(v) => !!v || 'Name is required']" outlined
              dense></v-text-field>
            <v-text-field label="Permit" v-model="permit" outlined dense></v-text-field>
            <v-select label="Section" v-model="section" :items="sectionOptions" item-value="value" item-text="text"
              outlined dense></v-select>
            <v-text-field label="Year" v-model="year" outlined dense></v-text-field>
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
import { STATIC_URL } from '../../../../urls';
import axios from 'axios';

export default {
  props: ['dialog', 'item'],
  data: () => ({
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
  watch: {
    item: {
      handler(val) {
        if (val) {
          this.name = val.Name || '';
          this.permit = val.Permit || '';
          this.section = val.Section || null;
          this.year = val.Year || '';
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
        await catalogs.putPhotoProject(this.item.Id, {
          name: this.name,
          permit: this.permit,
          section: this.section,
          year: this.year,
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
