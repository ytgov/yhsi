<template lang="pug">
v-select(
  label="Category of Property",
  :items="ownershipTypeOptions"
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
import api from '@/apis/ownership-types-api';

export default {
  name: 'OwnershipTypesSelect',
  data: () => ({
    ownershipTypeOptions: [],
    loading: false,
  }),
  mounted() {
    this.getOwnershipTypeOptions();
  },
  methods: {
    getOwnershipTypeOptions() {
      this.loading = true;
      return api
        .getAll()
        .then(({ data }) => {
          this.ownershipTypeOptions = data;
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
