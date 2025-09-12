<template>
  <div>
    <v-app-bar color="primary" dark flat>
      <v-btn color="primary" @click="goBack()">
        <v-icon>mdi-arrow-left-drop-circle</v-icon>
        <div class="ml-2">Back to Photo Owners</div>
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
                {{ title }} Photo Owner
                <span v-if="title == 'Edit'">{{ username }}</span>
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

            <v-text-field
              v-model="fields.email"
              label="Email"
              required
            ></v-text-field>

            <v-text-field
              v-model="fields.telephone"
              label="Telephone"
            ></v-text-field>

            <v-btn color="success">Save Changes</v-btn>
          </v-col>
          <v-col cols="6">
            <v-text-field
              v-model="fields.contactPerson"
              label="Contact Name"
            ></v-text-field>

            <v-textarea v-model="fields.address" label="Address"></v-textarea>
          </v-col>
        </v-row>
      </v-container>
    </div>
  </div>
</template>

<script>
export default {
  name: "ownersform",
  components: {},
  data: () => ({
    username: "username",
    title: "",
    items: null,
    selectedItem: null,
    dialog: false, //tells the print dialog when to show itself
    fields: {
      name: "",
      email: "",
      contactPerson: "",
      address: "",
      telephone: null,
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
      this.$router.push("/photo-owners");
    },
  },
};
</script>


<style scoped>
.list-menu {
  padding: 0px 8px 0px 0px;
}
</style>