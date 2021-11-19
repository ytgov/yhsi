<template>
  <v-carousel
    id="carousell"
    v-model="selectedCarousellImage"
    height="450"
    hide-delimiter-background
  >
    <v-carousel-item
      v-for="(item, i) in photos"
      :key="i"
      :src="item.File.base64"
      :lazy-src="item.File.base64"
    ></v-carousel-item>
  </v-carousel>
</template>

<script>
export default {
  props: ["photos"],
  data: () => ({
    selectedCarousellImage: 0,
  }),
  watch: {
    selectedCarousellImage(val) {
      this.$emit("changedSelectedImage", val);
    },
  },
};
</script>