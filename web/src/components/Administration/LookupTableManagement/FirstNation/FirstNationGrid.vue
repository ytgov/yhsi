<template>
  <div>
    <v-container fluid>
      <h1>First Nations</h1>
      <Breadcrumbs />
      <v-row class="mb-2">
        <v-col cols="6" class="d-flex">
          <v-text-field
            flat
            prepend-icon="mdi-magnify"
            class="mx-4"
            hide-details
            label="Search"
            v-model="search"
          ></v-text-field>
        </v-col>
        <v-spacer></v-spacer>
        <v-col cols="auto">
          <AddDialog @saved="load" />
        </v-col>
      </v-row>
      <div class="mt-2">
        <v-card class="px-3 py-3">
          <v-row>
            <v-col cols="12">
              <h2>{{ filteredItems.length }} Results</h2>
            </v-col>
          </v-row>
          <v-divider inset class="mb-4"></v-divider>
          <v-row>
            <v-col>
              <v-data-table
                :items="filteredItems"
                :headers="headers"
                :loading="loading"
                @click:row="handleClick"
              ></v-data-table>
            </v-col>
          </v-row>
        </v-card>
      </div>

      <EditDialog
        :dialog="editDialog"
        :item="selectedItem"
        @close="editDialog = false"
        @saved="load"
      />
    </v-container>
  </div>
</template>

<script>
import api from '@/apis/first-nations-api';
import Breadcrumbs from '../../../Breadcrumbs';
import EditDialog from './EditDialog';
import AddDialog from './AddDialog';

export default {
  name: 'FirstNationGrid',
  components: { Breadcrumbs, EditDialog, AddDialog },
  data: () => ({
    loading: false,
    items: [],
    search: '',
    headers: [
      { text: 'Name', value: 'description' },
    ],
    editDialog: false,
    selectedItem: null,
  }),
  mounted() {
    this.load();
  },
  computed: {
    filteredItems() {
      if (!this.search) return this.items;
      const q = this.search.toLowerCase();
      return this.items.filter((x) => x.description.toLowerCase().includes(q));
    },
  },
  methods: {
    async load() {
      this.loading = true;
      try {
        const data = await api.getAll();
        this.items = data.data || [];
      } catch (e) {
        console.error(e);
      } finally {
        this.loading = false;
      }
    },
    handleClick(item) {
      this.selectedItem = { ...item };
      this.editDialog = true;
    },
  },
};
</script>
