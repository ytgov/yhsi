<template>
  <v-card
    tag="section"
    outlined
    tile
  >
    <v-card-title
      class="mb-0 text-h4"
      tag="h2"
    >
      Description
    </v-card-title>
    <v-card-text tag="section">
      <v-card class="default">
        <v-card-title
          tag="h3"
          class="mb-0 text-h6"
        >
          Descriptions
        </v-card-title>
        <v-card-text tag="form">
          <v-div
            v-for="(item, i) in descriptions"
            :key="`description-${i + 1}`"
          >
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
                />
              </v-col>
              <v-col cols="6">
                <v-btn
                  color="warning"
                  x-small
                  fab
                  title="Remove"
                  class="my-0 float-right"
                  @click="removeDescription(i)"
                >
                  <v-icon>mdi-close</v-icon>
                </v-btn>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="10">
                <v-textarea
                  v-model="item.descriptionText"
                  label=""
                  dense
                  outlined
                  background-color="white"
                  hide-details
                />
              </v-col>
            </v-row>
            <v-row v-if="i < descriptions.length - 1">
              <v-col cols="12">
                <hr class="mb-3" />
              </v-col>
            </v-row>
          </v-div>
        </v-card-text>
        <v-card-actions>
          <v-btn
            class="my-0"
            color="primary"
            @click="addDescription()"
          >
            Add Description
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-card-text>
    <v-card-actions>
      <v-spacer />
      <v-btn
        class="my-0"
        color="primary"
        @click="saveChanges"
      >
        Save
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import axios from 'axios';
import store from '@/store';
import { PLACE_URL, STATIC_URL } from '@/urls';
/* Important**, field data that was not found on the swaggerhub api docs provided was assumed to be in development, hence, some placeholder variables were created. */
export default {
  name: 'Description',
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
        store.dispatch('addSiteHistory', resp.data.data);
        this.$parent.siteName = this.fields.primaryName;
      })
      .catch((error) => console.error(error));

    axios.get(`${STATIC_URL}/description-type`).then((resp) => {
      this.typeOptions = resp.data.data;
    });
  },
  methods: {
    addDescription() {
      this.descriptions.push({ placeId: this.loadedId, type: 1 });
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
          this.$emit('showAPIMessages', resp.data);
        })
        .catch((err) => {
          this.$emit('showError', err);
        });
    },
  },
};
</script>
