<template>
  <v-card
    tag="section"
    class="default mb-5"
  >
    <v-card-title
      tag="h3"
      class="mb-0 text-h6"
    >
      Construction Periods
    </v-card-title>
    <v-card-text tag="form">
      <v-row
        v-for="(constructionPeriod, i) in constructionPeriods"
        :key="i"
      >
        <v-col cols="10">
          <ConstructionPeriodSelect
            v-model="constructionPeriod.type"
            label=""
            dense
            outlined
            hide-details
            background-color="white"
          />
        </v-col>
        <v-col cols="2">
          <v-btn
            title="Remove"
            color="warning"
            x-small
            fab
            class="my-0"
            @click="removePeriod(i)"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-col>
      </v-row>
    </v-card-text>
    <v-card-actions>
      <v-btn
        class="my-0"
        color="info"
        @click="addPeriod"
      >
        Add construction period
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import ConstructionPeriodSelect from '@/components/Sites/site-forms/ConstructionPeriodSelect';

export default {
  name: 'ConstructionPeriodsEditor',
  components: {
    ConstructionPeriodSelect,
  },
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
  data: () => ({}),
  computed: {
    constructionPeriods() {
      return this.value;
    },
  },
  watch: {},
  mounted() {},
  methods: {
    addPeriod() {
      this.constructionPeriods.push({ placeId: this.placeId, type: 2 });
    },
    removePeriod(index) {
      this.constructionPeriods.splice(index, 1);
    },
  },
};
</script>

<style scoped></style>
