<template>
    <v-row>
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
                <v-row>
                    <v-col :cols="2.4"><!-- Decides how many 'cols' its going to have -->
                        <h4>Latitude</h4>
                    </v-col>
                    <v-col :cols="showLocationColumn ? '' : 9">
                        <h4>Degrees</h4>
                        <v-text-field
                            v-model="constructionDate"
                        ></v-text-field>
                    </v-col>
                    <v-col v-if="showLocationColumn">
                        <h4>Minutes</h4>
                        <v-text-field
                            v-model="constructionDate"
                        ></v-text-field>
                    </v-col>
                    <v-col v-if="showLocationColumn">
                        <h4>Seconds</h4>
                        <v-text-field
                            v-model="constructionDate"
                        ></v-text-field>
                    </v-col>
                    <v-col v-if="showLocationColumn">
                        <h4>Direction</h4>
                        <v-text-field
                            v-model="constructionDate"
                        ></v-text-field>
                    </v-col>
                </v-row>
                <v-row>
                    <v-col cols="2.4">
                        <h4>Longitude</h4>
                    </v-col>
                    <v-col :cols="showLocationColumn ? '' : 9">
                        <v-text-field
                            v-model="constructionDate"
                        ></v-text-field>
                    </v-col>
                    <v-col v-if="showLocationColumn">
                        <v-text-field
                            v-model="constructionDate"
                        ></v-text-field>
                    </v-col>
                    <v-col v-if="showLocationColumn">
                        <v-text-field
                            v-model="constructionDate"
                        ></v-text-field>
                    </v-col>
                    <v-col v-if="showLocationColumn">
                        <v-text-field
                            v-model="constructionDate"
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
                v-model="constructionDate"
            ></v-textarea>
            <v-select
                label="Location Accuracy"
                :items="locationAccuracyOptions"
            ></v-select>
            <v-checkbox 
            label="Creash site within Yukon">
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
export default {
    props: [ "coordinateSystem", "projection",  ],
    data: () =>({
        loader: null,
        apiKey:  "AIzaSyB-GL1_TJLlEiiJ0JaaMBXgqMJWx76bWQ8",
        mapConfig: {},
        map: null,
    //showLocationAlert
        showLocationAlert: false,
    //Selection vars
        selectedSystem: null,
        locationAccuracyOptions: ["Approximate"],
        projectionOptions: ["NAD 83", "NAD 83 CSRS", "WSG 84"],
        coordinateSystemOptions: [{id: 1, text: "Degrees, Minutes, Seconds"},{id: 2, text:  "UMT Zone 8"}, {id: 3, text: "Decimal Degrees"}],
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
        showLocationColumn(){
            if(!this.selectedSystem)
                return true;
            if(this.selectedSystem.id == 1)
                return true;
            else    
                return false;
        },
    }
}
</script>