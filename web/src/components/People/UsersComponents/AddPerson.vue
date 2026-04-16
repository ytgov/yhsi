<template>
  <v-sheet>
    <v-breadcrumbs
      :items="[
        { text: 'Home', to: '/', exact: true },
        { text: 'People', to: '/people', exact: true },
        { text: 'New Person' },
      ]"
    ></v-breadcrumbs>

    <div class="d-flex align-center mb-4">
      <h1>New Person</h1>
      <v-spacer></v-spacer>
      <v-btn outlined color="warning" class="mr-2" @click="cancel">Cancel</v-btn>
      <v-btn color="success" @click="save" :loading="saving">
        <v-icon class="mr-1">mdi-check</v-icon>
        Create Person
      </v-btn>
    </div>

    <v-card class="default px-3 py-3">
      <v-card-text>
        <v-row>
          <v-col cols="7">
            <v-row>
              <v-col cols="4">
                <v-text-field outlined dense background-color="white" label="Surname" v-model="fields.Surname"></v-text-field>
                <v-text-field outlined dense background-color="white" label="Given Name" v-model="fields.GivenName"></v-text-field>
              </v-col>
              <v-col cols="4">
                <v-text-field outlined dense background-color="white" label="Birth Year" v-model="fields.BirthYear"></v-text-field>
                <v-text-field outlined dense background-color="white" label="Death Year" v-model="fields.DeathYear"></v-text-field>
              </v-col>
              <v-col cols="4">
                <v-select
                  outlined dense background-color="white"
                  :items="accuracyList"
                  v-model="fields.BirthAccuracy"
                  item-text="name"
                  item-value="val"
                  label="Birth Accuracy"
                ></v-select>
                <v-select
                  outlined dense background-color="white"
                  :items="accuracyList"
                  v-model="fields.DeathAccuracy"
                  item-text="name"
                  item-value="val"
                  label="Death Accuracy"
                ></v-select>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12">
                <v-textarea outlined dense background-color="white" label="Notes" v-model="fields.Notes"></v-textarea>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <v-overlay :value="saving">
      <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay>
  </v-sheet>
</template>

<script>
import people from '../../../controllers/people';

export default {
  name: 'AddPerson',
  data: () => ({
    saving: false,
    fields: {
      Surname: '',
      GivenName: '',
      BirthYear: null,
      BirthAccuracy: '',
      DeathYear: null,
      DeathAccuracy: '',
      Notes: '',
    },
    accuracyList: [
      { name: 'Estimated', val: 'E' },
      { name: 'Approximate', val: 'A' },
    ],
  }),
  methods: {
    cancel() {
      this.$router.push('/people');
    },
    async save() {
      this.saving = true;
      const { Surname, GivenName, BirthYear, BirthAccuracy, DeathAccuracy, DeathYear, Notes } = this.fields;
      const resp = await people.post({
        person: { Surname, GivenName, BirthYear, BirthAccuracy, DeathYear, DeathAccuracy, Notes },
      });
      this.saving = false;

      if (resp && resp.response && resp.response.status === 409) {
        this.$store.commit('alerts/setText', 'A person with that registration already exists.');
        this.$store.commit('alerts/setType', 'warning');
        this.$store.commit('alerts/setTimeout', 5000);
        this.$store.commit('alerts/setAlert', true);
      } else {
        this.$router.push('/people');
      }
    },
  },
};
</script>
