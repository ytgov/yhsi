<template>
  <v-app>
    <v-navigation-drawer
      v-bind:app="hasSidebar"
      permanent
      :expand-on-hover="hasSidebarClosable"
      clipped
      color="#f1f1f1"
      v-bind:class="{ 'd-none': !hasSidebar }"
    >
      <v-list dense nav style="" class="mt-4">
        <v-list-item
          link
          nav
          v-for="section in sections"
          :title="section.name"
          :to="section.makeUrl(currentId)"
          :key="section.name"
        >
          <v-list-item-icon>
            <v-icon>{{ section.icon }}</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>{{ section.name }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar
      app
      color="#fff"
      flat
      height="70"
      style="left: 0; border-bottom: 3px #f3b228 solid"
    >
      <!-- <v-icon color="#f3b228" class="mr-5">{{ applicationIcon }}</v-icon> -->
      <img src="/yukon.svg" style="margin: -8px 155px 0 0" height="44" />
      <v-toolbar-title>
        <span style="font-weight: 700">{{ applicationName }}</span>

        <v-progress-circular
          :class="loadingClass"
          indeterminate
          color="#f3b228"
          size="20"
          width="2"
          class="ml-4"
        ></v-progress-circular>
      </v-toolbar-title>
      <v-spacer></v-spacer>

      <div v-if="isAuthenticated">
        <v-menu offset-y class="ml-0">
          <template v-slot:activator="{ on, attrs }">
            <v-btn text color="primary" v-bind="attrs" v-on="on">
              Navigation <v-icon>mdi-menu-down</v-icon>
            </v-btn>
          </template>

          <v-list dense style="min-width: 200px">
            <v-list-item to="/dashboard">
              <v-list-item-title>Dashboard</v-list-item-title>
            </v-list-item>
            <v-list-item to="/sites">
              <v-list-item-title>Sites</v-list-item-title>
            </v-list-item>
            <v-list-item to="/photos">
              <v-list-item-title>Photos</v-list-item-title>
            </v-list-item>
            <v-list-item to="/maps">
              <v-list-item-title>Maps</v-list-item-title>
            </v-list-item>
            <v-list-item to="/airplane">
              <v-list-item-title>Airplane Crash Sites</v-list-item-title>
            </v-list-item>
            <v-list-item to="/boats">
              <v-list-item-title>Boats & Owners</v-list-item-title>
            </v-list-item>
            <v-list-item to="/burials">
              <v-list-item-title>Burials</v-list-item-title>
            </v-list-item>
            <v-list-item to="/places">
              <v-list-item-title>Places</v-list-item-title>
            </v-list-item>
            <v-list-item to="/people">
              <v-list-item-title>People</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>

        <v-btn
          icon
          color="primary"
          class="mr-2"
          title="Recently visited"
          @click="showHistory()"
        >
          <v-icon>mdi-history</v-icon>
        </v-btn>

        <span>{{ username }}</span>
        <v-menu bottom left class="ml-0">
          <template v-slot:activator="{ on, attrs }">
            <v-btn icon color="primary" v-bind="attrs" v-on="on">
              <v-icon>mdi-dots-vertical</v-icon>
            </v-btn>
          </template>

          <v-list dense style="min-width: 200px">
            <v-list-item to="/profile">
              <v-list-item-icon>
                <v-icon>mdi-account</v-icon>
              </v-list-item-icon>
              <v-list-item-title>My profile</v-list-item-title>
            </v-list-item>
            <v-list-item to="/admin">
              <v-list-item-icon>
                <v-icon>mdi-cogs</v-icon>
              </v-list-item-icon>
              <v-list-item-title>Administration</v-list-item-title>
            </v-list-item>

            <v-divider />
            <v-list-item @click="signOut">
              <v-list-item-icon>
                <v-icon>mdi-exit-run</v-icon>
              </v-list-item-icon>
              <v-list-item-title>Sign out</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </div>
      <div v-else>
        <router-link to="/sign-in">Sign in</router-link>
      </div>

      <!-- <v-app-bar-nav-icon @click.stop="drawerRight = !drawerRight"></v-app-bar-nav-icon> -->
    </v-app-bar>

    <v-main v-bind:style="{ 'padding-left: 33px !important': !hasSidebar }">
      <!-- Provides the application the proper gutter -->
      <v-container fluid :class="`${isSites($route.path, true)}`">
        <v-row>
          <v-col :class="`${isSites($route.path, false)}`">
            <!-- 
              <router-view
                v-on:showError="showError"
                v-on:showSuccess="showSuccess"
                v-on:showAPIMessages="showAPIMessages"
              ></router-view>
              <notifier ref="notifier"></notifier>
            -->
            <router-view></router-view>
            <RequestAlert/>
          </v-col>
        </v-row>
        
      </v-container>
    </v-main>

    <history-sidebar ref="historySidebar"></history-sidebar>
  </v-app>
</template>

<script>
import router from "./router";
import store from "./store";
import * as config from "./config";
import { mapState } from "vuex";
import RequestAlert from "./components/RequestAlert.vue";
import { LOGOUT_URL } from "./urls";

export default {
  name: "App",
  components: { RequestAlert },
  computed: {
    ...mapState(["isAuthenticated", "user", "showAppSidebar"]),
    username() {
      return store.getters.fullName;
    },
    isAuthenticated() {
      //return true; // until we get auth process to show sidebar
      return store.getters.isAuthenticated;
    },
    user() {
      return store.getters.user;
    },
    showAppSidebar() {
      return store.getters.showAppSidebar;
    },
  },
  data: () => ({
    dialog: false,
    drawer: null,
    drawerRight: null,
    headerShow: false,
    menuShow: false,
    loadingClass: "d-none",
    applicationName: config.applicationName,
    applicationIcon: config.applicationIcon,
    sections: config.sections,
    hasSidebar: config.hasSidebar,
    hasSidebarClosable: config.hasSidebarClosable,
    currentId: 0,
  }),
  created: async function () {
    store.dispatch("setAppSidebar", this.$route.path.startsWith("/sites/"));
    this.hasSidebar = this.$route.path.startsWith("/sites/");
    this.currentId = this.$route.params.id;

    //this.hasSidebar = true;
    await store.dispatch("checkAuthentication");
  },
  watch: {

    isAuthenticated: function (val) {
      if (!val) this.hasSidebar = false;
      else this.hasSidebar = store.getters.showAppSidebar;
    },
    showAppSidebar: function (val) {
      if (val) {
        this.currentId = this.$route.params.id;
      }

      this.hasSidebar = val && this.isAuthenticated;
    },
  },
  methods: {
    nav: function (location) {
      router.push(location);
    },
    toggleHeader: function () {
      this.headerShow = !this.headerShow;
    },
    toggleMenu: function () {
      this.menuShow = !this.menuShow;
    },
    signOut: function () {
      window.location = LOGOUT_URL;
    },
    isSites(route, chooser) {
       if(chooser)
         return (route.includes('sites') || route.includes('photos') || route.includes('users') 
               || route.includes('photo-owners') || route.includes('communities')) ? 'siteslp' :  '';
       else
         return (route.includes('sites') || route.includes('photos') || route.includes('users') 
               || route.includes('photo-owners') || route.includes('communities')) ? 'sitesnp' :  '';
      //this function helps to show certain classes depending on the route
      /*
      if (chooser)
        return route.includes("sites/") || route.includes("photos")
          ? "siteslp"
          : "";
      else
        return route.includes("sites/") || route.includes("photos")
          ? "sitesnp"
          : "";
          */
    },
    showHistory() {
      this.$refs.historySidebar.show();
    },
    showError: function (msg) {
      this.$refs.notifier.showError(msg);
    },
    showSuccess: function (msg) {
      this.$refs.notifier.showSuccess(msg);
    },
    showAPIMessages: function (msg) {
      this.$refs.notifier.showAPIMessages(msg);
    },
  },
};
</script>
