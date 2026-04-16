<template>
  <v-row justify="center">
    <v-dialog v-model="dialog" persistent max-width="500px" @click:outside="close">
      <v-card>
        <v-card-title>Edit Category</v-card-title>
        <v-card-text>
          <v-form ref="form" v-model="valid" :lazy-validation="false">
            <v-text-field label="Category" v-model="category" :rules="[(v) => !!v || 'Category is required']" outlined
              dense></v-text-field>
            <v-select label="Status" v-model="status" :items="statuses" item-text="text" item-value="value" outlined
              dense></v-select>
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
    category: '',
    status: true,
    saving: false,
    statuses: [
      { text: 'Active', value: true },
      { text: 'Inactive', value: false },
    ],
  }),
  watch: {
    item: {
      handler(val) {
        if (val) {
          this.category = val.Category || '';
          this.status = !!val.Status;
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
        await catalogs.putCategory(this.item.CatLUpID, { data: { Category: this.category, Status: this.status } });
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
