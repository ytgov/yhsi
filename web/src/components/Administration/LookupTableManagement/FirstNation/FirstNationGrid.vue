<template>
  <div>
    <v-breadcrumbs
      :items="[
        { text: 'Administration', to: '/admin', exact: true },
        { text: 'First Nations' },
      ]"
    ></v-breadcrumbs>

    <h1>First Nations</h1>

    <div class="mt-2">
      <v-card class="default px-3 py-3">
        <v-card-text>
          <v-row>
            <v-col cols="8">
              <v-text-field
                prepend-inner-icon="mdi-magnify"
                background-color="white"
                outlined
                dense
                label="Search"
                v-model="search"
                hide-details
              ></v-text-field>
            </v-col>
            <v-col cols="4" class="d-flex justify-end">
              <AddDialog @saved="load" />
            </v-col>
          </v-row>

          <v-data-table
            :items="filteredItems"
            :headers="headers"
            :loading="loading"
            :search="search"
            @click:row="handleClick"
            :footer-props="{ 'items-per-page-options': [10, 30, 100] }"
            class="clickable-row mt-2"
          ></v-data-table>
        </v-card-text>
      </v-card>
    </div>

    <EditDialog
      :dialog="editDialog"
      :item="selectedItem"
      @close="editDialog = false"
      @saved="load"
    />
  </div>
</template>

<script>
import api from '@/apis/first-nations-api';
import EditDialog from './EditDialog';
import AddDialog from './AddDialog';

export default {
  name: 'FirstNationGrid',
  components: { EditDialog, AddDialog },
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
