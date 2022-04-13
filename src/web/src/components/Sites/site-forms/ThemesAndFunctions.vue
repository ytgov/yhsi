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
        <ThemesEditor
          v-model="themes"
          :place-id="placeId"
        />
      </v-col>

      <v-col cols="12">
        <FunctionalUsesEditor
          v-model="functionalUses"
          :place-id="placeId"
        />
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
import { PLACE_URL } from '@/urls';

import FunctionalUsesEditor from '@/components/Sites/site-forms/themes-and-functions/FunctionalUsesEditor';
import ThemesEditor from '@/components/Sites/site-forms/themes-and-functions/ThemesEditor';

/* Important**, field data that was not found on the swaggerhub api docs provided was assumed to be in development, hence, some placeholder variables were created. */
export default {
  name: 'ThemesAndFunctions',
  components: { FunctionalUsesEditor, ThemesEditor },
  props: {
    placeId: {
      type: [Number, String],
      required: true,
    },
  },
  data: () => ({
    themes: [],
    functionalUses: [],

    fields: {
      /*Field data from the swaggerhub api docs below this line*/
      currentUseComment: '', //
      yHSPastUse: '', //
      yHSThemes: '', //
    },
  }),
  mounted() {
    axios
      .get(`${PLACE_URL}/${this.placeId}`)
      .then((resp) => {
        this.fields = resp.data.data;
        this.themes = resp.data.relationships.themes.data;
        this.functionalUses = resp.data.relationships.functionalUses.data;
        store.dispatch('addSiteHistory', resp.data.data);
      })
      .catch((error) => console.error(error));
  },
  methods: {
    saveChanges() {
      let body = {
        themes: this.themes,
        functionalUses: this.functionalUses,
        currentUseComment: this.fields.currentUseComment,
        yHSPastUse: this.fields.yHSPastUse,
        yHSThemes: this.fields.yHSThemes,
      };

      axios
        .put(`${PLACE_URL}/${this.placeId}/themes`, body)
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
