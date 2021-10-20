import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import axios from "axios";

import vuetify from "./plugins/vuetify";

Vue.config.productionTip = false;

import HistorySidebarComponent from "./components/HistorySidebar";
import Notifications from "./components/Notifications";
import MapDialog from "./components/MapDialog";

Vue.component("history-sidebar", HistorySidebarComponent)
Vue.component("notifier", Notifications);
Vue.component("map-dialog", MapDialog);

axios.defaults.withCredentials = true

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount("#app");
