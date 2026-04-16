<template>
  <v-dialog v-model="dialog" persistent max-width="500px" @click:outside="reset">
    <template v-slot:activator="{ on, attrs }">
      <v-btn v-bind="attrs" v-on="on" color="primary" class="my-0" style="height: 40px">
        Add Relationship
      </v-btn>
    </template>
    <v-card>
      <v-card-title>New Relationship</v-card-title>
      <v-card-text>
        <v-form ref="form" v-model="valid" :lazy-validation="false">
          <v-text-field label="Relationship" v-model="input" :rules="[(v) => !!v || 'Relationship is required']" outlined dense
            autofocus></v-text-field>
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
    input: '',
    saving: false,
  }),
  methods: {
    async save() {
      if (!this.$refs.form.validate()) return;
      this.saving = true;
      try {
        await catalogs.postRelationship({ data: { Relationship: this.input } });
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
      this.input = '';
      this.$refs.form && this.$refs.form.reset();
    },
  },
};
</script>
