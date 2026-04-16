<template>
  <div>
    <div class="d-flex mb-4">
      <v-text-field
        prepend-inner-icon="mdi-magnify"
        background-color="white"
        outlined
        dense
        label="Search"
        v-model="search"
        hide-details
        class="mr-5"
        v-if="mode !== 'new'"
      />
      <v-spacer></v-spacer>
      <v-btn
        color="primary"
        class="my-0"
        style="height: 40px"
        v-if="mode === 'edit'"
        :disabled="addingItem"
        @click="addRecord"
      >
        Add Historic Record
      </v-btn>
    </div>

    <v-data-table
      :headers="headers"
      :items="data"
      :search="search"
      @pagination="updatePagination"
      :options="options"
      :footer-props="{ 'items-per-page-options': [10, 20, 30, 100, 500] }"
      :loading="loadingData"
    >
      <template v-slot:body.prepend="{}" v-if="addingItem">
        <tr>
          <td>
            <v-textarea outlined dense class="mt-3" v-model="historicRecordHelper"></v-textarea>
          </td>
          <td>
            <v-textarea outlined dense class="mt-3" v-model="referenceHelper"></v-textarea>
          </td>
          <td>
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  v-bind="attrs"
                  v-on="on"
                  :disabled="!referenceHelper && !historicRecordHelper"
                  icon
                  color="success"
                  @click="newItem()"
                >
                  <v-icon small>mdi-check</v-icon>
                </v-btn>
              </template>
              <span>Save changes</span>
            </v-tooltip>
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-btn v-bind="attrs" v-on="on" icon @click="cancelItem()">
                  <v-icon small>mdi-close</v-icon>
                </v-btn>
              </template>
              <span>Cancel</span>
            </v-tooltip>
          </td>
        </tr>
      </template>

      <template v-slot:item.HistoryText="{ item, index }">
        <div v-if="editTable === index">
          <v-textarea outlined dense class="mt-3" v-model="historicRecordHelper"></v-textarea>
        </div>
        <div v-else>{{ item.HistoryText }}</div>
      </template>

      <template v-slot:item.Reference="{ item, index }">
        <div v-if="editTable === index">
          <v-textarea outlined dense class="mt-3" v-model="referenceHelper"></v-textarea>
        </div>
        <div v-else>{{ item.Reference }}</div>
      </template>

      <template v-slot:item.actions="{ index, item }">
        <v-tooltip bottom v-if="editTable === index">
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              v-bind="attrs"
              v-on="on"
              :disabled="referenceHelper === '' || historicRecordHelper === ''"
              icon
              color="success"
              @click="saveTable(index)"
            >
              <v-icon small>mdi-check</v-icon>
            </v-btn>
          </template>
          <span>Save changes</span>
        </v-tooltip>
        <v-tooltip bottom v-if="editTable !== index">
          <template v-slot:activator="{ on, attrs }">
            <v-btn v-bind="attrs" v-on="on" icon @click="changeEditTable(index, item)">
              <v-icon small>mdi-pencil</v-icon>
            </v-btn>
          </template>
          <span>Edit</span>
        </v-tooltip>
        <v-tooltip bottom v-if="editTable === index">
          <template v-slot:activator="{ on, attrs }">
            <v-btn v-bind="attrs" v-on="on" icon @click="closeEditTable()">
              <v-icon small>mdi-close</v-icon>
            </v-btn>
          </template>
          <span>Cancel</span>
        </v-tooltip>
      </template>
    </v-data-table>

    <v-overlay :value="overlay">
      <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay>
  </div>
</template>

<script>
import people from '../../../controllers/people';

export default {
  name: 'HistoricRecord',
  props: ['mode', 'personID'],
  data: () => ({
    search: '',
    headers: [
      { text: 'Historic Record', value: 'HistoryText' },
      { text: 'Reference', value: 'Reference' },
      { text: 'Actions', value: 'actions', sortable: false },
    ],
    editTable: -1,
    data: [],
    historicRecordHelper: '',
    referenceHelper: '',
    overlay: false,
    loadingData: false,
    addingItem: false,
    options: { itemsPerPage: 50 },
    pagination: { itemsLength: 0 },
  }),
  mounted() {
    this.getDataFromApi();
  },
  methods: {
    updatePagination(pagination) {
      this.pagination = pagination;
    },
    async getDataFromApi() {
      if (!this.personID || this.personID === 'undefined') return;
      this.loadingData = true;
      this.loadingHistoriesChange(true);
      const res = await people.getHistories(this.personID);
      this.data = (res && res.histories) || [];
      this.loadingData = false;
      this.loadingHistoriesChange(false);
    },
    changeEditTable(index, item) {
      this.editTable = index;
      this.historicRecordHelper = item.HistoryText;
      this.referenceHelper = item.Reference;
    },
    closeEditTable() {
      this.editTable = -1;
    },
    async saveTable(index) {
      this.overlay = true;
      const data = {
        history: {
          HistoryText: this.historicRecordHelper,
          Reference: this.referenceHelper,
          PersonID: this.personID,
          SeqID: this.data[index].SeqID,
        },
      };
      const resp = await people.putHistory(this.data[index].PersonHistID, data);
      if (resp.message === 'success') {
        this.data[index].Reference = this.referenceHelper;
        this.data[index].HistoryText = this.historicRecordHelper;
      }
      this.overlay = false;
      this.editTable = -1;
    },
    addRecord() {
      this.historicRecordHelper = null;
      this.referenceHelper = null;
      this.addingItem = true;
    },
    async newItem() {
      this.overlay = true;
      const data = {
        history: {
          HistoryText: this.historicRecordHelper,
          Reference: this.referenceHelper,
          PersonID: this.personID,
          SeqID: this.data.length + 1,
        },
      };
      const resp = await people.postHistory(this.personID, data);
      if (resp.message === 'success') {
        await this.getDataFromApi();
      }
      this.overlay = false;
      this.historicRecordHelper = null;
      this.referenceHelper = null;
      this.addingItem = false;
    },
    cancelItem() {
      this.addingItem = false;
    },
    loadingHistoriesChange(val) {
      this.$emit('loadingHistoriesChange', val);
    },
  },
  computed: {
    numberOfResults() {
      return this.pagination.itemsLength < this.pagination.itemsPerPage
        ? this.pagination.itemsLength
        : this.pagination.itemsPerPage;
    },
  },
  watch: {
    data(val) {
      if (val !== undefined) {
        this.$emit('historicRecordChange', val);
      }
    },
  },
};
</script>
