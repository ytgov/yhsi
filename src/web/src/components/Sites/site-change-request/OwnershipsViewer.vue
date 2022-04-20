<template lang="pug">
.px-5.py-3
  h3 Ownerships
  template(v-if="ownerships.length === 0")
    span No ownerships
  template(v-else)
    v-row(
      v-for="(ownership, i) in ownerships",
      :key="i"
    )
      v-col(cols="6")
        OwnershipTypesSelect(
          v-model="ownership.ownershipType"
          readonly
          dense
          outlined
          hide-details
        )
      v-col(cols="6")
        v-text-field(
          v-model="ownership.comments"
          label="Comments"
          readonly
          dense
          outlined
          hide-details
        )
</template>

<script>
import OwnershipTypesSelect from '@/components/Sites/site-forms/legal-and-zoning/OwnershipTypesSelect';

export default {
  name: 'OwnershipsEditor',
  components: {
    OwnershipTypesSelect,
  },
  props: {
    value: {
      type: Array,
      default: () => [],
    },
  },
  computed: {
    ownerships() {
      return this.value;
    },
  },
};
</script>

<style scoped></style>
