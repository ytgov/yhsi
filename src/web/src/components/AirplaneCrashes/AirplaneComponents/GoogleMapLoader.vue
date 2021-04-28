<template>
    <div id="map" style="height: 400px;" ref="googleMap"></div>
</template>

<script>
import { Loader } from '@googlemaps/js-api-loader';
export default {
    data: () =>({
        loader: null,
        apiKey:  "AIzaSyB-Wc3ljVbi-897ttA4gUi216Da6um59fk",
        mapConfig: {},
        map: null
    }),
    async mounted() {
        this.loader = new Loader({
            apiKey: this.apiKey,
            version: "weekly",
            libraries: ["places"]
            });
        this.loader.load().then(() => {
            this.map = new window.google.maps.Map(this.$refs.googleMap, {
                center: { lat: -34.397, lng: 150.644 },
                zoom: 8,
            });
        });

    }, 
    methods:{

    }
}
</script>