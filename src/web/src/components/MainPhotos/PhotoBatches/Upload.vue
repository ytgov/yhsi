<template>
  <div>
    <h3>Batch Upload</h3>
    <Breadcrumbs />
    <v-row>
      <v-col cols="12" class="d-flex">
        <h1>{{displayName}}</h1>
        <v-spacer></v-spacer>       
              
        <v-btn class="mx-1 form-header" color="primary" @click="viewAttr()">
          <v-icon class="mr-1">mdi-pencil</v-icon>
          Batch Attributes
        </v-btn>    
              
        <v-btn class="mx-1 form-header" color="red" @click="deleteBatch()">
          <v-icon class="mr-1">mdi-close</v-icon>
          Remove Batch
        </v-btn> 
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="6">
        <v-img 
          class="mr-auto ml-auto"
          max-width="128"
          :src="require('../../../assets/add_photo.png')">
          </v-img>

        <v-file-input
          ref="fileupload"
          label="Choose photo to upload"
          prepend-icon="mdi-camera"
          accept="image/*"
          @change="onFileSelection"
          class="default mb-5" 
          dense
          outlined
          background-color="white"
          hide-details
        ></v-file-input>
      </v-col>
    </v-row>

    <v-row v-if="!loading">
      <v-col
        v-for="(item, i) in photos"
        :key="`photo-${i}`"
        class="d-flex child-flex"
        cols="2"
      >
        <v-hover>
          <template v-slot:default="{ hover }">
            <v-card class="mx-auto">
              <v-img
                :src="item.photoFile.base64"
                :lazy-src="item.photoFile.base64"
                class="white--text align-end"
                aspect-ratio="1"
              >
              </v-img>

              <v-card-actions>
                <v-card-subtitle
                  v-text="item.photoFileName"
                ></v-card-subtitle>
              </v-card-actions>

              <v-fade-transition>
                <v-overlay v-if="hover" absolute color="#036358">
                  <v-btn @click="removePhoto(item.id)">Remove Photo</v-btn>
                </v-overlay>
              </v-fade-transition>
            </v-card>
          </template>
        </v-hover>
      </v-col>
    </v-row>
    <v-row v-if="loading">
      <div class="loading">Loading...</div>
    </v-row>
  </div>
</template>

<script>
import Breadcrumbs from "../../Breadcrumbs";
//import _ from 'lodash';

import axios from "axios";
import { PHOTO_BATCH_URL } from "../../../urls";

export default {
  name: "photobatchupload",
  components: { Breadcrumbs },
  data: () => ({
    loading: false,
    displayName: null,
    photos: [],
    uploadFile: null,
  }),
  mounted(){
    this.storeRowId();
    this.loadBatch();
  },
  methods: {
    storeRowId() {
      if(this.$store.getters["photos/batchId"]) {
        localStorage.currentBatchId = this.$store.getters["photos/batchId"];
      }
    },
    loadBatch() {
      this.loading = true;
      axios
        .get(`${PHOTO_BATCH_URL}/${localStorage.currentBatchId}`)
        .then((resp) => {
          this.displayName = resp.data.data.name;     
        })
        .catch((error) => console.error(error))
        ; 
      axios
        .get(`${PHOTO_BATCH_URL}/${localStorage.currentBatchId}/photos`)
        .then((resp) => {
          this.photos = resp.data.data.map((x) => {
            x.photoFile.base64 = `data:image/png;base64,${this.toBase64(x.photoFile.data)}`;
            return x;
          });
        })
        .catch((err) => console.error('Error in loadBatch: '+ err))        
        .finally(() => {
          this.loading = false;
        });
    },
    toBase64(arr) {
      return btoa(
        arr.reduce((data, byte) => data + String.fromCharCode(byte), "")
      );
    },
    removePhoto(id) {
      axios
        .delete(`${PHOTO_BATCH_URL}/photo/${id}`)
        .then(() => {
          this.photos = this.photos.filter(function( obj ) {
            return obj.id !== id;
          });  
          this.$emit("showSuccess", 'Photo removed');
        })
        .catch((err) => {
            this.$emit("showError", err);
          });
         
    },
    onFileSelection(event){
      if(event) {
        this.uploadFile = event;
        let body = {};
        body.photoBatchId = localStorage.currentBatchId;
        body.photoContentType = this.uploadFile.type;

        const formData = new FormData();
        let prevFields = Object.entries(body);
        for (let i = 0; i < prevFields.length; i++) {
          if(prevFields[i][1] != null && prevFields[i][1] != 'undefined') {
            formData.append(prevFields[i][0], prevFields[i][1]);
          }
        }
        formData.append("file", this.uploadFile);
        console.log(this.uploadFile);
        axios
          .post(`${PHOTO_BATCH_URL}/photo/`, formData)
          .then((resp) => {
            let photo = resp.data.data[0];
            photo.photoFile.base64 = `data:image/png;base64,${this.toBase64(photo.photoFile.data)}`;
            this.photos.push(photo);
            this.$refs.fileupload.reset();
            this.$emit("showSuccess", 'Photo added');
          })
          .catch((err) => {
            this.$emit("showError", err);
          });
      }
    },
    deleteBatch() {
      if(confirm("Are you sure want to delete this photo batch?")){
        axios
          .delete(`${PHOTO_BATCH_URL}/${localStorage.currentBatchId}`)
          .then(() => { 
            this.$router.push('/photobatches');
            this.$emit("showSuccess", 'Batch deleted');
          })
          .catch((error) => console.error(error))
          ;  
      }
    },
    viewAttr() {
      this.$router.push('/photobatches/attributes/view');
    },
  }
};
</script>

<style scoped>

</style>