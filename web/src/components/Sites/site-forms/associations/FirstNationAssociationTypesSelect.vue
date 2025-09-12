<template lang="pug">
v-select(
  label="Association",
  :items="firstNationAssociationTypeOptions"
  v-bind="$attrs"
  v-on="$listeners"
)
  template(
    v-for="(_, slot) of $scopedSlots"
    v-slot:[slot]="scope"
  )
    slot(
      :name="slot"
      v-bind="scope"
    )
</template>

<script>
import api from '@/apis/first-nation-association-types-api';

export default {
  name: 'FirstNationAssociationTypesSelect',
  components: {},
  props: {},
  data: () => ({
    firstNationAssociationTypeOptions: [],
    loading: false,
  }),
  computed: {},
  watch: {},
  mounted() {
    this.getFirstNationAssociationTypeOptions();
  },
  methods: {
    getFirstNationAssociationTypeOptions() {
      this.loading = true;
      return api
        .getAll()
        .then(({ data }) => {
          this.firstNationAssociationTypeOptions = data;
          return data;
        })
        .finally(() => {
          this.loading = false;
        });
    },
  },
};
</script>

<style scoped></style>
