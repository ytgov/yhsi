<template>
  <v-row justify="center">
    <v-dialog v-model="dialog" persistent max-width="500px" @click:outside="close">
      <v-card>
        <v-card-title>Edit Interpretive Site Owner</v-card-title>
        <v-card-text>
          <v-form ref="form" v-model="valid" :lazy-validation="false">
            <v-text-field label="Name" v-model="name" :rules="[(v) => !!v || 'Name is required']" outlined
              dense></v-text-field>
            <v-text-field label="Notes" v-model="notes" outlined dense></v-text-field>
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
    notes: '',
    saving: false,
  }),
  watch: {
    item: {
      handler(val) {
        if (val) {
          this.name = val.MaintOwnName || '';
          this.notes = val.MaintOwnNotes || '';
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
        await catalogs.putMaintainers(this.item.MaintOwnLUpID, { data: { MaintOwnName: this.name, MaintOwnNotes: this.notes } });
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
