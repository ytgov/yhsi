<template lang="pug">
v-select(
  label="Type",
  :items="contactTypeOptions"
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
import api from '@/apis/contact-types-api';

export default {
  name: 'ContactTypeSelect',
  data: () => ({
    contactTypeOptions: [],
    loading: false,
  }),
  mounted() {
    this.getContactTypeOptions();
  },
  methods: {
    getContactTypeOptions() {
      this.loading = true;
      return api
        .getAll()
        .then(({ data }) => {
          this.contactTypeOptions = data;
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
