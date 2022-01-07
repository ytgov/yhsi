<template>
    <!-- <div>
          <v-card-title primary-title>
            Photos
          </v-card-title>
          <v-divider inset></v-divider>
          <v-form v-model="valid">
              <v-container>
                <v-row>
                    <v-col
                        cols="12"
                    >
                        <v-text-field 
                        v-model="categoryOfProperty"
                        label="Category of Property"
                        required
                        ></v-text-field>
                    </v-col>
                </v-row>
                <v-row>  
                    <v-col cols="6" v-for="(item, i) in fields.photos" :key="`theme-${i+1}`">
                        <v-alert 
                            outlined
                            color="primary"
                        >
                            <div class="sub-title">
                                Photo {{ i+1 }}
                            </div>
                            <v-btn
                                icon
                                color="primary"
                                class="top-right-button"
                                @click="removeItem('photos', i)"
                            >
                                <v-icon dark>mdi-close-circle</v-icon>
                            </v-btn>
                            <v-row>
                                <v-col cols="12">
                                    <v-img v-if="item.img == null"
                                    class="center-img"
                                    max-width="128"
                                    :src="require('../../../assets/add_photo.png')">
                                    </v-img>
                                    <v-img v-else
                                    class="center-img"
                                    max-width="128"
                                    :src="item.img">
                                    </v-img>
                                </v-col>
                            </v-row>
                            <v-row>
                                <v-col cols="12">
                                    <v-text-field 
                                    v-model="item.name"
                                    label="Feature Name"
                                    required
                                    ></v-text-field> -->
  <div>
    <v-card-title style="width: 100%; display: block">
      Photos
      <div class="float-right">
        <v-btn class="my-0" color="primary" @click="saveChanges()">Save</v-btn>
      </div>
    </v-card-title>
    <v-divider class="mb-5"></v-divider>
    <v-form v-model="valid">
      <div class="row mx-1">
        <div class="col-md-12">
          <v-text-field
            v-model="categoryOfProperty"
            label="Category of Property"
            dense
            outlined
            background-color="white"
          ></v-text-field>
        </div>

        <div
          class="col-md-6"
          v-for="(item, i) in photos"
          :key="`theme-${i + 1}`"
        >
          <v-card class="default">
            <v-card-text
              ><v-btn
                color="warning"
                x-small
                fab
                title="Remove"
                class="my-0 float-right"
                @click="removePhoto(i)"
                ><v-icon>mdi-close</v-icon></v-btn
              >
              <h3>Photo {{ i + 1 }}</h3>

              <v-row>
                <v-col cols="12">
                  <v-img
                    v-if="item.img == null"
                    class="center-img"
                    max-width="128"
                    :src="require('../../../assets/add_photo.png')"
                  >
                  </v-img>
                  <v-img
                    v-else
                    class="center-img"
                    max-width="128"
                    :src="item.img"
                  >
                  </v-img>
                </v-col>
              </v-row>
              <v-text-field
                v-model="item.featureName"
                label="Feature name"
                dense
                outlined
                background-color="white"
              ></v-text-field>

              <v-text-field
                v-model="item.caption"
                label="Caption"
                dense
                outlined
                background-color="white"
              ></v-text-field>

              <v-text-field
                v-model="item.comments"
                label="Comments"
                dense
                outlined
                background-color="white"
              ></v-text-field>

              <v-text-field
                v-model="item.creditLine"
                label="Credit line"
                dense
                outlined
                background-color="white"
              ></v-text-field>

              <v-text-field
                v-model="item.location"
                label="Location"
                dense
                outlined
                background-color="white"
              ></v-text-field>
              <v-file-input
                :id="`fi-${i}`"
                label="Upload image"
                prepend-icon="mdi-camera"
                accept="image/*"
                dense
                outlined
                background-color="white"
                @change="onFileSelection($event, i)"
              ></v-file-input>
            </v-card-text>
          </v-card>
        </div>

        <v-col cols="12">
          <v-btn color="primary" @click="addPhoto()">Add Photo</v-btn>
        </v-col>
      </div>
    </v-form>
  </div>
</template>

<script>
import axios from "axios";
import store from "../../../store";
import { PLACE_URL } from "../../../urls";
/* Important**, field data that was not found on the swaggerhub api docs provided was assumed to be in development, hence, some placeholder variables were created. */
export default {
  name: "formPhotos",
  data: () => ({
    valid: false,
    generalRules: [
      (v) => !!v || "This input is required",
      (v) => v.length <= 20 || "This input must be less than 20 characters",
    ],

    photos: [],

    /* Placeholder variables below this line **Read above** */
    categoryOfProperty: "",
  }),
  created: function () {
    let id = this.$route.params.id;

    axios
      .get(`${PLACE_URL}/${id}`)
      .then((resp) => {
        this.fields = resp.data.data;
        this.photos = resp.data.relationships.photos.data;
        store.dispatch("addSiteHistory", resp.data.data);
        this.$parent.siteName = this.fields.primaryName;
      })
      .catch((error) => console.error(error));
  },
  methods: {
    addPhoto() {
      this.photos.push({});
    },
    removePhoto(index) {
      this.photos.splice(index, 1);
    },
    onFileSelection(event, i) {
      if (event) {
        //this.fields.photos[i].img = URL.createObjectURL(event.target.files[0]);
        this.fields.photos[i].img = URL.createObjectURL(event);
      } else {
        this.fields.photos[i].img = null;
      }
    },
    altImg(i) {
      // this function returns the src if
      console.log("", i);
    },
  },
};
</script>

<style scoped>
#backgroundimgsw {
  background-image: "../../assets/greyimg.jpg";
}
.center-img {
  display: block;
  margin-left: auto;
  margin-right: auto;
  width: 50%;
}
.divback {
  background-image: url("../../../assets/add_photo.png");
  width: 100px;
  height: 100px;
}
</style>