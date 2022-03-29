<template lang="pug">
v-data-table(
  :headers='headers',
  :items='items',
  :options='options',
  :loading='loading',
  :server-items-length='serverItemsLength',
  :footer-props='{ "items-per-page-options": [20, 50, 100] }',
  @update:options='updateOptions'
)
</template>

<script>
import api from '@/apis/place-edits-api';

export default {
  name: 'SitesChangeRequestsTable',
  components: {},
  props: {},
  data: () => ({
    items: [],
    loading: false,
    options: {},
    page: 1,
    serverItemsLength: 1,
  }),
  computed: {
    headers() {
      return [
        { text: 'YHSI ID', value: 'yhsiId' },
        { text: 'Primary name', value: 'primaryName' },
        { text: 'Editor', value: 'editorEmail' },
      ];
    },
  },
  mounted() {},
  methods: {
    getPlaceEdits(options) {
      api.getAll(options).then(({ data }) => {
        this.items = data;
      });
    },
    updateOptions(options) {
      this.options = options;
      return this.getPlaceEdits(options);
    },
  },
};
</script>

<style scoped></style>
