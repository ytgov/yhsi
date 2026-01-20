<!-- 
Photo carousel card for a generic record type

Supported records:
- place
- (untested) boat
- (untested) aircrash
- ytplace
- (untested) burial
- (untested) interpretive-sites
- people
-->
<template>
  <div>
    <v-card>
      <div v-if="photos.length === 0"
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
      <div v-else>
        <v-carousel 
          v-model="selectedPhoto" 
          id="carousell"
          height="450" 
          hide-delimiter-background
        >
          <v-carousel-item
            v-for="(item, i) in photos"
            :key="i"
            :src="item.ThumbFile.base64"
            :lazy-src="item.ThumbFile.base64" 
          >
          </v-carousel-item>
        </v-carousel>
      </div>

      <v-divider></v-divider>

      <v-row>
        <v-col 
          cols="12"
          class="d-flex"
        >
          <v-btn
            v-if="showAddPhotoButton"
            color="success"
            class="ml-3"
            dark
            @click="openAddPhotoDialog"
          >
          	<v-icon class="mr-1">mdi-plus</v-icon>
						Add Photo
          </v-btn>
          
          <v-spacer></v-spacer>

          <v-btn 
            color="success"
            dark
            class="mr-3"
            @click="openPhotosDialog"
          >
            <v-icon class="mr-1">mdi-view-grid</v-icon>
            View all Photos
          </v-btn>
        </v-col>
      </v-row>
    </v-card>
    
    <GenericRecordAddOrLinkPhotoDialog
      ref="genericRecordAddOrLinkPhotoDialog"
      :record="record"
      :recordId="recordId"
    />

    <PhotosFilterableDialog
      ref="photosFilterableDialog"
      :photos="photos"
    />
  </div>
</template>

<script>
import { isNil } from 'lodash';

import photos from '@/controllers/photos';

import GenericRecordAddOrLinkPhotoDialog from '@/components/photos/GenericRecordAddOrLinkPhotoDialog.vue';
import PhotosFilterableDialog from '@/components/photos/PhotosFilterableDialog.vue';

export default {
  name: 'GenericRecordPhotosCard',
  components: {
    GenericRecordAddOrLinkPhotoDialog,
    PhotosFilterableDialog,
  },
  props: {
    record: {
      type: String,
      required: true,
    },
    recordId: {
      required: true,
    },
    showAddPhotoButton: {
      type: Boolean,
      default: false,
    },
  },
  data: () => ({
    photos: [],
    selectedPhoto: 0,
    loading: false,
  }),
  mounted() {
    this.getPhotos();
  },
  methods: {
    openAddPhotoDialog() {
      this.$refs.genericRecordAddOrLinkPhotoDialog.show();
    },
    openPhotosDialog() {
      this.$refs.photosFilterableDialog.show();
    },
    async getPhotos(){
      this.loading = true;

      switch(this.record) {
        case 'place':
        case 'boat':
        case 'aircrash':
        case 'ytplace':
        case 'burial':
        case 'interpretive-sites':
        case 'people':
          break;
        default:
          throw new Error('Invalid or Unsupported record type');
      }

      if(isNil(this.recordId)) {
        throw new Error('Record ID is required');
      }

      const { data } = await photos.getGeneral(this.record, this.recordId)
      this.photos = data.map((photo) => {
        		photo.ThumbFile.base64 = `data:image/png;base64,${this.toBase64(
						photo.ThumbFile.data
					)}`;
					//photo.File.base64 = `data:image/png;base64,${this.toBase64(photo.File.data)}`;
					photo.selected = false;
          return photo;
      })
      
      this.loading = false;
    },
    toBase64(arr) {
			return btoa(
				arr.reduce((data, byte) => data + String.fromCharCode(byte), '')
			);
		},
  },
};
</script>

<style scoped>
.scroll {
	height: 720px;
	overflow: auto;
}
.center-children {
	display: grid;
	place-items: center;
}
</style>
