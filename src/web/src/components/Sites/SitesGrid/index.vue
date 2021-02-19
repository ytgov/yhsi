<template>
  <div class="">
        <v-app-bar
          color="primary"
          dark
          flat    
        >
          <v-btn color="primary" @click="goToSummary()">
            <v-icon>mdi-account-group</v-icon>
            <div class="ml-2">
              <v-toolbar-title> Users </v-toolbar-title>
            </div>
          </v-btn>
          <v-spacer></v-spacer>
          <div>
            <v-text-field
            dense
            filled
            solo-inverted
            flat
            append-icon="mdi-magnify"
            class="mx-4"
            hide-details
            label="Search"
            v-model="search"
          ></v-text-field>
          </div>
        </v-app-bar>
    <v-container>
      <v-row>
        <v-col cols="12">
          <h2>{{items.length}} Results</h2><!-- value doesnt get modified by the search filter, this is due to the automated search that the vuetify datatable provides -->
        </v-col>
      </v-row>
      <v-divider inset class="mb-2"></v-divider>
      <v-row>
        <v-col>
          <v-data-table
            :items="items"
            :headers="headers"
            :options.sync="options"
            :loading="loading"  
            :search="search"
            @click:row="handleClick"
          ></v-data-table>
        </v-col>
      </v-row>

    </v-container>

   
  </div>
</template>

<script>

export default {
  name: "Grid",
  data: () => ({
    loading: false,
    items: [],
    search: "",
    options: {},
    totalLength: 0,
    headers: [
      // { text: "id", value: "id" },
      { text: "Name", value: "name" },
      { text: "Community", value: "community" },
      { text: "Category", value: "category" },
      { text: "YHSI id", value: "yhsiid" },
      { text: "Status", value: "status" },
    ],
    page: 1,
    pageCount: 0,
    iteamsPerPage: 10,
  }),
  mounted() {
    this.getDataFromApi();
  },
  methods: {
    handleClick(value){   //Redirects the user to the site form
        this.$router.push(`/sites/${value.id}/summary`);
    },
    getDataFromApi() {
      this.loading = true;
/*
      axios
        .post(
          "http://localhost:3000/api/data?search=" + this.search,
          this.options
        )
        .then((resp) => {
          console.log(resp.data);
          this.items = resp.data.data;
          //this.pagination.totalLength = resp.data.meta.count;
          this.totalLength = resp.data.meta.count;

          console.log(this.totalLength);

          this.loading = false;
        })
        .catch((err) => console.error(err))
        .finally(() => {
          this.loading = false;
        });*/
      this.items = [
          {id: 1, name: 'SITE 1', community: 'None', category: 'Industrial', yhsiid: '115O/15/004', status: ''},
          {id: 2, name: 'SITE 2', community: 'None', category: 'Architecture', yhsiid: '115O/15/005', status: ''},
          {id: 3, name: 'SITE 3', community: 'None', category: 'Industrial', yhsiid: '115O/15/006', status: ''},
          {id: 4, name: 'SITE 4', community: 'None', category: 'Architecture', yhsiid: '105D/01/001', status: ''},
      ]
      this.totalLength = this.items.length;
      this.loading = false;
    },
  },
};
</script>
