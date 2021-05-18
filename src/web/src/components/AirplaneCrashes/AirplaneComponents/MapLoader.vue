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
                            return-object
                            item-text="name"
                            @change="changedDatum"
                            v-model="selectedProjection"
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
                <v-row v-if="isOutsideYukon">
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

            <div >
                <l-map :key="mapkey"
                :zoom="map.zoom"
                :crs="getCRS"
                :center="map.center"
                style="height: 350px; width: 100%"
                >
                    <l-tile-layer
                        :url="map.url"
                        :attribution="map.attribution"
                    />
                    <l-polygon
                        :lat-lngs="yukonPolygon.latlngs"
                        :color="yukonPolygon.color"
                        :fillOpacity="0.09"
                    >
                        <l-tooltip content="Yukon" />
                    </l-polygon>
                    <l-marker :lat-lng="[63.6333308, -135.7666636]" :visible="!marker.visible"></l-marker>

                    <l-marker
                        :visible="marker.visible"
                        :draggable="false"
                        :lat-lng="marker.latLng"
                    >
                        <l-popup :content="marker.tooltip" />
                        <l-tooltip :content="marker.tooltip" />
                    </l-marker>
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
/* eslint-disable */
import { latLng, Icon, CRS } from "leaflet";
import L from 'leaflet';
const pointInPolygon = require('point-in-polygon');
import "proj4leaflet";
import proj4 from "proj4";
import 'leaflet/dist/leaflet.css';
import { LMap, LTileLayer, LControl, LPolygon, LMarker, LTooltip, LPopup } from "vue2-leaflet";
import { yukonPolygon } from '../../../misc/yukon_territory_polygon'
  /* eslint-enable */
export default {
    props: [ "fields", "mode"],
    components: {
    LMap,
    LTileLayer,
    LControl,
    LPolygon,
    LMarker,
    LPopup,
    LTooltip
  },
    data: () =>({
        mapkey: "startkey",
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
    //Selection vars
        selectedSystem: {id: 1, text: "Decimal Degrees"},
        selectedProjection: null,
        locationAccuracyOptions: ["Approx."],
        projectionOptions: [//datums
                {
                    id: 1,
                    name: "WSG 84", 
                    crs:  new L.Proj.CRS("EPSG:4326","+proj=longlat +datum=WGS84 +no_defs",
                {
                    resolutions: [8192, 4096, 2048] ,
                    origin: [0.0,0.0]
                }),

                },
                {
                    id: 2,
                    name: "NAD 83", 
                    crs: new L.Proj.CRS("EPSG:3978",
                "+proj=lcc +lat_1=49 +lat_2=77 +lat_0=49 +lon_0=-95 +x_0=0 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs", 
                {
                    resolutions: [2048, 1024, 512, 256, 128, 64, 32, 16, 8, 4, 2, 1, 0.5],
                    origin: [-938105.72,787721.55]
                })},
                {
                    id: 3,
                    name: "NAD 83 CSRS", 
                    crs: new L.Proj.CRS("EPSG:3979",
                "+proj=lcc +lat_1=49 +lat_2=77 +lat_0=49 +lon_0=-95 +x_0=0 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
                {
                    resolutions: [2048, 1024, 512, 256, 128, 64, 32, 16, 8, 4, 2, 1, 0.5],
                    origin: [30444.36,1555957.96]
                })
                }       
            ],
        coordinateSystemOptions: [{id: 1, text: "Decimal Degrees"},{id: 2, text:  "UMT Zone 8"}, {id: 3, text: "Degrees, Minutes, Seconds"}],
    //Crash site marker
        marker:{
            visible: false,
            latLng: [0,0],
            tooltip: "Selected crash site"
        },
    //predefined map & marker
        map: {
            zoom: 8,
            center: latLng(47.56, 7.59), //latLng(64.000000, -135.000000),
            url: //'https://api.maptiler.com/maps/streets/256/{x}/{y}/{7}.png?key=qrAJy6x3Ck8n4XFFH4PS',//
            'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', 
            attribution: '&copy; <a href="https://www.geo.admin.ch/">geo.admin.ch</a>',
        },
        yukonArea: {
            latlngs: [
                [59.956838, -123.787082],
                [60.042293, -140.951599],
                [69.956674, -140.635986],
                [69.664723, -138.339844],
            
            ],
            color: "#ff00ff"
      },
        yukonPolygon,
        zoomOffset: -1,
    }),
    created() {
        this.fixMarkers();
        this.selectedProjection = this.projectionOptions[0].crs;
    }, 

    methods:{
        changedDatum(){//modify the key of the map to make it reload     
            this.mapkey = this.selectedProjection.name;
        },
        fixMarkers(){
            //This code snippet fixes an issue where the marker icons dont appear
            delete Icon.Default.prototype._getIconUrl;
            Icon.Default.mergeOptions({
                iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
                iconUrl: require('leaflet/dist/images/marker-icon.png'),
                shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
            });
        },
        loadMap(lat, lng){//this method expects a numeric value (float) to load the map
            if(isNaN(lat) || isNaN(lng))
                return;

        },
        setCenter(lat, lng){//This method sets the center focus of the map
            if(isNaN(lat) || isNaN(lng))
                return;
            
            this.map.center = latLng(lat, lng); 
        },
        addMarker(lat, lng){
            if(isNaN(lat) || isNaN(lng))
                return;
            this.marker.latLng = [lat, lng];
            this.marker.visible = true;
        },
        //WORK IN PROGRESS
        changedLocation(){//This method handles the user input, when the data has changed, it reloads the map with the new values
            this.updateStateCoordinates();
            let lat = parseFloat(this.modifiableFields.lat);
            let long = parseFloat(this.modifiableFields.long);
            this.loadMap(lat,long);
            this.addMarker(lat,long);
            this.setCenter(lat,long);  
        },
        updateStateCoordinates(){
            let system = this.selectedSystem.id;
            if(!system)
                    return;
            //let lat,lng;
            let { lat, lng } = this.dms;
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
                    
                    console.log(lat,lng);
                    this.modifiableFields.lat = parseFloat(this.convertDMSToDD(this.dms.lat));
                    this.modifiableFields.long = parseFloat(this.convertDMSToDD(this.dms.lng));
                    break;
            }
        },
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
            console.log(val);
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
    },
    computed:{
        isOutsideYukon(){
            return !pointInPolygon(this.marker.latLng, this.yukonArea.latlngs);
        },
        getCRS(){
            return this.selectedProjection.crs;
        }
    },
    watch:{
        /*
            We use a watcher because the component is rendered before the data is available (the mounted() hook is ran before the parent component
            has fetched the data), because of that we cant use mounted or created to map the fields prop to the modifiedFields obj on the state, also 'prop' values 
            are not supposed to be modified, hence why we have the modifiable fields obj. If we dont use a watcher we would have to have a flag on the parent component
            to indicate when the data is available to render the component, this would make the component less independent and less reusable.
        */
        fields(){
            this.modifiableFields = this.fields ? this.fields : this.modifiableFields;
            this.dd = { lat: this.modifiableFields.lat, lng: this.modifiableFields.long };
            let lat = parseFloat(this.modifiableFields.lat);
            let long = parseFloat(this.modifiableFields.long);
            if(!isNaN(lat) || ! isNaN(long)){
                
                this.addMarker(lat,long);
                this.setCenter(lat,long); 
            }
             
        },
    }
}
</script>
