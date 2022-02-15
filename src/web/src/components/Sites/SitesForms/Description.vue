<template>
    <!-- <div>
          <v-card-title primary-title>
            Description
          </v-card-title>
          <v-divider inset></v-divider>
          <v-form v-model="valid">
              <v-container>
                <v-row>
                    <v-col
                        cols="12"
                    >
                        <div class="mb-2">Descriptions</div>
                        <v-alert v-for="(item, i) in fields.descriptions" :key="`theme-${i+1}`"
                          outlined
                          color="primary"
                        >
                            <div class="sub-title">
                                Description {{ i+1 }}
                            </div>
                            <v-btn
                            icon
                            color="primary"
                            class="top-right-button"
                            @click="removeItem('descriptions', i)"
                            >
                            <v-icon dark>mdi-close-circle</v-icon>
                            </v-btn>
                            <v-row>
                                <v-col cols="6">
                                    <v-combobox
                                    v-model="item.type"
                                    label="Decription Type"
                                    ></v-combobox>
                                </v-col>
                            </v-row>
                            <v-row>
                                <v-col cols="12">
                                    <v-textarea
                                    v-model="item.description"
                                    label=""
                                    ></v-textarea>
                                </v-col>
                            </v-row>
                        </v-alert>
                        <v-btn
                        outlined
                        color="primary"
                        @click="addItem('descriptions')"
                        >
                            Add New
                        </v-btn>
                    </v-col>
                </v-row>
                <v-divider class="mt-2 mb-2"></v-divider>
                <v-btn color="success">Save Changes</v-btn>
              </v-container>
            </v-form>
        </div> -->
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
          <v-card
            v-for="(item, i) in descriptions"
            :key="`theme-${i + 1}`"
            class="default mb-5"
          >
            <v-card-text>
              <h3>Description {{ i + 1 }}</h3>
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
    loadedId: -1,
    descriptions: [],
    typeOptions: [],
  }),
  created: function () {
    let id = this.$route.params.id;
    this.loadedId = id;

    axios
      .get(`${PLACE_URL}/${id}`)
      .then((resp) => {
        this.fields = resp.data.data;
        this.descriptions = resp.data.relationships.descriptions.data;
        store.dispatch("addSiteHistory", resp.data.data);
        this.$parent.siteName = this.fields.primaryName;
      })
      .catch((error) => console.error(error));

    axios.get(`${STATIC_URL}/description-type`).then((resp) => {
      this.typeOptions = resp.data.data;
    });
  },
  methods: {
    addDescription() {
      this.descriptions.push({placeId: this.loadedId, type: 1});
    },
    removeDescription(index) {
      this.descriptions.splice(index, 1);
    },
    saveChanges() {
      let body = {
        descriptions: this.descriptions,
      };

      axios
        .put(`${PLACE_URL}/${this.loadedId}/description`, body)
        .then((resp) => {
          this.$emit("showAPIMessages", resp.data);
        })
        .catch((err) => {
          this.$emit("showError", err);
        });
    },
  },
};
</script>