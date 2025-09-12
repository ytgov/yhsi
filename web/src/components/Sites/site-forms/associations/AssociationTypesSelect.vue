<template lang="pug">
v-select(
  label="Association type",
  :items="associationTypeOptions"
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
import api from '@/apis/association-types-api';

export default {
  name: 'AssociationTypesSelect',
  components: {},
  props: {},
  data: () => ({
    associationTypeOptions: [],
    loading: false,
  }),
  computed: {},
  watch: {},
  mounted() {
    this.getAssociationTypeOptions();
  },
  methods: {
    getAssociationTypeOptions() {
      this.loading = true;
      return api
        .getAll()
        .then(({ data }) => {
          this.associationTypeOptions = data;
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
