<template lang="pug">
v-card.default.mb-0(tag="section")
  v-card-title.mb-0.text-h6(tag="h3")
    | First Nation Associations
  v-card-text(tag="form")
    v-row(
      v-for="(firstNationAssociation, i) in firstNationAssociations",
      :key="i"
    )
      v-col(cols="5")
        FirstNationAssociationTypesSelect(
          v-model="firstNationAssociation.firstNationAssociationType"
          dense
          outlined
          hide-details
          background-color="white"
        )
      v-col(cols="5")
        FirstNationSelect(
          v-model="firstNationAssociation.firstNationId"
          dense
          outlined
          hide-details
          background-color="white"
        )
      v-col(cols="2")
        v-btn.my-0.float-right(
          color="warning"
          x-small
          fab
          title="Remove"
          @click="removeFNAssociation(i)"
        )
          v-icon mdi-close
      v-col(cols="10")
        v-text-field(
          v-model="firstNationAssociation.comments"
          label="Comments"
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
  v-card-actions
    v-btn.my-0(
      color="info"
      @click="addFNAssociation"
    )
      | Add Association
</template>

<script>
import FirstNationAssociationTypesSelect from '@/components/Sites/site-forms/associations/FirstNationAssociationTypesSelect';
import FirstNationSelect from '@/components/Sites/site-forms/associations/FirstNationSelect';

export default {
  name: 'FirstNationAssociationsEditor',
  components: { FirstNationAssociationTypesSelect, FirstNationSelect },
  props: {
    value: {
      type: Array,
      default: () => [],
    },
    placeId: {
      type: [String, Number],
      required: true,
    },
  },
  computed: {
    firstNationAssociations() {
      return this.value;
    },
  },
  watch: {},
  mounted() {},
  methods: {
    addFNAssociation() {
      this.firstNationAssociations.push({
        placeId: this.placeId,
        firstNationAssociationType: 1,
        firstNationId: 1,
      });
    },
    removeFNAssociation(index) {
      this.firstNationAssociations.splice(index, 1);
    },
  },
};
</script>

<style scoped></style>
