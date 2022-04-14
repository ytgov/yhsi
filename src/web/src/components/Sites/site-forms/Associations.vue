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
      Associations
    </v-card-title>
    <v-card-text>
      <v-card
        class="default mb-5"
        tag="section"
      >
        <v-card-title
          tag="h3"
          class="mb-0 text-h6"
        >
          Associations
        </v-card-title>
        <v-card-text tag="form">
          <v-row
            v-for="(association, i) in associations"
            :key="i"
          >
            <v-col cols="5">
              <v-select
                v-model="association.type"
                label="Association type"
                :items="associationTypeOptions"
                dense
                outlined
                hide-details
                background-color="white"
              />
            </v-col>

            <v-col cols="5">
              <v-text-field
                v-model="association.description"
                label="Association name"
                dense
                outlined
                hide-details
                background-color="white"
                required
              />
            </v-col>

            <v-col cols="2">
              <v-btn
                color="warning"
                x-small
                fab
                title="Remove"
                class="my-0 float-right"
                @click="removeAssociation(i)"
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
            @click="addAssociation"
          >
            Add Association
          </v-btn>
        </v-card-actions>
      </v-card>
      <v-card
        class="default mb-0"
        tag="section"
      >
        <v-card-title
          tag="h3"
          class="mb-0 text-h6"
        >
          First Nation Associations
        </v-card-title>
        <v-card-text tag="form">
          <v-row
            v-for="(firstNationAssociation, i) in firstNationAssociations"
            :key="i"
          >
            <v-col cols="5">
              <v-select
                v-model="firstNationAssociation.firstNationAssociationType"
                label="Association"
                :items="firstNationAssociationTypeOptions"
                dense
                outlined
                hide-details
                background-color="white"
              />
            </v-col>
            <v-col cols="5">
              <v-select
                v-model="firstNationAssociation.firstNationId"
                label="First Nation"
                :items="firstNationOptions"
                dense
                outlined
                hide-details
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
                @click="removeFNAssociation(i)"
              >
                <v-icon>mdi-close</v-icon>
              </v-btn>
            </v-col>
            <v-col cols="10">
              <v-text-field
                v-model="firstNationAssociation.comments"
                label="Comments"
                dense
                outlined
                hide-details
                background-color="white"
              />
            </v-col>

            <v-col
              v-if="i < firstNationAssociations.length - 1"
              cols="12"
            >
              <v-divider class="black" />
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-btn
            class="my-0"
            color="info"
            @click="addFNAssociation"
          >
            Add Association
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

import { PLACE_URL, STATIC_URL } from '../../../urls';
/* Important**, field data that was not found on the swaggerhub api docs provided was assumed to be in development, hence, some placeholder variables were created. */
export default {
  name: 'Associations',
  props: {
    placeId: {
      type: [Number, String],
      required: true,
    },
  },
  data: () => ({
    associations: [],
    firstNationAssociations: [],

    associationTypeOptions: [],
    firstNationAssociationTypeOptions: [],
    firstNationOptions: [],
  }),

  mounted() {
    axios
      .get(`${PLACE_URL}/${this.placeId}`)
      .then((resp) => {
        this.associations = resp.data.relationships.associations.data;
        this.firstNationAssociations =
          resp.data.relationships.firstNationAssociations.data;
      })
      .catch((error) => console.error(error));

    axios.get(`${STATIC_URL}/association-type`).then((resp) => {
      this.associationTypeOptions = resp.data.data;
    });
    axios.get(`${STATIC_URL}/first-nation-association-type`).then((resp) => {
      this.firstNationAssociationTypeOptions = resp.data.data;
    });
    axios.get(`${STATIC_URL}/first-nation`).then((resp) => {
      this.firstNationOptions = resp.data.data;
    });
  },
  methods: {
    addAssociation() {
      this.associations.push({ placeId: this.placeId, type: 1 });
    },
    removeAssociation(index) {
      this.associations.splice(index, 1);
    },
    addFNAssociation() {
      this.firstNationAssociations.push({
        placeId: this.placeId,
        firstNationAssociationType: 1,
        firstNationId: 1,
      });
    },
    removeFNAssociation(index) {
      this.firstNationAssociations.splice(index, 1);
    },
    saveChanges() {
      let body = {
        associations: this.associations,
        firstNationAssociations: this.firstNationAssociations,
      };

      axios
        .put(`${PLACE_URL}/${this.placeId}/associations`, body)
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
