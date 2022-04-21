<template lang="pug">
v-card.default(tag="section")
  v-card-title.mb-0.text-h6(tag="h3")
    | Revision Logs
  v-card-text(tag="form")
    div(
      v-for="(item, i) in revisionLogs",
      :key="`log-${i + 1}`"
    )
      v-row
        v-col(cols="5")
          v-select(
            v-model="item.revisionLogType",
            :items="revisionTypeOptions"
            label="Revision Type"
            outlined
            dense
            background-color="white"
          )
          v-text-field(
            v-model="item.revisedBy"
            label="Revised By"
            required
            outlined
            dense
            hide-details
            background-color="white"
          )
        v-col(cols="5")
          v-text-field(
            v-model="item.revisionDate"
            label="Date"
            required
            outlined
            dense
            background-color="white"
          )
          v-text-field(
            v-model="item.details"
            label="Details"
            required
            outlined
            dense
            hide-details
            background-color="white"
          )
        v-col(cols="2")
          v-btn.my-0.float-right(
            color="warning"
            x-small
            fab
            title="Remove"
            @click="removeLog(i)"
          )
            v-icon(dark) mdi-close
        v-col(
          v-if="i < revisionLogs.length - 1"
          cols="12"
        )
          v-divider.black
  v-card-actions
    v-btn.my-0(
      color="info"
      @click="addLog"
    )
      | Add New
</template>

<script>
import { mapGetters } from 'vuex';
import axios from 'axios';

import { STATIC_URL } from '@/urls';

export default {
  name: 'RevisionLogEditor',
  components: {},
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
  data: () => ({
    revisionTypeOptions: [],
  }),
  computed: {
    ...mapGetters({ currentUserFullName: 'fullName' }),
    revisionLogs() {
      return this.value;
    },
  },
  mounted() {
    axios.get(`${STATIC_URL}/revision-log-type`).then((resp) => {
      this.revisionTypeOptions = resp.data.data;
    });
  },
  methods: {
    addLog() {
      let date = new Date();
      let month = ('0' + (date.getMonth() + 1)).slice(-2);
      let day = ('0' + date.getDate()).slice(-2);

      this.revisionLogs.push({
        placeId: this.placeId,
        revisionLogType: 5,
        revisionDate: `${date.getFullYear()}-${month}-${day}`,
        revisedBy: this.currentUserFullName, // this should be set in the back-end for security reasons.
      });
    },
    removeLog(index) {
      this.revisionLogs.splice(index, 1);
    },
  },
};
</script>

<style scoped></style>
