<template lang="pug">
.px-5.py-3
  h3 Previous Ownerships
  template(v-if="previousOwnerships.length === 0")
    span No previous ownerships
  template(v-else)
    v-row(
      v-for="(previousOwnership, i) in previousOwnerships",
      :key="i"
    )
      v-col(cols="6")
        v-text-field(
          v-model="previousOwnership.ownershipDate"
          label="Dates"
          readonly
          dense
          outlined
          hide-details
        )
      v-col(cols="6")
        v-text-field(
          v-model="previousOwnership.ownershipNumber"
          label="Title number"
          readonly
          dense
          outlined
          hide-details
        )
      v-col(cols="12")
        v-text-field(
          v-model="previousOwnership.ownershipName"
          label="Names"
          readonly
          dense
          outlined
          hide-details
        )
      v-col(
        v-if="i < previousOwnerships.length - 1"
        cols="12"
      )
        v-divider.black
</template>

<script>
export default {
  name: 'PreviousOwnershipsEditor',
  props: {
    value: {
      type: Array,
      default: () => [],
    },
  },
  computed: {
    previousOwnerships() {
      return this.value;
    },
  },
};
</script>

<style scoped></style>
