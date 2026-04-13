<template>
  <v-row justify="center">
    <v-dialog v-model="dialog" persistent max-width="500px" @click:outside="reset">
      <template v-slot:activator="{ on, attrs }">
        <v-btn v-bind="attrs" v-on="on" color="primary">
          Add First Nation
        </v-btn>
      </template>
      <v-card>
        <v-card-title>New First Nation</v-card-title>
        <v-card-text>
          <v-form ref="form" v-model="valid" :lazy-validation="false">
            <v-text-field
              label="Name"
              v-model="description"
              :rules="[(v) => !!v || 'Name is required']"
              outlined
              dense
              autofocus
            ></v-text-field>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-btn text @click="reset">Cancel</v-btn>
          <v-spacer></v-spacer>
          <v-btn color="success" text :disabled="!valid" :loading="saving" @click="save">
            Save
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
import api from '@/apis/first-nations-api';

export default {
  data: () => ({
    dialog: false,
    valid: false,
    description: '',
    saving: false,
  }),
  methods: {
    async save() {
      if (!this.$refs.form.validate()) return;
      this.saving = true;
      try {
        await api.create(this.description);
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
      this.description = '';
      this.$refs.form && this.$refs.form.reset();
    },
  },
};
</script>
