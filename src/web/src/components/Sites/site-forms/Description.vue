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
        v-model="place.descriptions"
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
import { mapActions, mapGetters } from 'vuex';
import { pick } from 'lodash';

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
  computed: {
    ...mapGetters({
      place: 'places/place',
    }),
  },
  methods: {
    ...mapActions({
      savePlace: 'places/save',
    }),
    saveChanges() {
      const data = pick(this.place, 'descriptions');

      return this.savePlace(data);
    },
  },
};
</script>
