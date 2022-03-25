<template>
<<<<<<< HEAD
  <v-container>
    <h1>Administration</h1>
    <Breadcrumbs />
=======
  <div>
    <v-breadcrumbs
      :items="[{ text: 'Adminstration', to: '/admin', exact: true }]"
    ></v-breadcrumbs>
    <h1>Administration</h1>
>>>>>>> 0cdf0c39d93068ce691cb9c87d8d8dd0e9875eaf
    <v-row>
      <v-col cols="6">
        <v-card elevation="1">
          <v-toolbar color="grey" dark flat>
            <v-toolbar-title>Administration</v-toolbar-title>

            <v-spacer></v-spacer>
          </v-toolbar>
          <v-list class="pb-0 pt-0">
            <v-list-item-group v-model="usermodel">
              <v-list-item @click="goTo('/admin/users')">
                <v-list-item-icon>
                  <v-icon v-text="'mdi-account-group'"></v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title>User Management</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list-item-group>
          </v-list>
        </v-card>
      </v-col>
      <v-col cols="6">
        <v-card elevation="1">
          <v-toolbar color="grey" dark flat>
            <v-toolbar-title>Look-up Table Managment</v-toolbar-title>

            <v-spacer></v-spacer>
          </v-toolbar>
          <v-list class="pb-0 pt-0">
            <v-list-item-group v-model="tablemodel">
              <v-list-item
                v-for="(item, i) in items"
                :key="i"
                @click="goTo(item.url)"
              >
                <v-list-item-icon>
                  <v-icon v-text="item.icon"></v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title v-text="item.text"></v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list-item-group>
          </v-list>
        </v-card>
      </v-col>
    </v-row>
<<<<<<< HEAD
  </v-container>
</template>

<script>
import Breadcrumbs from "../Breadcrumbs";
export default {
  components: {
    Breadcrumbs,
  },
=======
  </div>
</template>

<script>
export default {
>>>>>>> 0cdf0c39d93068ce691cb9c87d8d8dd0e9875eaf
  data: () => ({
    icon: null,
    usermodel: null,
    tablemodel: null,
    items: [
      {
        icon: "mdi-ferry",
        text: "Boats - Vessel Type",
        url: "/admin/vessel_type",
      },
      {
        icon: "mdi-wrench",
        text: "Burials - Occupations",
<<<<<<< HEAD
        url: "/admin/occupation",
=======
        url: "/admin/burials/occupations",
>>>>>>> 0cdf0c39d93068ce691cb9c87d8d8dd0e9875eaf
      },
      {
        icon: "mdi-wallet-membership",
        text: "Burials - Memberships",
<<<<<<< HEAD
        url: "/admin/membership",
=======
        url: "/admin/burials/memberships",
>>>>>>> 0cdf0c39d93068ce691cb9c87d8d8dd0e9875eaf
      },
      {
        icon: "mdi-database",
        text: "Burials - Cementeries",
<<<<<<< HEAD
        url: "/admin/cemetary",
      },
      {
        icon: "mdi-account-switch",
        text: "Burials - Relationships",
        url: "/admin/relationship",
=======
        url: "/admin/burials/cementeries",
>>>>>>> 0cdf0c39d93068ce691cb9c87d8d8dd0e9875eaf
      },
      {
        icon: "mdi-shape",
        text: "Burials - Religions",
<<<<<<< HEAD
        url: "/admin/religion",
=======
        url: "/admin/burials/religions",
>>>>>>> 0cdf0c39d93068ce691cb9c87d8d8dd0e9875eaf
      },
      {
        icon: "mdi-bug",
        text: "Burials - Causes",
<<<<<<< HEAD
        url: "/admin/cause",
      },
      {
        icon: 'mdi-map-marker-multiple-outline',
        text: 'Community',
        url: "/admin/community"
      },
      {
        icon: "mdi-run",
        text: "Contributing Resources",
        url: "",
      },
      {
          icon: 'mdi-camera-outline',
          text: 'Photo Owner',
          url: "/admin/photo-owner"
      },
      {
        icon: 'mdi-image-album',
        text: 'Photo Project',
        url: "/admin/photo-project"
      },
      {
        icon: 'mdi-image',
        text: 'Photo Subject',
        url: "/admin/photo-subject"
      },
      {
        icon: "mdi-home",
=======
        url: "/admin/burials/causes",
      },
      {
        icon: "mdi-camera",
        text: "Photos - Owner",
        url: "",
      },
      {
        icon: "mdi-map-marker-multiple",
        text: "Community",
        url: "",
      },
      {
        icon: "mdi-run",
        text: "Contributing Resources",
        url: "",
      },
      {
        icon: "mdi-map",
>>>>>>> 0cdf0c39d93068ce691cb9c87d8d8dd0e9875eaf
        text: "Place Type",
        url: "/admin/placetype",
      },
    ],
    model: 1,
  }),
<<<<<<< HEAD
  methods:{
      goTo(url){
          if(url == "")
              return;
          this.$router.push(url);
      }
  }
};

=======
  methods: {
    goTo(url) {
      if (url == "") return;
      this.$router.push(url);
    },
  },
};
>>>>>>> 0cdf0c39d93068ce691cb9c87d8d8dd0e9875eaf
</script>