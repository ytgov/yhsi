<template>
  <v-card>
    <div
      class="center-children"
      style="height: 450px"
    >
      <v-img
        height="200"
        width="200"
        :src="require('../../assets/add_photo.png')"
        :lazy-src="require('../../assets/add_photo.png')"
      ></v-img>
    </div>

    <v-divider></v-divider>

    <v-row>
			<v-col cols="12">
				<p class="text-center font-weight-bold pt-3">
					Once you upload your new item data you will be able to attach photos
				</p>
			</v-col>
		</v-row>
  </v-card>
</template>

<script>
export default {
  name: 'EmptyPhotosCard',
};
</script>

<style scoped>
.center-children {
	display: grid;
	place-items: center;
}
</style>
