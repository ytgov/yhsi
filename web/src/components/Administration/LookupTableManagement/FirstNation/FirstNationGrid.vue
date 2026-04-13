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
              >
                <template v-slot:item.actions="{ item }">
                  <v-btn color="error" outlined small @click.stop="confirmDelete(item)">
                    <v-icon small class="mr-1">mdi-delete</v-icon>
                    Remove
                  </v-btn>
                </template>
              </v-data-table>
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

      <v-dialog v-model="deleteDialog" max-width="400px">
        <v-card>
          <v-card-title>Remove First Nation</v-card-title>
          <v-card-text>
            Remove <strong>{{ itemToDelete && itemToDelete.description }}</strong>?
            This cannot be undone and will fail if any site associations reference this record.
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn text @click="deleteDialog = false">Cancel</v-btn>
            <v-btn color="error" :loading="deleting" @click="deleteItem">Remove</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
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
      { text: '', value: 'actions', sortable: false, align: 'end' },
    ],
    editDialog: false,
    selectedItem: null,
    deleteDialog: false,
    itemToDelete: null,
    deleting: false,
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
    confirmDelete(item) {
      this.itemToDelete = item;
      this.deleteDialog = true;
    },
    async deleteItem() {
      this.deleting = true;
      try {
        await api.remove(this.itemToDelete.id);
        this.deleteDialog = false;
        this.itemToDelete = null;
        await this.load();
      } catch (e) {
        console.error(e);
      } finally {
        this.deleting = false;
      }
    },
  },
};
</script>
