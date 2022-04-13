<template>
  <v-card
    class="mb-0"
    tag="section"
    outlined
    tile
  >
    <v-card-title
      class="mb-0 text-h4"
      tag="h2"
    >
      Themes &amp; Function
    </v-card-title>
    <v-card-text tag="section">
      <v-col cols="12">
        <v-textarea
          v-model="fields.yHSThemes"
          label="YHS Themes"
          dense
          rows="4"
          outlined
          hide-details
          background-color="white"
        />
      </v-col>

      <v-col cols="12">
        <v-card
          class="default mb-0"
          tag="section"
        >
          <v-card-title
            tag="h3"
            class="mb-0 text-h6"
          >
            Themes
          </v-card-title>
          <v-card-text
            v-model="valid"
            tag="form"
          >
            <v-row
              v-for="(item, i) in themes"
              :key="i"
            >
              <v-col cols="10">
                <v-select
                  v-model="item.placeThemeId"
                  :items="themeCategoryOptions"
                  item-text="display"
                  item-value="id"
                  label="Category / Type"
                  dense
                  hide-details
                  outlined
                  background-color="white"
                />
              </v-col>

              <v-col cols="2">
                <v-btn
                  color="warning"
                  x-small
                  fab
                  title="Remove"
                  class="my-0 float-right"
                  @click="removeTheme(i)"
                >
                  <v-icon>mdi-close</v-icon>
                </v-btn>
              </v-col>
            </v-row>
          </v-card-text>
          <v-card-actions>
            <v-btn
              class="my-0"
              color="info"
              @click="addTheme"
            >
              Add Theme
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>

      <v-col cols="12">
        <v-card
          class="default mb-0"
          tag="section"
        >
          <v-card-title
            tag="h3"
            class="mb-0 text-h6"
          >
            Functional Uses
          </v-card-title>
          <v-card-text tag="form">
            <v-row
              v-for="(item, i) in functionalUses"
              :key="i"
            >
              <v-col cols="10">
                <v-row>
                  <v-col cols="4">
                    <v-select
                      v-model="item.functionalUseType"
                      label="Use type"
                      :items="useTypeOptions"
                      item-text="text"
                      item-value="value"
                      dense
                      outlined
                      hide-details
                      background-color="white"
                    />
                  </v-col>
                  <v-col cols="8">
                    <v-autocomplete
                      v-model="item.functionalTypeId"
                      :items="functionalCategoryOptions"
                      item-text="description"
                      item-value="id"
                      label="Functional Category / Type"
                      dense
                      outlined
                      hide-details
                      background-color="white"
                    />
                  </v-col>
                </v-row>
              </v-col>

              <v-col cols="2">
                <v-btn
                  color="warning"
                  x-small
                  fab
                  title="Remove"
                  class="my-0 float-right"
                  @click="removeUse(i)"
                >
                  <v-icon>mdi-close</v-icon>
                </v-btn>
              </v-col>
            </v-row>
          </v-card-text>
          <v-card-actions>
            <v-btn
              class="my-0"
              color="info"
              @click="addUse"
            >
              Add Functional Use
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
      <v-col cols="6">
        <v-textarea
          v-model="fields.currentUseComment"
          label="YHS Current Use"
          dense
          outlined
          background-color="white"
          hide-details
        />
      </v-col>
      <v-col cols="6">
        <v-textarea
          v-model="fields.yHSPastUse"
          label="YHS Past Use"
          dense
          outlined
          hide-details
          background-color="white"
        />
      </v-col>
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
  name: 'ThemesAndFunctions',
  data: () => ({
    valid: false,
    loadedId: -1,
    generalRules: [
      (v) => !!v || 'This input is required',
      (v) => v.length <= 20 || 'This input must be less than 20 characters',
    ],

    themes: [],
    themeCategoryOptions: [],
    functionalUses: [],

    useTypeOptions: [],
    functionalCategoryOptions: [],

    fields: {
      /*Field data from the swaggerhub api docs below this line*/
      currentUseComment: '', //
      yHSPastUse: '', //
      yHSThemes: '', //
    },
  }),
  created: function () {
    let id = (this.loadedId = this.$route.params.id);
    this.loadedId = id;

    axios
      .get(`${PLACE_URL}/${id}`)
      .then((resp) => {
        this.fields = resp.data.data;
        this.themes = resp.data.relationships.themes.data;
        this.functionalUses = resp.data.relationships.functionalUses.data;
        store.dispatch('addSiteHistory', resp.data.data);
      })
      .catch((error) => console.error(error));

    axios.get(`${STATIC_URL}/place-theme`).then((resp) => {
      this.themeCategoryOptions = resp.data.data;
    });

    axios.get(`${STATIC_URL}/functional-use-type`).then((resp) => {
      this.useTypeOptions = resp.data.data;
    });

    axios.get(`${STATIC_URL}/functional-type`).then((resp) => {
      this.functionalCategoryOptions = resp.data.data;
    });
  },
  methods: {
    addTheme() {
      this.themes.push({ placeId: this.loadedId, placeThemeId: 1 });
    },
    removeTheme(index) {
      this.themes.splice(index, 1);
    },
    addUse() {
      this.functionalUses.push({
        placeId: this.loadedId,
        functionalUseType: 2,
        functionalTypeId: 1,
      });
    },
    removeUse(index) {
      this.functionalUses.splice(index, 1);
    },
    saveChanges() {
      let body = {
        themes: this.themes,
        functionalUses: this.functionalUses,
        currentUseComment: this.fields.currentUseComment,
        yHSPastUse: this.fields.yHSPastUse,
        yHSThemes: this.fields.yHSThemes,
      };

      axios
        .put(`${PLACE_URL}/${this.loadedId}/themes`, body)
        .then((resp) => {
          //this.setPlace(resp.data);
          this.$emit('showAPIMessages', resp.data);
        })
        .catch((err) => {
          this.$emit('showError', err);
        });
    },
  },
};
</script>
