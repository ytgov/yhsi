<template>
  <div>
    <v-card-title primary-title> Photos </v-card-title>
    <v-divider inset></v-divider>
    <v-form v-model="valid">
      <v-container>
        <v-row>
          <v-col cols="12">
            <v-text-field
              v-model="categoryOfProperty"
              label="Category of Property"
              required
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col
            cols="6"
            v-for="(item, i) in fields.photos"
            :key="`theme-${i + 1}`"
          >
            <v-alert outlined color="primary">
              <div class="sub-title">Photo {{ i + 1 }}</div>
              <v-btn
                icon
                color="primary"
                class="top-right-button"
                @click="removeItem('photos', i)"
              >
                <v-icon dark>mdi-minus-circle</v-icon>
              </v-btn>
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
              <v-row>
                <v-col cols="12">
                  <v-text-field
                    v-model="item.name"
                    label="Feature Name"
                    required
                  ></v-text-field>

                  <v-text-field
                    v-model="item.caption"
                    label="Caption"
                    required
                  ></v-text-field>

                  <v-text-field
                    v-model="item.comments"
                    label="Comments"
                    required
                  ></v-text-field>

                  <v-text-field
                    v-model="item.creditLine"
                    label="CreditLine"
                    required
                  ></v-text-field>

                  <v-text-field
                    v-model="item.location"
                    label="Location"
                    required
                  ></v-text-field>
                  <v-file-input
                    :id="`fi-${i}`"
                    label="Upload image"
                    prepend-icon="mdi-camera"
                    accept="image/*"
                    @change="onFileSelection($event, i)"
                  ></v-file-input>
                </v-col>
              </v-row>
            </v-alert>
          </v-col>
          <v-col cols="12">
            <v-btn outlined color="primary" @click="addItem('photos')">
              Add New
            </v-btn>
          </v-col>
        </v-row>
      </v-container>
    </v-form>
  </div>
</template>

<script>
import axios from "axios";
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
    /* Placeholder variables below this line **Read above** */
    categoryOfProperty: "",
    fields: {
      photos: [
        {
          id: "",
          name: "",
          caption: "",
          comments: "",
          creditLine: "",
          location: "",
          img: null,
        },
        {
          id: "",
          name: "",
          caption: "",
          comments: "",
          creditLine: "",
          location: "",
          img: null,
        },
      ],
    },
  }),
  created: function () {
    let id = this.$route.params.id;

    axios
      .get(`${PLACE_URL}/${id}`)
      .then((resp) => {
        this.fields = resp.data.data;
        console.log("PLACE", this.fields);
      })
      .catch((error) => console.error(error));
  },
  methods: {
    removeItem(objName, position) {
      if (position > -1) {
        this.fields[objName].splice(position, 1);
      }
    },
    addItem(objName) {
      switch (
        objName // Selects which structure to add to the new element of the array
      ) {
        case "photos":
          this.fields[objName].push({
            name: "",
            caption: "",
            comments: "",
            creditLine: "",
            location: "",
          });
          break;
      }
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