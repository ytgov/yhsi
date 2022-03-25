<template>
  <v-progress-circular
    v-if="loading"
    indeterminate
    size="20"
    width="2"
  />
  <span v-else>
    {{ communityName }}
  </span>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'CommunityCell',
  components: {},
  props: {
    communityId: {
      type: Number,
      required: true,
    },
  },
  data: () => ({}),
  computed: {
    ...mapGetters('communities', ['getById', 'loading']),
    community() {
      return this.getById(this.communityId) || {};
    },
    communityName() {
      return this.community.name;
    },
  },
};
</script>

<style scoped></style>
