<template>
  <v-dialog v-model="dialog" persistent max-width="500px" @click:outside="reset">
    <template v-slot:activator="{ on, attrs }">
      <v-btn v-bind="attrs" v-on="on" color="primary" class="my-0" style="height: 40px">
        Add Asset Type
      </v-btn>
    </template>
    <v-card>
      <v-card-title>New Asset Type</v-card-title>
      <v-card-text>
        <v-form ref="form" v-model="valid" :lazy-validation="false">
          <v-text-field label="Type" v-model="type" :rules="[(v) => !!v || 'Type is required']" outlined dense
            autofocus></v-text-field>
          <v-text-field label="Category" v-model="category" :rules="[(v) => !!v || 'Category is required']" outlined
            dense></v-text-field>
          <v-select label="Status" v-model="status" :items="statuses" item-text="text" item-value="value" outlined
            dense></v-select>
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
    type: '',
    category: '',
    status: true,
    saving: false,
    statuses: [
      { text: 'Active', value: true },
      { text: 'Inactive', value: false },
    ],
  }),
  methods: {
    async save() {
      if (!this.$refs.form.validate()) return;
      this.saving = true;
      try {
        await catalogs.postAssetType({ data: { Type: this.type, Category: this.category, Status: this.status } });
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
      this.type = '';
      this.category = '';
      this.status = true;
      this.$refs.form && this.$refs.form.reset();
    },
  },
};
</script>
