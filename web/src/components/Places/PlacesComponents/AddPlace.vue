<template>
  <v-sheet>
    <v-breadcrumbs
      :items="[
        { text: 'Home', to: '/', exact: true },
        { text: 'Places', to: '/places', exact: true },
        { text: 'New Place' },
      ]"
    ></v-breadcrumbs>

    <div class="d-flex align-center mb-4">
      <h1>New Place</h1>
      <v-spacer></v-spacer>
      <v-btn outlined color="warning" class="mr-2" @click="cancel">Cancel</v-btn>
      <v-btn color="success" @click="createPlace" :loading="saving">
        <v-icon class="mr-1">mdi-check</v-icon>
        Create Place
      </v-btn>
    </div>

    <v-card class="default px-3 py-3 mb-4">
      <v-card-text>
        <v-row>
          <v-col cols="4">
            <v-text-field
              outlined dense background-color="white"
              label="Place name" v-model="fields.name"
            ></v-text-field>
            <v-select
              outlined dense
              v-model="placeTypes"
              :items="placeTypeOptions"
              item-text="PlaceType"
              item-value="Id"
              multiple
              clearable
              label="Place types"
            ></v-select>
            <v-textarea
              outlined dense background-color="white"
              label="Notes" v-model="fields.notes"
            ></v-textarea>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <v-card class="default px-3 py-3 mb-4">
      <v-card-text>
        <h3 class="mb-3">Alternate Names</h3>
        <div v-for="(item, i) of altNames" :key="i" class="d-flex align-center mb-2">
          <v-text-field
            outlined dense background-color="white" hide-details
            v-model="item.alternateName" label="Alternate name"
          ></v-text-field>
          <v-btn color="warning" x-small fab title="Remove" class="ml-2" @click="altNames.splice(i, 1)">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </div>
        <v-btn class="mt-3" color="primary" @click="altNames.push({ alternateName: '' })">
          Add Alternate Name
        </v-btn>
      </v-card-text>
    </v-card>

    <v-card class="default px-3 py-3 mb-4">
      <v-card-text>
        <h3 class="mb-3">First Nation Names</h3>
        <div v-for="(item, i) of fnNames" :key="i">
          <v-row>
            <v-col cols="5">
              <v-text-field outlined dense background-color="white" hide-details v-model="item.fnName" label="Name"></v-text-field>
            </v-col>
            <v-col cols="5">
              <v-text-field outlined dense background-color="white" hide-details v-model="item.fnLanguage" label="Language"></v-text-field>
            </v-col>
            <v-col cols="2" class="d-flex align-center">
              <v-btn color="warning" x-small fab title="Remove" @click="fnNames.splice(i, 1)">
                <v-icon>mdi-close</v-icon>
              </v-btn>
            </v-col>
          </v-row>
          <v-row class="mb-2">
            <v-col cols="12">
              <v-text-field outlined dense background-color="white" hide-details v-model="item.fnDesription" label="Description"></v-text-field>
            </v-col>
          </v-row>
          <hr v-if="i < fnNames.length - 1" class="mb-3" />
        </div>
        <v-btn class="mt-3" color="primary" @click="fnNames.push({ fnName: '', fnLanguage: '', fnDesription: '' })">
          Add First Nation Name
        </v-btn>
      </v-card-text>
    </v-card>

    <v-card class="default px-3 py-3 mb-4">
      <v-card-text>
        <h3 class="mb-3">First Nation Associations</h3>
        <div v-for="(item, i) of fnAssociations" :key="i" class="mb-2">
          <v-row>
            <v-col cols="5">
              <v-select
                outlined dense background-color="white" hide-details
                v-model="item.fnAssociationType" label="Association"
                :items="fnAssociationTypeOptions" item-text="text" item-value="value"
              ></v-select>
            </v-col>
            <v-col cols="5">
              <v-select
                outlined dense background-color="white" hide-details
                v-model="item.firstNationId" label="First Nation"
                :items="firstNationOptions" item-value="id" item-text="description"
              ></v-select>
            </v-col>
            <v-col cols="2" class="d-flex align-center">
              <v-btn color="warning" x-small fab title="Remove" @click="fnAssociations.splice(i, 1)">
                <v-icon>mdi-close</v-icon>
              </v-btn>
            </v-col>
          </v-row>
        </div>
        <v-btn class="mt-3" color="primary" @click="fnAssociations.push({ fnAssociationType: 1, firstNationId: 1 })">
          Add Association
        </v-btn>
      </v-card-text>
    </v-card>

    <v-overlay :value="saving">
      <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay>
  </v-sheet>
</template>

<script>
import catalogs from '../../../controllers/catalogs';
import { YTPLACE_URL, STATIC_URL } from '../../../urls';
import axios from 'axios';

export default {
  name: 'AddPlace',
  data: () => ({
    saving: false,
    fields: {
      name: '',
      notes: '',
    },
    placeTypes: [],
    placeTypeOptions: [],
    fnNames: [],
    altNames: [],
    fnAssociations: [],
    firstNationOptions: [],
    fnAssociationTypeOptions: [],
  }),
  mounted() {
    this.loadStaticData();
  },
  methods: {
    async loadStaticData() {
      const [fnResp, fnAssocResp, placeTypesData] = await Promise.all([
        axios.get(`${STATIC_URL}/first-nation`),
        axios.get(`${STATIC_URL}/first-nation-association-type`),
        catalogs.getPlaceTypes(),
      ]);
      this.firstNationOptions = fnResp.data.data;
      this.fnAssociationTypeOptions = fnAssocResp.data.data;
      this.placeTypeOptions = placeTypesData.body;
    },
    cancel() {
      this.$router.push('/places');
    },
    async createPlace() {
      this.saving = true;
      const body = {
        place: {
          name: this.fields.name,
          notes: this.fields.notes,
        },
        altNames: this.altNames,
        fnNames: this.fnNames,
        fnAssociations: this.fnAssociations,
        placeTypes: this.placeTypes,
      };
      try {
        const resp = await axios.post(`${YTPLACE_URL}/`, body);
        this.$store.commit('alerts/setText', 'Place created');
        this.$store.commit('alerts/setType', 'success');
        this.$store.commit('alerts/setTimeout', 5000);
        this.$store.commit('alerts/setAlert', true);
        this.$router.push({ name: 'placeView', params: { id: resp.data.data.id } });
      } catch {
        const errText = !this.fields.name ? 'Place name is required' : 'Missing required place data';
        this.$store.commit('alerts/setText', errText);
        this.$store.commit('alerts/setType', 'warning');
        this.$store.commit('alerts/setTimeout', 5000);
        this.$store.commit('alerts/setAlert', true);
      }
      this.saving = false;
    },
  },
};
</script>
