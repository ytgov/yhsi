<template>
  <div>
    <button @click="layerIndex = 0">map 1</button> <button @click="layerIndex = 1">map 2</button> 
    <l-map
      ref="map"
      :crs="layer.crs"
      :zoom="zoom"
      :center="center"
      style="height: 400px; width: 100%;"
    >
      <l-tile-layer
        :url="layer.url"
        :subdomains="layer.subdomains"
        :attribution="layer.attribution"
      />
    </l-map>
  </div>
</template>

<script>
import {  CRS, latLng } from "leaflet";
import { LMap, LTileLayer } from "vue2-leaflet";
import L from 'leaflet';
export default {
  components: {
    LMap,
    LTileLayer
  },
  data() {
    return {
      zoom: 14,
      center: latLng(47.56, 7.59),
      layerIndex: 0,
      accessToken: "pk.eyJ1IjoiYW5nZWxtYXJ0aW4xMSIsImEiOiJja29wMWIxNm4wMG5lMnhwZDZucWR1cTYzIn0.39ivlO7PopcfJsBdJb4Mbg",
      layers: [
          { 
            url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
            attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          },
          {
            //url: 'http://api.geosition.com/tile/osm-bright-3006/{z}/{x}/{y}.png',
            url: 'https://api.mapbox.com/styles/v1/mapbox/streets-v11/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoiYW5nZWxtYXJ0aW4xMSIsImEiOiJja29wMWIxNm4wMG5lMnhwZDZucWR1cTYzIn0.39ivlO7PopcfJsBdJb4Mbg',
            subdomains: '1,2,3,4',
            attribution: '&copy; <a href="http://yandex.ru/copyright">Yandex</a>',
            crs: new L.Proj.CRS("EPSG:3978",
                "+proj=lcc +lat_1=49 +lat_2=77 +lat_0=49 +lon_0=-95 +x_0=0 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs", 
                {
                    resolutions: [2048, 1024, 512, 256, 128, 64, 32, 16, 8, 4, 2, 1, 0.5],
                    origin: [-938105.72,787721.55]
                })
          }

      ]
    };
  },
  mounted(){
      console.log("DATA");
      console.log(CRS);
      console.log(L.Proj);
      console.log(this.layers[1].crs);
  },
  computed: {
    layer () {
      return this.layers[this.layerIndex]
    }
  }
};
</script>