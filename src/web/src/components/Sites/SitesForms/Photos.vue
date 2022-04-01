<template>
  <div>
    <h2 class="mt-4 mb-0 ml-4 d-flex justify-space-between">
      Photos
    </h2>
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
          v-for="(item, index) in photos"
          :key="`theme-${index + 1}`"
        >
          <v-card class="default">
            <v-card-text
              ><v-btn
                color="warning"
                x-small
                fab
                title="Remove"
                class="my-0 float-right"
                @click="removePhoto(index)"
                ><v-icon>mdi-close</v-icon></v-btn
              >
              <h3>Photo {{ index + 1 }}</h3>

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
                :id="`fi-${index}`"
                label="Upload image"
                prepend-icon="mdi-camera"
                accept="image/*"
                dense
                outlined
                background-color="white"
                @change="onFileSelection($event, index)"
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
  name: "Photos",
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
