<template>
  <div>
    <v-breadcrumbs :items="[
      { text: 'Administration', to: '/admin', exact: true },
      { text: 'Place Type' },
    ]"></v-breadcrumbs>

    <h1>Place Type</h1>

    <div class="mt-2">
      <v-card class="default px-3 py-3">
        <v-card-text>
          <div class="d-flex mb-6">
            <v-text-field prepend-inner-icon="mdi-magnify" background-color="white" outlined dense label="Search"
              v-model="search" hide-details class="mr-5" />
            <AddDialog @saved="load" />
          </div>

          <v-data-table :items="filteredItems" :headers="headers" :loading="loading" :search="search"
            @click:row="handleClick" :footer-props="{ 'items-per-page-options': [10, 30, 100] }"
            class="clickable-row mt-2"></v-data-table>
        </v-card-text>
      </v-card>
    </div>

    <EditDialog :dialog="editDialog" :item="selectedItem" @close="editDialog = false" @saved="load" />
  </div>
</template>

<script>
import catalogs from '../../../../controllers/catalogs';
import EditDialog from './EditDialog';
import AddDialog from './AddDialog';

export default {
  name: 'PlaceTypeGrid',
  components: { EditDialog, AddDialog },
  data: () => ({
    loading: false,
    items: [],
    search: '',
    headers: [
      { text: 'Place Type', value: 'PlaceType' },
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
      return this.items.filter((x) => x.PlaceType.toLowerCase().includes(q));
    },
  },
  methods: {
    async load() {
      this.loading = true;
      try {
        const data = await catalogs.getPlaceTypes();
        this.items = data.body || [];
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
