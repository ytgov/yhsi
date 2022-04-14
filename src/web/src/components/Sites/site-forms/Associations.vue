<template>
  <v-card
    class="mb-0"
    tag="section"
    outlined
    tile
  >
    <v-card-title
      class="mb-0 text-h4"
      tag="h2"
    >
      Associations
    </v-card-title>
    <v-card-text>
      <AssociationsViewer
        v-model="associations"
        :place-id="placeId"
      />
      <FirstNationAssociationsViewer
        v-model="associations"
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

import { PLACE_URL } from '../../../urls';
import AssociationsViewer from '@/components/Sites/site-forms/associations/AssociationsViewer';
import FirstNationAssociationsViewer from '@/components/Sites/site-forms/associations/FirstNationAssociationsViewer';

export default {
  name: 'Associations',
  components: { AssociationsViewer, FirstNationAssociationsViewer },
  props: {
    placeId: {
      type: [Number, String],
      required: true,
    },
  },
  data: () => ({
    associations: [],
    firstNationAssociations: [],
  }),
  mounted() {
    axios
      .get(`${PLACE_URL}/${this.placeId}`)
      .then((resp) => {
        this.associations = resp.data.relationships.associations.data;
        this.firstNationAssociations =
          resp.data.relationships.firstNationAssociations.data;
      })
      .catch((error) => console.error(error));
  },
  methods: {
    saveChanges() {
      let body = {
        associations: this.associations,
        firstNationAssociations: this.firstNationAssociations,
      };

      axios
        .put(`${PLACE_URL}/${this.placeId}/associations`, body)
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
