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
        v-model="place.associations"
        :place-id="placeId"
      />
      <FirstNationAssociationsViewer
        v-model="place.firstNationAssociations"
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
  data: () => ({}),
  computed: {
    ...mapGetters({
      place: 'places/place',
    }),
  },
  mounted() {},
  methods: {
    ...mapActions({
      savePlace: 'places/save',
    }),
    saveChanges() {
      const data = pick(this.place, [
        'associations',
        'firstNationAssociations',
      ]);

      return this.savePlace(data);
    },
  },
};
</script>
