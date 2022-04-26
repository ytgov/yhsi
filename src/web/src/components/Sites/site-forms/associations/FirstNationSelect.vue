<template lang="pug">
v-autocomplete(
  label="First Nation",
  :items="firstNationsOptions"
  item-value="id"
  item-text="description"
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
import api from '@/apis/first-nations-api';

export default {
  name: 'FirstNationSelect',
  components: {},
  props: {},
  data: () => ({
    firstNationsOptions: [],
    loading: false,
  }),
  computed: {},
  watch: {},
  mounted() {
    this.getFirstNationsOptions();
  },
  methods: {
    getFirstNationsOptions() {
      this.loading = true;
      return api
        .getAll()
        .then(({ data }) => {
          this.firstNationsOptions = data;
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
