<template>
  <v-snackbar
    v-model="alert"
    :multi-line="true"
    :timeout="timeout == 0 ? -1 : timeout"
    :color="type"
    outline
    text
  >
    <v-icon v-if="type == 'success'" color="success" class="mr-2"
      >mdi-checkbox-marked-circle</v-icon
    >
    <v-icon v-else color="warning" class="mr-2">mdi-alert-circle</v-icon>
    {{ text }}

    <template v-slot:action="{ attrs }">
      <v-btn
        :color="type == 'success' ? 'success' : 'warning'"
        text
        v-bind="attrs"
        @click="closeAlert()"
      >
        Close
      </v-btn>
    </template>
  </v-snackbar>
</template>



<script>
export default {
  created() {},
  methods: {
    closeAlert() {
      this.$store.commit("alerts/setAlert", false);
    },
  },
  computed: {
    alert: {
      get() {
        return this.$store.getters["alerts/alert"];
      },
      set(val) {
        this.$store.commit("alerts/setAlert", val);
      },
    },
    text: {
      get() {
        return this.$store.getters["alerts/text"];
      },
      set(val) {
        this.$store.commit("alerts/setText", val);
      },
    },
    type: {
      get() {
        return this.$store.getters["alerts/type"];
      },
      set(val) {
        this.$store.commit("alerts/setType", val);
      },
    },
    timeout: {
      get() {
        return this.$store.getters["alerts/timeout"];
      },
      set(val) {
        this.$store.commit("alerts/setTimeout", val);
      },
    },
  },
  watch: {
    alert(old, newv) {
      if (newv == true) {
        this.$store.commit("alerts/setAlert", false);
      }
    },
  },
};
</script>