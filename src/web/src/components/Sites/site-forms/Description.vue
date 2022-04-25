<template>
  <v-card
    tag="section"
    outlined
    tile
  >
    <v-card-title
      class="mb-0 text-h4"
      tag="h2"
    >
      Description
    </v-card-title>
    <v-card-text tag="section">
      <DescriptionsEditor
        v-model="descriptions"
        :place-id="placeId"
      />
    </v-card-text>
    <v-card-actions>
      <v-spacer />
      <v-btn
        class="my-0"
        color="primary"
        @click="saveChanges"
      >
        Save
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import axios from 'axios';
import { PLACE_URL } from '@/urls';

import DescriptionsEditor from '@/components/Sites/site-forms/descriptions/DescriptionsEditor';

export default {
  name: 'Description',
  components: { DescriptionsEditor },
  props: {
    placeId: {
      type: [Number, String],
      required: true,
    },
  },
  data: () => ({
    descriptions: [],
  }),
  mounted() {
    axios
      .get(`${PLACE_URL}/${this.placeId}`)
      .then((resp) => {
        this.fields = resp.data.data;
        this.descriptions = resp.data.relationships.descriptions.data;
      })
      .catch((error) => console.error(error));
  },
  methods: {
    saveChanges() {
      let body = {
        descriptions: this.descriptions,
      };

      axios
        .put(`${PLACE_URL}/${this.placeId}/description`, body)
        .then((resp) => {
          this.$emit('showAPIMessages', resp.data);
        })
        .catch((err) => {
          this.$emit('showError', err);
        });
    },
  },
};
</script>
