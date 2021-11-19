<template>
  <div>
    <v-app-bar color="primary" dark flat>
      <v-btn color="primary" @click="goBack()">
        <v-icon>mdi-arrow-left-drop-circle</v-icon>
        <div class="ml-2">Back to Communities</div>
      </v-btn>
      <v-spacer></v-spacer>
    </v-app-bar>
    <div>
      <v-container>
        <v-row>
          <v-col cols="12">
            <div class="d-flex mb-2">
              <v-icon>mdi-image-album</v-icon>
              <h2 class="mb-0 ml-3">
                {{ title }} Community
                <span v-if="title == 'Edit'">{{ community }}</span>
              </h2>
            </div>
          </v-col>
        </v-row>
        <v-divider inset class="mb-2"></v-divider>
        <v-row>
          <v-col cols="6">
            <v-text-field
              v-model="fields.name"
              label="Name"
              required
            ></v-text-field>
            <v-btn color="success">Save Changes</v-btn>
          </v-col>
          <v-col cols="6"> </v-col>
        </v-row>
      </v-container>
    </div>
  </div>
</template>

<script>
export default {
  name: "communitiesform",
  components: {},
  data: () => ({
    community: "communityname",
    title: "",
    items: null,
    selectedItem: null,
    dialog: false, //tells the print dialog when to show itself
    fields: {
      name: "",
    },
  }),
  created() {
    if (this.$route.path.includes("edit")) {
      this.title = "Edit";
      //after this a function should be called to fill the fields with the data
    } else {
      //doesnt fill the inputs
      this.title = "Add";
    }
  },
  methods: {
    goBack() {
      this.$router.push("/communities");
    },
  },
};
</script>


<style scoped>
.list-menu {
  padding: 0px 8px 0px 0px;
}
</style>