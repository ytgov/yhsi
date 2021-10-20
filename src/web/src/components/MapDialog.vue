<template>
  <v-dialog v-model="visible" persistent max-width="700px">
    <v-card>
      <v-card-title>Location Map</v-card-title>
      <v-card-text>
        <div class="map" id="map" ref="map"></div>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="secondary" @click="close()">Close</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { loadModules } from "esri-loader";

export default {
  name: "Home",
  data: () => ({
    visible: null,
    color: "",
    text: "",
    icon: "",
    map: {},
  }),
  methods: {
    show(lat, long) {
      this.visible = true;

      loadModules(
        [
          "esri/Map",
          "esri/views/MapView",
          "esri/symbols/SimpleMarkerSymbol",
          "esri/geometry/Point",
          "esri/Graphic",
        ],
        {
          css: true,
        }
      ).then(([Map, MapView, SimpleMarkerSymbol, Point, Graphic]) => {
        this.map = new Map({
          basemap: "topo-vector",
        });

        let sms = new SimpleMarkerSymbol({ style: "circle", color: "red" });
        var point = new Point(long, lat);

        var attributes = { value: "Hello" };

        let view = new MapView({
          container: this.$refs.map,
          map: this.map,
          center: [long, lat],
          zoom: 11,
        });

        view.graphics.add(new Graphic(point, sms, attributes));
      });
    },
    close() {
      this.visible = false;
    },
  },
};
</script>

<style scoped>
.map {
  height: 400px;
  border: 1px #ddd solid;
}
</style>
