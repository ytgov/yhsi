<template>
  <v-row>
    <v-col cols="12" class="d-flex">
      <div v-for="(item, i) in items" :key="`rl-${i}`">
        <router-link
          :to="item.to"
          :event="item.disabled ? '' : 'click'"
          class="text-capitalize"
        >
          {{ item.text }}
        </router-link>
        <v-icon v-if="i + 1 < items.length">mdi-chevron-right</v-icon>
      </div>
    </v-col>
  </v-row>
</template>

<script>
/* eslint-disable */
export default {
  name: "breadcrumbs",
  data: () => ({
    items: [],
    routes: [],
  }),
  created() {
    this.generateRoutes();
    this.generateRouterLinks();
  },
  methods: {
    generateRouterLinks() {
      this.items = [];
      let items = this.$route.path.split("/");
      //items = items.filter(x => x != "");
      items.shift();
      for (let i = 0; i < items.length; i++) {
        if(items[i] != 'view' && items[i] != 'edit'){
          this.items.push({
            text: items[i].replace(/%20/g, " ").replace(/%23/g, "#"),
            to: { path: "/" + items.slice(0, i + 1).join("/") },
            disabled: !this.checkAvailableRoutes(
              "/" + items.slice(0, i + 1).join("/")
            ),
          });
        }

      }
    },
    generateRoutes() {
      let routes = this.$router.options.routes;
      let totalRoutes = [];
      for (let i = 0; i < routes.length; i++) {
        if (routes[i].children) {
          totalRoutes.push({ path: routes[i].path });
          let children = routes[i].children;
          for (let j = 0; j < children.length; j++) {
            totalRoutes.push({ path: `${routes[i].path}/${children[j].path}` });
          }
        } else {
          totalRoutes.push({ path: routes[i].path });
        }
      }
      this.routes = totalRoutes;
    },
    checkAvailableRoutes(routeToCheck) {
      let routes = this.routes;
      for (let i = 0; i < routes.length; i++) {
        if (routes[i].path == routeToCheck) {
          return true;
        }
      }
      return false;
    },
  },
  watch: {
    $route(to, from) {
      this.generateRouterLinks();
    },
  },
};
</script>