<template>
  <v-dialog v-model="dialog" persistent max-width="500px" @click:outside="close">
    <v-card>
      <v-card-title>Edit Community</v-card-title>
      <v-card-text>
        <v-form ref="form" v-model="valid" :lazy-validation="false">
          <v-text-field
            label="Community Name"
            v-model="input"
            :rules="[(v) => !!v || 'Name is required']"
            outlined
            dense
          ></v-text-field>
          <v-text-field
            label="Community Name (French)"
            v-model="inputFR"
            outlined
            dense
          ></v-text-field>
        </v-form>
      </v-card-text>
      <v-card-actions class="px-6">
        <v-btn outlined color="warning" @click="close">Cancel</v-btn>
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
  props: ['dialog', 'data'],
  data: () => ({
    valid: false,
    input: null,
    inputFR: null,
    saving: false,
  }),
  watch: {
    data: {
      handler(val) {
        if (val) {
          this.input = val.Name;
          this.inputFR = val.FR_Name;
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
        await catalogs.putCommunity(this.data.Id, { community: { Name: this.input, FR_Name: this.inputFR } });
        this.$emit('saved');
        this.close();
      } catch (e) {
        console.error(e);
      } finally {
        this.saving = false;
      }
    },
    close() {
      this.$emit('closeEditDialog');
    },
  },
};
</script>
