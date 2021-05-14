<template>
    <v-row v-if="modifiableFields">
        <v-col cols="5">
            <v-alert
            outlined
            color="primary"
            >
                <div class="sub-title">
                    Location
                </div>
                <v-row>
                    <v-col>
                        <v-select
                            :items="coordinateSystemOptions"
                            return-object
                            item-text="text"
                            label="Coordinate System"
                            @change="changedSystem"
                            v-model="selectedSystem"
                            :readonly="mode == 'view'"
                        ></v-select>
                    </v-col>
                    <v-col>
                        <v-select
                            :items="projectionOptions"
                            label="Projection"
                            :readonly="mode == 'view'"
                        ></v-select>
                    </v-col>
                </v-row>
<!-- SELECTED SYSTEM  == DD -->
                <v-row v-if="selectedSystem.id == 1">
                    <v-col cols="2.4">
                        <h4>Latitude</h4>
                    </v-col>
                    <v-col cols="9">
                        <h4>Degrees</h4>
                        <v-text-field
                            @keypress="isNumber"
                            @change="changedLocation"
                            v-model="dd.lat"
                            :readonly="mode == 'view'"
                        ></v-text-field>
                    </v-col>
                </v-row>
                <v-row v-if="selectedSystem.id == 1">
                    <v-col cols="2.4">
                        <h4>Longitude</h4>
                    </v-col>
                    <v-col cols="9">
                        <v-text-field
                            @change="changedLocation"
                            v-model="dd.lng"
                            :readonly="mode == 'view'"
                        ></v-text-field>
                    </v-col>
                </v-row>
<!-- SELECTED SYSTEM  == UMT -->
                <v-row v-if="selectedSystem.id == 2">
                    <v-col cols="2.4"><!-- Decides how many 'cols' its going to have -->
                        <h4>Latitude</h4>
                    </v-col>
                    <v-col cols="9">
                        <h4>Degrees</h4>
                        <v-text-field
                            @change="changedLocation"
                            v-model="dd.lat"
                            :readonly="mode == 'view'"
                        ></v-text-field>
                    </v-col>
                </v-row>
                <v-row v-if="selectedSystem.id == 2">
                    <v-col cols="2.4">
                        <h4>Longitude</h4>
                    </v-col>
                    <v-col cols="9">
                        <v-text-field
                            @change="changedLocation"
                            v-model="dd.lng"
                            :readonly="mode == 'view'"
                        ></v-text-field>
                    </v-col>
                </v-row>
<!-- SELECTED SYSTEM  == DMS -->
                <v-row v-if="selectedSystem.id == 3">
                    <v-col cols="2.4"><!-- Decides how many 'cols' its going to have -->
                        <h4>Latitude</h4>
                    </v-col>
                    <v-col >
                        <h4>Degrees</h4>
                        <v-text-field
                            @change="changedLocation"
                            v-model="dms.lat.deg"
                            :readonly="mode == 'view'"
                        ></v-text-field>
                    </v-col>
                    <v-col >
                        <h4>Minutes</h4>
                        <v-text-field
                            @change="changedLocation"
                            v-model="dms.lat.min"
                            :readonly="mode == 'view'"
                        ></v-text-field>
                    </v-col>
                    <v-col >
                        <h4>Seconds</h4>
                        <v-text-field
                            @change="changedLocation"
                            v-model="dms.lat.sec"
                            :readonly="mode == 'view'"
                        ></v-text-field>
                    </v-col>
                    <v-col>
                        <h4>Direction</h4>
                        <v-text-field
                            @change="changedLocation"
                            v-model="dms.lat.dir"
                            :readonly="mode == 'view'"
                        ></v-text-field>
                    </v-col>
                </v-row>
                <v-row v-if="selectedSystem.id == 3">
                    <v-col cols="2.4">
                        <h4>Longitude</h4>
                    </v-col>
                    <v-col >
                        <v-text-field
                            @change="changedLocation"
                            v-model="dms.lng.deg"
                            :readonly="mode == 'view'"
                        ></v-text-field>
                    </v-col>
                    <v-col >
                        <v-text-field
                            @change="changedLocation"
                            v-model="dms.lng.min"
                            :readonly="mode == 'view'"
                        ></v-text-field>
                    </v-col>
                    <v-col >
                        <v-text-field
                            @change="changedLocation"
                            v-model="dms.lng.sec"
                            :readonly="mode == 'view'"
                        ></v-text-field>
                    </v-col>
                    <v-col >
                        <v-text-field
                            @change="changedLocation"
                            v-model="dms.lng.dir"
                            :readonly="mode == 'view'"
                        ></v-text-field>
                    </v-col>
                </v-row>
                <v-row v-if="showLocationAlert">
                    <v-col>
                        <v-alert
                        dense
                        outlined
                        type="error"
                        >
                        The location you entered is not in the <strong>Yukon</strong>
                        </v-alert>
                    </v-col>    
                </v-row>
            </v-alert>
        </v-col>
        <v-col cols="2">
            <v-textarea
                label="Crash Location Description"
                v-model="modifiableFields.crashlocation"
                :readonly="mode == 'view'"
            ></v-textarea>
            <v-select
                label="Location Accuracy"
                v-model="modifiableFields.accuracy"
                :items="locationAccuracyOptions"
                :readonly="mode == 'view'"
            ></v-select>
            <v-checkbox 
            v-model="modifiableFields.inyukon"
            :readonly="mode == 'view'"
            label="Crash site within Yukon">
            </v-checkbox>
        </v-col>
        <v-col cols="5">
            <!-- <div id="map" style="height: 400px;" ref="googleMap"></div> -->
            <div >
                <l-map
                :zoom="zoom"
                :center="center"
                style="height: 350px; width: 100%"
                >
                <l-tile-layer
                    :url="url"
                    :attribution="attribution"
                />
                <l-polygon
                    :lat-lngs="yukonArea.latlngs"
                    :color="yukonArea.color"
                    :fillOpacity="0.09"
                />
                <l-marker :lat-lng="[63.6333308, -135.7666636]" ></l-marker>
                <!--
                <l-marker
                    :visible="true"
                    :draggable="false"
                    :lat-lng="[63.6333308, -135.7666636]"
                    :icon="marker.icon"
                    @click="alert(marker)"
                >
                    <l-popup :content="marker.tooltip" />
                    <l-tooltip :content="marker.tooltip" />
                </l-marker>
                -->
                <l-control
                    :position="'bottomleft'"
                    class="custom-control-watermark"
                >Crash Site
                </l-control>
                </l-map>
            </div> 
        </v-col> 
    </v-row>  
</template>

<script>
/*
    This component is supposed to be reusable for other vue projects, but needs to work with an external container component that can provide it with the necessary data.
    Bind the location data on the props for a scenario where there is already info available, the component should display the location marker/pin on the map.
    Bind the location object or empty data AND also bind or expect an event to the container component, this event will be emmited when the user has added data, also
    the changes will be updated on the map to show the desired pin/marker.
*/
import { latLng } from "leaflet";
//import { Icon } from 'leaflet';

import 'leaflet/dist/leaflet.css';
import { 
    LMap, LTileLayer, LControl, LPolygon, LMarker, 
    //LTooltip,
    // LPopup 
    } from "vue2-leaflet";
export default {
    props: [ "fields", "mode"],
    components: {
    LMap,
    LTileLayer,
    LControl,
    LPolygon,
    LMarker,
   // LPopup,
//LTooltip
  },
    data: () =>({
        loader: null,
        apiKey:  "AIzaSyB-GL1_TJLlEiiJ0JaaMBXgqMJWx76bWQ8",
        mapConfig: {},
        map: null,
        marker: null,
        modifiableFields: {   
            accuracy: "",
            inyukon: "",
            crashlocation: "",
            lat: 0.0,
            long: 0.0,
            Location: "",
        },
        //fields for the types of coordinate systems 
        dd: {
            lat: 0, lng: 0
        },
        dms: {
            lat: { deg: 0, min: 0, sec: 0, dir: 0 },
            lng: { deg: 0, min: 0, sec: 0, dir: 0 }
        },
        umt: {
            lat: 0, lng: 0
        },
    //showLocationAlert
        showLocationAlert: false,
    //Selection vars
        selectedSystem: {id: 1, text: "Decimal Degrees"},
        locationAccuracyOptions: ["Approx."],
        projectionOptions: ["NAD 83", "NAD 83 CSRS", "WSG 84"],
        coordinateSystemOptions: [{id: 1, text: "Decimal Degrees"},{id: 2, text:  "UMT Zone 8"}, {id: 3, text: "Degrees, Minutes, Seconds"}],
    //test vars
        zoom: 8,
        center: latLng(64.000000, -135.000000),
        url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
        yukonArea: {
        latlngs: [
            [59.956838, -123.787082],
            [60.042293, -140.951599],
            [69.956674, -140.635986],
            [69.664723, -138.339844],
         
        ],
        color: "#ff00ff"
      },
        zoomOffset: -1
    }),
    async mounted() {
        /*
        this.loader = new Loader({
            apiKey: this.apiKey,
            version: "weekly",
            libraries: ["places"]
            });
        this.loadMap(63.6333308, -135.7666636);
        */
    }, 
    methods:{
        loadMap(lat, lng){//this method expects a numeric value (float) to load the map
            if(isNaN(lat) || isNaN(lng))
                return;

            this.loader.load().then(() => {
                let coord = { lat, lng};
                this.map = new window.google.maps.Map(this.$refs.googleMap, {
                    center: coord,
                    zoom: 8,
                });   
            });  
        },
        setCenter(lat, lng){//This method sets the center focus of the map
            if(isNaN(lat) || isNaN(lng))
                return;
            this.loader.load().then(() => {
                this.map.setCenter({lat,lng});
            }); 
            
        },
        removeMarker(){
            this.marker.setMap(null);
        },
        addMarker(lat, lng){
            if(isNaN(lat) || isNaN(lng))
                return;

            this.loader.load().then(() => {
                this.marker = new window.google.maps.Marker({
                    position: {lat, lng},
                    map: this.map,
                });
            }); 
        },
        //WORK IN PROGRESS
        changedLocation(){//sexagesimalToDecimal This method handles the user input, when the data has changed, it reloads the map with the new values
        console.log("1");
            this.updateStateCoordinates();
            console.log("2");
            let { lat, long } = this.modifiableFields;
            console.log("3");
            this.loadMap(lat,long);
            console.log("4");
            this.addMarker(lat,long);
            this.setCenter(lat,long);  
        },
        updateStateCoordinates(){
            let system = this.selectedSystem.id;
            if(!system)
                    return;
            //let lat,lng;
            switch(system){
                case 1://DD   
                    console.log(".1");
                    this.modifiableFields.lat = parseFloat(this.dd.lat);
                    this.modifiableFields.long = parseFloat(this.dd.lng);
                    break;
                case 2://UMT
                    console.log("for umt");
                    break;
                case 3: //DMS
                    console.log(".3");
                    this.modifiableFields.lat = parseFloat(this.convertDMSToDD(this.dms.lat));
                    this.modifiableFields.long = parseFloat(this.convertDMSToDD(this.dms.lng));
                    break;
            }
        },
        //WORK IN PROGRESS
        changedSystem(){// TESTING
            if(!this.selectedSystem.id)
                return;

            let lat,lng;
            switch(this.selectedSystem.id){
                case 1: //DD
                    this.dd = { lat: this.modifiableFields.lat, lng: this.modifiableFields.long };
                    this.dms = null;
                    this.umt = null;
                    break;
                case 2: //UMT
                    this.dd = { lat: this.modifiableFields.lat, lng: this.modifiableFields.long };
                    this.dms = null;
                    this.umt = null;
                    break;
                case 3: //DMS
                    lat = this.convertDDToDMS(this.modifiableFields.lat, false);
                    lng = this.convertDDToDMS(this.modifiableFields.long, true);
                    this.dms = { lat, lng };
                    this.dd = null;
                    this.umt = null;
                    break;
            }
        },
        getSexagesimalValue(val){//Expects an object with the following structure { deg, min, sec } 24.75303300355115, -107.46916977459131
            return `${val.deg}° ${val.min}' ${val.sec}`+"`"
        },
        convertDDToDMS(D, lng){
            const M=0|(D%1)*60e7;
            return {
                dir : D<0?lng?'W':'S':lng?'E':'N',
                deg : 0|(D<0?D=-D:D),
                min : 0|M/1e7,
                sec : (0|M/1e6%1*6e4)/100
            };
        },
        convertDMSToDD(val) {
            let { deg, min, sec, dir } = val;
            let dd = deg + min/60 + sec/(60*60);

            if (dir == "S" || dir == "W") {
                dd = dd * -1;
            } // Don't do anything for N or E
            return dd;
        },
        isNumber(evt) {
            evt = (evt) ? evt : window.event;
            var charCode = (evt.which) ? evt.which : evt.keyCode;
            if ((charCode > 31 && (charCode < 48 || charCode > 57)) && charCode !== 46) {
                evt.preventDefault();
            } else {
                return true;
            }
        },
showAlert() {
      alert("Click!");
    }
    },
    watch:{
        /*
            We use a watcher because the component is rendered before the data is available (the mounted() hook is ran before the parent component
            has fetched the data), because of that we cant use mounted or created to map the fields prop to the modifiedFields obj on the state, also 'prop' values 
            are not supposed to be modified, hence why we have the modifiable fields obj. If we dont use a watcher we would have to have a flag on the parent component
            to indicate when the data is available to render the component, this would make the component less independent and less reusable.
        
        fields(){
            this.modifiableFields = this.fields ? this.fields : this.modifiableFields;
            let lat = parseFloat(this.modifiableFields.lat);
            let long = parseFloat(this.modifiableFields.long);
            if(!isNaN(lat)){
                this.loadMap(lat,long)
                this.addMarker(lat,long);
                this.setCenter(lat,long);
                
            }
        },*/
    }
}
</script>

<style scoped>
.example-custom-control {
  background: #fff;
  padding: 0 0.5em;
  border: 1px solid #aaa;
  border-radius: 0.1em;
}
.custom-control-watermark {
  font-size: 200%;
  font-weight: bolder;
  color: #aaa;
  text-shadow: #555;
}
</style>