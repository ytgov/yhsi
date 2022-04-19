<template lang="pug">
.px-5.py-3
  h3 First Nation Associations
  template(v-if="firstNationAssociations.length === 0")
    span No first nation associations
  template(v-else)
    v-row(
      v-for="(firstNationAssociation, i) in firstNationAssociations",
      :key="i"
    )
      v-col(cols="6")
        FirstNationAssociationTypesSelect(
          :value="firstNationAssociation.firstNationAssociationType"
          readonly
          dense
          outlined
          hide-details
          background-color="white"
        )
      v-col(cols="6")
        FirstNationSelect(
          :value="firstNationAssociation.firstNationId"
          readonly
          dense
          outlined
          hide-details
          background-color="white"
        )
      v-col(cols="12")
        v-text-field(
          :value="firstNationAssociation.comments"
          label="Comments"
          readonly
          dense
          outlined
          hide-details
          background-color="white"
        )
      v-col(
        v-if="i < firstNationAssociations.length - 1"
        cols="12"
      )
        v-divider.black
</template>

<script>
import FirstNationAssociationTypesSelect from '@/components/Sites/site-forms/associations/FirstNationAssociationTypesSelect';
import FirstNationSelect from '@/components/Sites/site-forms/associations/FirstNationSelect';

export default {
  name: 'FirstNationAssociationsViewer',
  components: { FirstNationAssociationTypesSelect, FirstNationSelect },
  props: {
    value: {
      type: Array,
      default: () => [],
    },
  },
  computed: {
    firstNationAssociations() {
      return this.value;
    },
  },
};
</script>

<style scoped></style>
