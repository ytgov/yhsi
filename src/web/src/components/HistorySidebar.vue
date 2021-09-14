<template>
    <v-navigation-drawer
      v-model="drawer"
      absolute
      right
      temporary
      width="400"
      loading
    >
      <v-list-item loading>
        <v-list-item-content>
          <v-list-item-title>Recently Views Sites</v-list-item-title>
        </v-list-item-content>
      </v-list-item>

      <v-divider></v-divider>

      <v-data-table
        hide-default-footer
        :headers="[
          { text: 'YHSI Id', value: 'yHSIId' },
          { text: 'Primary Name', value: 'primaryName' },
        ]"
        :items="history"
        @click:row="openSite"
      ></v-data-table>

    </v-navigation-drawer>
</template>

<script>
import store from "../store";

export default {
  name: "Home",
  data: () => ({
    drawer: null,
    history: []
  }),
  methods: {
    show() {
      this.drawer = true;
      this.history = store.getters.siteHistory
    },
    openSite(item) {
      this.$router.push(`/sites/${item.id}/summary`);
    }
  },
};
</script>