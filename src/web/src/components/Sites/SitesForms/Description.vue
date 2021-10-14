<template>
  <div>
    <v-card-title style="width: 100%; display: block">
      Description
      <div class="float-right">
        <v-btn class="my-0" color="primary" @click="saveChanges()">Save</v-btn>
      </div>
    </v-card-title>
    <v-divider class="mb-5"></v-divider>
    <v-form v-model="valid">
      <div class="row mx-1">
        <div class="col-md-12">
          <h3>Descriptions</h3>
        </div>

        <div class="col-md-12">
          <v-card
            v-for="(item, i) in descriptions"
            :key="`theme-${i + 1}`"
            class="default mb-5"
          >
            <v-card-title>Description {{ i + 1 }}</v-card-title>
            <v-card-text>
              <v-btn
                icon
                color="primary"
                class="top-right-button"
                @click="removeDescription(i)"
              >
                <v-icon dark>mdi-minus-circle</v-icon>
              </v-btn>
              <v-row>
                <v-col cols="6">
                  <v-select
                    v-model="item.type"
                    :items="typeOptions"
                    label="Decription type"
                    dense
                    outlined
                    background-color="white"
                    hide-details
                  ></v-select>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12">
                  <v-textarea
                    v-model="item.descriptionText"
                    label=""
                    dense
                    outlined
                    background-color="white"
                    hide-details
                  ></v-textarea>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
          <v-btn color="primary" @click="addDescription()">
            Add Description
          </v-btn>
        </div>
      </div>
    </v-form>
  </div>
</template>

<script>
import axios from "axios";
import store from "../../../store";
import { PLACE_URL, STATIC_URL } from "../../../urls";
/* Important**, field data that was not found on the swaggerhub api docs provided was assumed to be in development, hence, some placeholder variables were created. */
export default {
  name: "formDescription",
  data: () => ({
    valid: false,
    generalRules: [
      (v) => !!v || "This input is required",
      (v) => v.length <= 20 || "This input must be less than 20 characters",
    ],

    descriptions: [],
    typeOptions: [],

    /* Placeholder variables below this line **Read above** */
    fields: {
      descriptions: [{ type: "", description: "" }],
    },
  }),
  created: function () {
    let id = this.$route.params.id;

    axios
      .get(`${PLACE_URL}/${id}`)
      .then((resp) => {
        this.fields = resp.data.data;
        this.descriptions = resp.data.relationships.descriptions.data;
          store.dispatch("addSiteHistory", resp.data.data);
      })
      .catch((error) => console.error(error));

    axios.get(`${STATIC_URL}/description-type`).then((resp) => {
      this.typeOptions = resp.data.data;
    });
  },
  methods: {
    addDescription() {
      this.descriptions.push({});
    },
    removeDescription(index) {
      this.descriptions.splice(index, 1);
    },
  },
};
</script>