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
                        <v-select outlined dense
                            :items="coordinateSystemOptions"
                            return-object
                            item-text="text"
                            label="Coordinate System"
                            @change="changedSystem"
                            v-model="selectedSystem"
                        ></v-select>
                    </v-col>
                    <v-col>
                        <v-select outlined dense
                            :items="projectionOptions"
                            return-object
                            item-text="name"
                            label="Projection"
                            @change="changedDatum"
                            v-model="selectedProjection"  
                        ></v-select>
                    </v-col>
                </v-row>
<!-- SELECTED SYSTEM  == DD -->
                <v-row v-if="selectedSystem.id == 1 && selectedProjection.id == 1">
                    <v-col cols="2.4">
                        <h4>Latitude</h4>
                    </v-col>
                    <v-col cols="9">
                        <h4>Degrees</h4>
                        <v-text-field outlined dense
                            @change="changedLocation"
                            v-model="dd.lat"
                            :readonly="mode == 'view'"
                            type="number"
                        ></v-text-field>
                    </v-col>
                </v-row>
                <v-row v-if="selectedSystem.id == 1 && selectedProjection.id == 1">
                    <v-col cols="2.4">
                        <h4>Longitude</h4>
                    </v-col>
                    <v-col cols="9">
                        <v-text-field outlined dense
                            @change="changedLocation"
                            v-model="dd.lng"
                            :readonly="mode == 'view'"
                            type="number"
                        ></v-text-field>
                    </v-col>
                </v-row>
<!-- SELECTED SYSTEM  == UTM -->
                <v-row v-if="selectedSystem.id == 2 && selectedProjection.id == 1">
                    <v-col cols="3">
                        <h4>Easting</h4>
                        <v-text-field outlined dense
                            @change="changedLocation"
                            v-model="utm.Easting"
                            :readonly="mode == 'view'"
                            type="number"
                        ></v-text-field>
                    </v-col>
                    <v-col cols="3">
                        <h4>Northing</h4>
                        <v-text-field outlined dense
                            @change="changedLocation"
                            v-model="utm.Northing"
                            :readonly="mode == 'view'"
                            type="number"
                        ></v-text-field>
                    </v-col>
                    <v-col cols="3">
                        <h4>Hemisphere</h4>
                        <v-select outlined dense
                        @change="changedLocation"
                        v-model="utm.ZoneLetter"
                        :readonly="mode == 'view'"
                        :items="hemispheres"
                        ></v-select>
                    </v-col>
                     <v-col cols="3">
                        <h4>Zone</h4>
                        <v-text-field outlined dense
                            @change="changedLocation"
                            v-model="utm.ZoneNumber"
                            :readonly="mode == 'view'"
                            type="number"
                        ></v-text-field>
                    </v-col>
                </v-row>
<!-- SELECTED SYSTEM  == DMS -->
                <v-row v-if="selectedSystem.id == 3 && selectedProjection.id == 1">
                    <v-col cols="2.4"><!-- Decides how many 'cols' its going to have -->
                        <h4>Latitude</h4>
                    </v-col>
                    <v-col >
                        <h4>Degrees</h4>
                        <v-text-field outlined dense
                            @change="changedLocation"
                            v-model="dms.lat.deg"
                            :readonly="mode == 'view'"
                            type="number"
                        ></v-text-field>
                    </v-col>
                    <v-col >
                        <h4>Minutes</h4>
                        <v-text-field outlined dense
                            @change="changedLocation"
                            v-model="dms.lat.min"
                            :readonly="mode == 'view'"
                            type="number"
                        ></v-text-field>
                    </v-col>
                    <v-col >
                        <h4>Seconds</h4>
                        <v-text-field outlined dense
                            @change="changedLocation"
                            v-model="dms.lat.sec"
                            :readonly="mode == 'view'"
                            type="number"
                        ></v-text-field>
                    </v-col>
                    <v-col>
                        <h4>Direction</h4> 
                        <v-text-field outlined dense
                            @change="changedLocation"
                            v-model="dms.lat.dir"
                            :readonly="mode == 'view'"
                        ></v-text-field>
                    </v-col>
                </v-row>
                <v-row v-if="selectedSystem.id == 3 && selectedProjection.id == 1">
                    <v-col cols="2.4">
                        <h4>Longitude</h4>
                    </v-col>
                    <v-col >
                        <v-text-field outlined dense
                            @change="changedLocation"
                            v-model="dms.lng.deg"
                            :readonly="mode == 'view'"
                            type="number"
                        ></v-text-field>
                    </v-col>
                    <v-col >
                        <v-text-field outlined dense
                            @change="changedLocation"
                            v-model="dms.lng.min"
                            :readonly="mode == 'view'"
                            type="number"
                        ></v-text-field>
                    </v-col>
                    <v-col >
                        <v-text-field outlined dense
                            @change="changedLocation"
                            v-model="dms.lng.sec"
                            :readonly="mode == 'view'"
                            type="number"
                        ></v-text-field>
                    </v-col>
                    <v-col >
                        <v-text-field outlined dense
                            @change="changedLocation"
                            v-model="dms.lng.dir"
                            :readonly="mode == 'view'"
                        ></v-text-field>
                    </v-col>
                </v-row>
    <!-- SELECTED PROJECITON IS NOT WSG -->
                <v-row v-if="selectedProjection.id != 1">
                    <v-col cols="2.4">
                        <h4>X</h4>
                    </v-col>
                    <v-col cols="9">
                        <v-text-field outlined dense
                            @change="changedLocation"
                            v-model="nad83.x"
                            :readonly="mode == 'view'"
                            type="number"
                        ></v-text-field>
                    </v-col>
                </v-row>
                <v-row v-if="selectedProjection.id != 1">
                    <v-col cols="2.4">
                        <h4>Y</h4>
                    </v-col>
                    <v-col cols="9"> 
                        <v-text-field outlined dense
                            @change="changedLocation"
                            v-model="nad83.y"
                            :readonly="mode == 'view'"
                            type="number"
                        ></v-text-field>
                    </v-col>
                </v-row>
                 <v-row v-if="isEmpty">
                    <v-col>
                        <v-alert
                        dense
                        outlined
                        type="error"
                        >
                        Please enter a location in the <strong>Yukon</strong>
                        </v-alert>
                    </v-col>    
                </v-row>
                <v-row v-else-if="isOutsideYukon">
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
            <v-textarea outlined dense
                label="Crash Location Description"
                v-model="modifiableFields.crashlocation"
                :readonly="mode == 'view'"
            ></v-textarea>
            <v-select outlined dense
                label="Location Accuracy"
                v-model="modifiableFields.accuracy"
                :items="locationAccuracyOptions"
                :readonly="mode == 'view'"
            ></v-select>
            <v-checkbox 
            :value="!isOutsideYukon"
            :readonly="true"
            label="Crash site within Yukon">
            </v-checkbox>
        </v-col>
        <v-col cols="5">
            <div >
                <l-map class="map"
                :center="map.center"
                :zoom="map.zoom"
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
import { latLng, Icon } from "leaflet";
import "leaflet/dist/leaflet.css";
import {
  LMap,
  LTileLayer,
  LControl,
  LPolygon,
  LMarker,
  LTooltip,
  LPopup,
} from "vue2-leaflet";
import { yukonPolygon } from "../../../misc/yukon_territory_polygon";
import proj4 from "proj4";

const pointInPolygon = require("point-in-polygon");
const utmObj = require("utm-latlng");
const utmVar = new utmObj();
/* eslint-enable */
export default {
  props: ["fields", "mode"],
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
        flag: 1,// tells the component if it should accept new prop data
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
        utm: {
           Easting: 0,Northing: 0, ZoneLetter: null, ZoneNumber: 0,
        },
        nad83: {
            x: 0,
            y: 0
        },
    //Selection vars
        selectedSystem: { id: 1, text: "Decimal Degrees" },
        selectedProjection: { id: 1, name: "WSG 84" },
        locationAccuracyOptions: ["Approximate", "Map Measurement", "GPS"],
        projectionOptions: [//datums
                {
                    id: 1,
                    name: "WSG 84", 
                },
                {
                    id: 2,
                    name: "NAD 83", 
                },
                {
                    id: 3,
                    name: "NAD 83 CSRS", 
                }       
            ],
        hemispheres: ["C","D","E","F","G","H","J","K","L","M","N","P","Q","R","S","T","U","V","W","X"],   
        coordinateSystemOptions: [{id: 1, text: "Decimal Degrees"},{id: 2, text:  "UTM"}, {id: 3, text: "Degrees, Minutes, Seconds"}],
    //Crash site marker
        marker:{
            visible: false,
            latLng: [0,0],
            tooltip: "Selected crash site"
        },
    //predefined map & marker
        map: {
            zoom: 4,
            center: latLng(64.000000, -135.000000), //latLng(64.000000, -135.000000),
            url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', 
            attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
        },
        yukonPolygon,
    }),
    mounted() {
        this.getFields();
        this.fixMarkers();
        //console.log(proj4);
        proj4.defs([
            [
                'EPSG:4326',
                '+title=WGS 84 (long/lat) +proj=longlat +ellps=WGS84 +datum=WGS84 +units=degrees +no_defs'
            ],
            [
                'EPSG:3978',
                '+proj=lcc +lat_1=49 +lat_2=77 +lat_0=49 +lon_0=-95 +x_0=0 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=degrees +no_defs'
            ],
            [
                'EPSG:3979',
                '+proj=lcc +lat_1=49 +lat_2=77 +lat_0=49 +lon_0=-95 +x_0=0 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=degrees +no_defs'
            ]
        ]);
    }, 

    methods:{
        getFields(){
            if(!this.fields){
                return;
            }
            this.modifiableFields = this.fields;
            this.dd = { lat: this.modifiableFields.lat, lng: this.modifiableFields.long };
            let lat = parseFloat(this.modifiableFields.lat);
            let long = parseFloat(this.modifiableFields.long);
            if(!isNaN(lat) || ! isNaN(long)){
                this.changedLocation();
            }
            this.flag++
        },
        //This method is responsible for transforming the inputed lat & long values depending on the cordinate system and the selected projeciton 
        changedDatum(){  
            this.updateDisplayCoordinates();  
            this.applyCoordinateProjection();
        },
        fixMarkers(){
            //This code snippet fixes an issue where the marker icons dont appear (according to the vueleaflet docs)
            delete Icon.Default.prototype._getIconUrl;
            Icon.Default.mergeOptions({
                iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
                iconUrl: require('leaflet/dist/images/marker-icon.png'),
                shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
            });
        },
        setCenter(lat, lng){//This method sets the center focus of the map
            if(isNaN(lat) || isNaN(lng))
                return;
            
            this.map.center = latLng(lat, lng); 
        },
        addMarker(lat, lng){
            if(isNaN(lat) || isNaN(lng))
                return;
            this.marker.latLng = latLng(lat, lng); 
            this.marker.visible = true;
        },
        changedLocation(){//This method handles the user input, when the data has changed, it reloads the map with the new values
            if(this.selectedProjection.id == 1)
                this.updateStateCoordinates();
            else
                this.transformProjectedCoordinates();
            
            let lat = parseFloat(this.modifiableFields.lat);
            let long = parseFloat(this.modifiableFields.long);
            this.addMarker(lat,long);
            this.setCenter(lat,long);  
        },
        // this method  applies cordinate projection to the 'display cordinates' according to the selected projection
        applyCoordinateProjection(){
            let { lat, long } = this.modifiableFields;
            let { id } = this.selectedProjection;
            let transformed_coordinates;
            switch(id){
                case 1:
                    this.dd = { lat: this.modifiableFields.lat, lng: this.modifiableFields.long };
                    break;
                case 2://NAD83 
                    transformed_coordinates = proj4(proj4('EPSG:3978'), [long,lat]);
                    this.nad83 = { x: transformed_coordinates[0], y: transformed_coordinates[1] };
                    break;
                case 3://NAD83 CRS
                    transformed_coordinates = proj4(proj4('EPSG:3979'), [long,lat]);
                    this.nad83 = { x: transformed_coordinates[0], y: transformed_coordinates[1] };
                    break;
            }
        },
        //this transform the projected coordinats
        transformProjectedCoordinates(){
            let { x, y } = this.nad83;
            let transformed_coordinates;
            switch(this.selectedProjection.id){
                case 1:
                    this.dd = { lat: this.modifiableFields.lat, lng: this.modifiableFields.long };
                    this.modifiableFields.lat = this.dd.lat;
                    this.modifiableFields.long = this.dd.lng;
                    break;
                case 2://NAD83 
                    transformed_coordinates = proj4(proj4('EPSG:3978'),proj4('EPSG:4326'), [parseFloat(x),parseFloat(y)]);
                    this.modifiableFields.lat = transformed_coordinates[1];
                    this.modifiableFields.long = transformed_coordinates[0];
                    break;
                case 3://NAD83 CRS
                    transformed_coordinates = proj4(proj4('EPSG:3978'),proj4('EPSG:4326'), [parseFloat(x),parseFloat(y)]);
                    this.modifiableFields.lat = transformed_coordinates[1];
                    this.modifiableFields.long = transformed_coordinates[0];
                    break;
            }
        },
        updateStateCoordinates(){
            let system = this.selectedSystem.id;
            if(!system)
                    return;
            
            let data;
            switch(system){
                case 1://DD   
                    this.modifiableFields.lat = parseFloat(this.dd.lat);
                    this.modifiableFields.long = parseFloat(this.dd.lng);
                    break;
                case 2://UTM
                    data = utmVar.convertUtmToLatLng( this.utm.Easting,  this.utm.Northing,  this.utm.ZoneNumber,  this.utm.ZoneLetter);
                    this.modifiableFields.lat = parseFloat(data.lat);
                    this.modifiableFields.long = parseFloat(data.lng);
                    break;
                case 3: //DMS
                    this.modifiableFields.lat = parseFloat(this.convertDMSToDD(this.dms.lat));
                    this.modifiableFields.long = parseFloat(this.convertDMSToDD(this.dms.lng));
                    break;
            }
        },
        changedSystem(){
            this.updateDisplayCoordinates();
            this.applyCoordinateProjection();
        }, 
        updateDisplayCoordinates(){// TESTING
            let { id } = this.selectedSystem;

            if(!id)
                return;

            let lat,lng;
            switch(id){
                case 1: //DD
                    this.dd = { lat: this.modifiableFields.lat, lng: this.modifiableFields.long };
                    this.dms = null;
                    this.utm = null;
                    break;
                case 2: //utm
                    this.utm = utmVar.convertLatLngToUtm(this.modifiableFields.lat,this.modifiableFields.long,1);
                    //console.log(this.utm);
                    this.dms = null;
                    this.dd = null;
                    break;
                case 3: //DMS
                    lat = this.convertDDToDMS(this.modifiableFields.lat, false);
                    lng = this.convertDDToDMS(this.modifiableFields.long, true);
                    this.dms = { lat, lng };
                    this.dd = null;
                    this.utm = null;
                    break;
            }
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
            //console.log(val);
            let { deg, min, sec, dir } = val;
            let dd = deg + (min/60) + sec/(60*60);
            dd = parseFloat(dd);
            if (dir == "S" || dir == "W") {
                dd = dd * -1;
            } // Don't do anything for N or E
            return dd;
        },
    },
    computed:{
        isOutsideYukon(){
            let { lat, long } = this.modifiableFields;
            return !pointInPolygon([ lat,long], yukonPolygon.latlngs);
        },
        isEmpty(){
            let { lat, long } = this.modifiableFields;
            return lat == 0.0 && long == 0.0;
        }
    },
    watch:{
        /*
            We use a watcher because the component is rendered before the data is available (the mounted() hook is ran before the parent component
            has fetched the data), because of that we cant use mounted or created to map the fields prop to the modifiedFields obj on the state, also 'prop' values 
            are not supposed to be modified, hence why we have the modifiable fields obj. If we dont use a watcher we would have to have a flag on the parent component
            to indicate when the data is available to render the component, this would make the component less independent and less reusable.
        
        fields(){
            if(this.fields && this.flag < 3){
                this.modifiableFields = this.fields;
                this.dd = { lat: this.modifiableFields.lat, lng: this.modifiableFields.long };
                let lat = parseFloat(this.modifiableFields.lat);
                let long = parseFloat(this.modifiableFields.long);
                if(!isNaN(lat) || ! isNaN(long)){
                    this.changedLocation();
                }
                this.flag++
            }
        },*/
    modifiableFields: {
      handler() {
        this.modifiableFields.inyukon = !this.isOutsideYukon;
        this.$emit("modifiedDataCoordinates", this.modifiableFields);
      },
      deep: true,
    },
  },
};
</script>

<style scoped>
.map {
  z-index: 1;
}
</style>