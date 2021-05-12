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
                        ></v-select>
                    </v-col>
                    <v-col>
                        <v-select
                            :items="projectionOptions"
                            label="Projection"
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
                            @change="changedLocation"
                            v-model="modifiableFields.lat"
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
                            v-model="modifiableFields.long"
                        ></v-text-field>
                    </v-col>
                </v-row>
<!-- SELECTED SYSTEM  == UMT -->
                <v-row v-if="selectedSystem.id == 2">
                    <v-col cols="2.4"><!-- Decides how many 'cols' its going to have -->
                        <h4>Latitude</h4>
                    </v-col>
                    <v-col>
                        <h4>Degrees</h4>
                        <v-text-field
                            @change="changedLocation"
                            v-model="modifiableFields.lat"
                        ></v-text-field>
                    </v-col>
                </v-row>
                <v-row v-if="selectedSystem.id == 2">
                    <v-col cols="2.4">
                        <h4>Longitude</h4>
                    </v-col>
                    <v-col >
                        <v-text-field
                            @change="changedLocation"
                            v-model="modifiableFields.long"
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
                            v-model="modifiableFields.lat"
                        ></v-text-field>
                    </v-col>
                    <v-col >
                        <h4>Minutes</h4>
                        <v-text-field
                            @change="changedLocation"
                            v-model="modifiableFields.lat"
                        ></v-text-field>
                    </v-col>
                    <v-col >
                        <h4>Seconds</h4>
                        <v-text-field
                            @change="changedLocation"
                            v-model="modifiableFields.lat"
                        ></v-text-field>
                    </v-col>
                    <v-col>
                        <h4>Direction</h4>
                        <v-text-field
                            @change="changedLocation"
                            v-model="modifiableFields.lat"
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
                            v-model="modifiableFields.long"
                        ></v-text-field>
                    </v-col>
                    <v-col >
                        <v-text-field
                            @change="changedLocation"
                            v-model="modifiableFields.long"
                        ></v-text-field>
                    </v-col>
                    <v-col >
                        <v-text-field
                            @change="changedLocation"
                            v-model="modifiableFields.long"
                        ></v-text-field>
                    </v-col>
                    <v-col >
                        <v-text-field
                            @change="changedLocation"
                            v-model="modifiableFields.long"
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
            ></v-textarea>
            <v-select
                label="Location Accuracy"
                v-model="modifiableFields.accuracy"
                :items="locationAccuracyOptions"
            ></v-select>
            <v-checkbox 
            v-model="modifiableFields.inyukon"
            label="Crash site within Yukon">
            </v-checkbox>
        </v-col>
        <v-col cols="5">
            <div id="map" style="height: 400px;" ref="googleMap"></div>
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
import { Loader } from '@googlemaps/js-api-loader';
import { sexagesimalToDecimal } from 'geolib';//decimalToSexagesimal
export default {
    props: [ "fields"],
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
            //fields for the types of coordinate systems 
            dd: null,
            dms: null,
            umt: null
        },
    //showLocationAlert
        showLocationAlert: false,
    //Selection vars
        selectedSystem: null,
        locationAccuracyOptions: ["Approx."],
        projectionOptions: ["NAD 83", "NAD 83 CSRS", "WSG 84"],
        coordinateSystemOptions: [{id: 1, text: "Decimal Degrees"},{id: 2, text:  "UMT Zone 8"}, {id: 3, text: "Degrees, Minutes, Seconds"}],
    }),
    async mounted() {
        this.selectedSystem = this.coordinateSystemOptions[2];
        this.loader = new Loader({
            apiKey: this.apiKey,
            version: "weekly",
            libraries: ["places"]
            });
        this.loadMap(63.6333308,-135.7666636);
    }, 
    methods:{
        loadMap(lat, lng){
            this.loader.load().then(() => {
                let coord = { lat, lng};
                this.map = new window.google.maps.Map(this.$refs.googleMap, {
                    center: coord,
                    zoom: 8,
                });   
            });  
        },
        setCenter(lat, lng){
            this.loader.load().then(() => {
                this.map.setCenter({lat,lng});
            }); 
            
        },
        removeMarker(){
            this.marker.setMap(null);
        },
        addMarker(lat,lng){
            this.loader.load().then(() => {
                this.marker = new window.google.maps.Marker({
                    position: {lat, lng},
                    map: this.map,
                });
            }); 
        },
        changedLocation(){sexagesimalToDecimal
            let lat;
            let long;
            switch(this.selectedSystem.id){
                case 1:   
                    lat = parseFloat(this.modifiableFields.dd.lat);
                    long = parseFloat(this.modifiableFields.dd.lng);
                    break;
                case 2:
                    console.log("for umt");
                    break;
                case 3:
                    console.log("for dms");
                    break;
            }

            if(!isNaN(lat)){
                this.loadMap(lat,long)
                this.addMarker(lat,long);
                this.setCenter(lat,long);
            }
        },
        changedSystem(){//prepares values for display
            let lat,lng;
            switch(this.selectedSystem.id){
                case 1:   
                    this.modifiableFields.dd = { lat: this.modifiableFields.lat, lng: this.modifiableFields.long };
                    this.modifiableFields.dms = null;
                    this.modifiableFields.umt = null;
                    break;
                case 2:
                    console.log("for umt");
                    break;
                case 3:
                    lat = sexagesimalToDecimal(this.modifiableFields.lat);
                    lng = sexagesimalToDecimal(this.modifiableFields.long);
                    this.modifiableFields.dms = { lat, lng };
                    this.modifiableFields.dd = null;
                    this.modifiableFields.umt = null;
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
            let lat = parseFloat(this.modifiableFields.lat);
            let long = parseFloat(this.modifiableFields.long);
             if(!isNaN(lat)){
                this.loadMap(lat,long)
                this.addMarker(lat,long);
                this.setCenter(lat,long);
            }
        },
    }
}
</script>