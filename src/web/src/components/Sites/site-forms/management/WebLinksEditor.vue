<template lang="pug">
v-card.default
  v-card-title.mb-0.text-h6(tag="h3")
    | Web Links
  v-card-text(tag="form")
    div(
      v-for="(item, i) in webLinks",
      :key="`web-link-${i + 1}`"
    )
      v-row.mb-2
        v-col(cols="5")
          WebLinkTypeSelect(
            v-model="item.type"
            dense
            outlined
            hide-details
            background-color="white"
          )
        v-col(cols="5")
          v-text-field(
            v-model="item.address"
            label="Web Address"
            required
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
            @click="removeLink(i)"
          )
            v-icon(dark) mdi-close
  v-card-actions
    v-btn.my-0(
      color="info"
      @click="addLink"
    )
      | Add New
</template>

<script>
import WebLinkTypeSelect from '@/components/Sites/site-forms/management/WebLinkTypeSelect';

export default {
  name: 'WebLinksEditor',
  components: {
    WebLinkTypeSelect,
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
  computed: {
    webLinks() {
      return this.value;
    },
  },
  methods: {
    addLink() {
      this.webLinks.push({
        placeId: this.placeId,
        type: 1,
        address: 'https://',
      });
    },
    removeLink(index) {
      this.webLinks.splice(index, 1);
    },
  },
};
</script>

<style scoped></style>
