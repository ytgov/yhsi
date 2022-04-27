<template lang="pug">
v-card.default.mb-4(tag="section")
  v-card-title.mb-0.text-h6(tag="h3")
    | Dates
  v-card-text(tag="form")
    template(v-if="dates.length === 0")
      span No dates
    template(v-else)
      div(
        v-for="(date, i) in dates",
        :key="i"
      )
        v-row
          v-col(cols="6")
            DateTypesSelect(
              :value="date.type"
              readonly
              dense
              outlined
              background-color="white"
              hide-details
            )
          v-col(cols="6")
            v-text-field(
              :value="date.details"
              label="Details"
              readonly
              dense
              outlined
              hide-details
              background-color="white"
            )
        v-row
          v-col(cols="6")
            v-text-field(
              :value="date.fromDate"
              label="From date"
              append-icon="mdi-calendar"
              readonly
              outlined
              dense
              hide-details
              background-color="white"
            )
          v-col(cols="6")
            v-text-field(
              :value="date.toDate"
              label="To date"
              append-icon="mdi-calendar"
              readonly
              outlined
              dense
              hide-details
              background-color="white"
            )
        v-row.my-0(v-if="i < dates.length - 1")
          v-col(cols="12")
            v-divider.black
</template>

<script>
import DateTypesSelect from '@/components/Sites/site-forms/DateTypesSelect';

export default {
  name: 'DatesViewer',
  components: { DateTypesSelect },
  props: {
    value: {
      type: Array,
      default: () => [],
    },
  },
  computed: {
    dates() {
      return this.value;
    },
  },
};
</script>

<style scoped></style>
