<template>
  <div>
    <v-breadcrumbs
      :items="[
        { text: 'Home', to: '/', exact: true },
        { text: 'People' },
      ]"
    ></v-breadcrumbs>

    <h1>People</h1>

    <div class="mt-2">
      <v-card class="default px-3 py-3">
        <v-card-text>
          <div class="d-flex mb-6">
            <v-text-field
              prepend-inner-icon="mdi-magnify"
              background-color="white"
              outlined
              dense
              label="Search"
              v-model="search"
              hide-details
              class="mr-5"
              @keyup.enter="searchChange()"
              v-on:input="searchChange()"
            />
            <v-btn color="primary" class="my-0 mr-2" style="height: 40px" @click="addNewPerson">
              Add Person
            </v-btn>
            <v-btn color="info" class="my-0 mr-2" style="height: 40px" @click="downloadPdf" :loading="loadingPdf" title="Print">
              <v-icon>mdi-printer</v-icon>
            </v-btn>
            <JsonCSV :data="peopleData" v-if="!loading">
              <v-btn color="info" class="my-0" style="height: 40px" :disabled="peopleData.length === 0" title="Export CSV">
                <v-icon>mdi-export</v-icon>
              </v-btn>
            </JsonCSV>
            <v-btn color="info" class="my-0" style="height: 40px" disabled v-else title="Export CSV">
              <v-icon>mdi-export</v-icon>
            </v-btn>
          </div>

          <v-data-table
            :items="people"
            :headers="headers"
            :loading="loading"
            :search="search"
            :options.sync="options"
            @click:row="handleClick"
            :footer-props="{ 'items-per-page-options': [10, 30, 50, 100] }"
            class="clickable-row"
          >
            <template v-slot:item.BirthYear="{ item }">
              <span>{{ item.BirthYear ? item.BirthYear : 'n/a' }}</span>
            </template>
            <template v-slot:item.DeathYear="{ item }">
              <span>{{ item.DeathYear ? item.DeathYear : 'n/a' }}</span>
            </template>
          </v-data-table>
        </v-card-text>
      </v-card>
    </div>
  </div>
</template>

<script>
import _ from 'lodash';
import JsonCSV from 'vue-json-csv';
import people from '@/controllers/people';

export default {
  name: 'PeoplePage',
  components: { JsonCSV },
  data: () => ({
    loading: false,
    people: [],
    search: '',
    options: {},
    headers: [
      { text: 'Given Name', value: 'GivenName' },
      { text: 'Surname', value: 'Surname' },
      { text: 'Birth Year', value: 'BirthYear' },
      { text: 'Death Year', value: 'DeathYear' },
    ],
    peopleData: [],
    loadingPdf: false,
  }),
  mounted() {
    this.getDataFromApi();
  },
  methods: {
    searchChange: _.debounce(function () {
      this.getDataFromApi();
    }, 400),
    handleClick(value) {
      this.$router.push({
        name: 'personView',
        params: { id: value.PersonID },
      });
    },
    async getDataFromApi() {
      this.loading = true;
      const { sortBy, sortDesc } = this.options;
      this.peopleData = await people.getExport(
        this.search,
        sortBy && sortBy[0] ? sortBy[0] : 'GivenName',
        sortDesc && sortDesc[0] ? 'desc' : 'asc'
      );
      this.people = this.peopleData || [];
      this.loading = false;
    },
    async downloadPdf() {
      this.loadingPdf = true;
      const { sortBy, sortDesc } = this.options;
      const res = await people.getGridPdf(
        this.search,
        sortBy && sortBy[0] ? sortBy[0] : 'GivenName',
        sortDesc && sortDesc[0] ? 'desc' : 'asc'
      );
      const blob = new Blob([res], { type: 'application/octetstream' });
      const url = window.URL || window.webkitURL;
      const link = url.createObjectURL(blob);
      const a = document.createElement('a');
      a.setAttribute('download', 'People.pdf');
      a.setAttribute('href', link);
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      this.loadingPdf = false;
    },
    addNewPerson() {
      this.$router.push({ name: 'personAddView' });
    },
  },
  watch: {
    options: {
      handler() {
        this.getDataFromApi();
      },
      deep: true,
    },
  },
};
</script>
