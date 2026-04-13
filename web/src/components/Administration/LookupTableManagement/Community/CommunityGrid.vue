<template>
  <div>
    <v-breadcrumbs
      :items="[
        { text: 'Administration', to: '/admin', exact: true },
        { text: 'Community' },
      ]"
    ></v-breadcrumbs>

    <h1>Community</h1>

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
            />
            <AddDialog @saved="load" />
          </div>

          <v-data-table
            :items="communities"
            :headers="headers"
            :loading="loading"
            :search="search"
            @click:row="handleClick"
            :footer-props="{ 'items-per-page-options': [10, 30, 100] }"
            class="clickable-row"
          ></v-data-table>
        </v-card-text>
      </v-card>
    </div>

    <EditDialog
      :dialog="editDialog"
      :data="displayCommunity"
      @closeEditDialog="editDialog = false"
      @saved="load"
    />
  </div>
</template>

<script>
import catalogs from '../../../../controllers/catalogs';
import EditDialog from './EditDialog';
import AddDialog from './AddDialog';

export default {
  name: 'communitygrid',
  components: { EditDialog, AddDialog },
  data: () => ({
    loading: false,
    communities: [],
    search: '',
    headers: [
      { text: 'Name', value: 'Name' },
      { text: 'Name (French)', value: 'FR_Name' },
    ],
    displayCommunity: {},
    editDialog: false,
  }),
  mounted() {
    this.load();
  },
  methods: {
    async load() {
      this.loading = true;
      try {
        const data = await catalogs.getCommunities(0, 1000, '', 'Name', 'asc');
        this.communities = data.body || [];
      } catch (e) {
        console.error(e);
      } finally {
        this.loading = false;
      }
    },
    handleClick(value) {
      this.displayCommunity = value;
      this.editDialog = true;
    },
  },
};
</script>
