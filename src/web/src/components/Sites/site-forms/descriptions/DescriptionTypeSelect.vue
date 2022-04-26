<template lang="pug">
v-select(
  label="Decription type",
  :items="descriptionTypeOptions"
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
import api from '@/apis/description-types-api';

export default {
  name: 'DescriptionTypeSelect',
  data: () => ({
    descriptionTypeOptions: [],
    loading: false,
  }),
  mounted() {
    this.getDescriptionTypeOptions();
  },
  methods: {
    getDescriptionTypeOptions() {
      this.loading = true;
      return api
        .getAll()
        .then(({ data }) => {
          this.descriptionTypeOptions = data;
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
