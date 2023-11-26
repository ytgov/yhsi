<template>
	<v-row>
		<!-- {{ modifiableFields }} -->

		<v-col cols="5">
			<!-- {{ siteLocation }} -->
			<v-alert
				outlined
				color="primary"
			>
				<div class="subtitle-1 pb-3">Location</div>

				<v-row>
					<v-col>
						<v-select
							outlined
							dense
							:items="coordinateSystemOptions"
							return-object
							item-text="text"
							label="Coordinate System"
							v-model="selectedSystem"
						></v-select>
					</v-col>
					<v-col>
						<v-select
							outlined
							dense
							disabled
							:items="projectionOptions"
							return-object
							item-text="name"
							label="Projection"
							@change="changedDatum"
							v-model="selectedProjection"
						></v-select>
					</v-col>
				</v-row>
				<v-form
					:readonly="mode == 'view'"
					:disabled="mode == 'view'"
				>
					<v-row>
						<div class="subtitle-1 pl-4">Coordinate</div>
					</v-row>

					<v-row>
						<v-col cols="1" />
						<v-col cols="9">
							<v-text-field
								outlined
								dense
								label="Latitude"
								v-model="displayCoordinate.lat"
							>
							</v-text-field>
						</v-col>
					</v-row>
					<v-row>
						<v-col cols="1" />
						<v-col cols="9">
							<v-text-field
								outlined
								dense
								label="Longitude"
								v-model="displayCoordinate.long"
							>
							</v-text-field>
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
				</v-form>
			</v-alert>
		</v-col>

		<v-col cols="2">
			<v-form
				:readonly="mode == 'view'"
				:disabled="mode == 'view'"
			>
				<v-textarea
					outlined
					dense
					label="Crash Location Description"
					v-model="airCrashLocation.locationDesc"
					:readonly="mode == 'view'"
				></v-textarea>
				{{ airCrashLocation.accuracy }}
				<v-select
					outlined
					dense
					label="Location Accuracy"
					v-model="airCrashLocation.accuracy"
					:items="locationAccuracyOptions"
				></v-select>
				<v-checkbox
					:value="!isOutsideYukon"
					:readonly="true"
					label="Crash site within Yukon"
				>
				</v-checkbox>
			</v-form>
		</v-col>

		<v-col cols="5">
			<div>
				<l-map
					class="map"
					ref="myMap"
					:center="center"
					:zoom="zoom"
					style="height: 350px; width: 100%"
				>
					<l-control-layers position="topright"></l-control-layers>
					<!-- <l-tile-layer
                    :url="layer.url"
                    :attribution="layer.attribution"
                    /> -->
					<l-tile-layer
						v-for="map in maps"
						:key="map.name"
						:name="map.name"
						:visible="map.visible"
						:url="map.url"
						:attribution="map.attribution"
						layer-type="base"
					/>

					<!-- <l-polygon
						:lat-lngs="yukonPolygon.latlngs"
						:color="yukonPolygon.color"
						:fillOpacity="0.09"
					>
						<l-tooltip content="Yukon" />
					</l-polygon> -->

					<l-marker
						:lat-lng="this.siteLocation"
						:visible="!marker.visible"
					></l-marker>
					<l-marker
						:visible="marker.visible"
						:draggable="false"
						:lat-lng="marker.latLng"
					>
						<l-popup :content="marker.tooltip" />
						<l-tooltip :content="marker.tooltip" />
					</l-marker>
					<!-- <l-control :position="'topright'">
                        <v-card class="pa-2">
                            <v-tooltip left>
                                <template v-slot:activator="{ on, attrs }">
                                    <v-icon
                                    color="primary"
                                    dark
                                    v-bind="attrs"
                                    v-on="on"
                                    @click="showTopographicMap = !showTopographicMap"
                                    >
                                     {{ showTopographicMap ? 'mdi-image' : 'mdi-image-off' }}
                                    </v-icon>
                                </template>
                                <span>Topographic Map</span>
                            </v-tooltip>
                        </v-card>
                    </l-control> -->
					<l-control :position="'bottomright'">
						<v-card class="pa-2">
							<v-tooltip left>
								<template v-slot:activator="{ on, attrs }">
									<v-icon
										color="primary"
										dark
										v-bind="attrs"
										v-on="on"
										@click="recenterMap()"
									>
										mdi-home
									</v-icon>
								</template>
								<span>Home</span>
							</v-tooltip>
						</v-card>
					</l-control>
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
import { latLng, Icon } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {
	LMap,
	LTileLayer,
	LControl,
	LPolygon,
	LMarker,
	LTooltip,
	LPopup,
	LControlLayers,
} from 'vue2-leaflet';
import { yukonPolygon, inYukon } from '../../../misc/yukon_territory_polygon';
import { AirCrashLocation } from '../store/models/AircrashModels';
import proj4 from 'proj4';

// const pointInPolygon = require('point-in-polygon');

/* eslint-enable */
export default {
	props: {
		airCrashLocation: {
			type: Object,
			required: false,
			default: () => new AirCrashLocation({}),
		},
		fields: {
			type: Object,
			required: true,
		},
		mode: {
			type: String,
			required: true,
			default: 'view',
		},
		mapType: {
			type: String,
			required: true,
			default: 'aircrash',
		},
	},
	components: {
		LMap,
		LTileLayer,
		LControl,
		// LPolygon,
		LMarker,
		LPopup,
		LTooltip,
		LControlLayers,
	},
	data: () => ({
		flag: 1, // tells the component if it should accept new prop data
		//showTopographicMap: false,
		// set a default location. Use for centering if no location is provided.
		location: {
			lat: 64.0,
			long: -135.0,
		},
		modifiableFields: {
			accuracy: '',
			inyukon: '',
			crashlocation: '',
			lat: 0.0,
			long: 0.0,
			Location: '',
		},
		//fields for the types of coordinate systems

		//Selection vars
		selectedSystem: { id: 1, text: 'Decimal Degrees' },
		selectedProjection: { id: 1, name: 'WGS 84' },
		locationAccuracyOptions: [
			'Approximate',
			'Map Measurement',
			'GPS',
			'Approx.',
		],
		projectionOptions: [
			//datums
			{
				id: 1,
				name: 'WGS 84',
				spec: 'EPSG:4326',
			},
			{
				id: 2,
				name: 'NAD 83',
				spec: 'EPSG:3978',
			},
			{
				id: 3,
				name: 'NAD 83 CSRS',
				spec: 'EPSG:3979',
			},
		],

		coordinateSystemOptions: [
			{ id: 1, text: 'Decimal Degrees' },
			// { id: 2, text: 'UTM' },
			{ id: 3, text: 'Degrees, Minutes, Seconds' },
		],
		//Crash site marker
		marker: {
			visible: false,
			latLng: [0, 0],
			tooltip: 'Selected crash site',
		},
		//predefined map & marker
		maps: [
			{
				// zoom: 8,
				// center: latLng(64.000000, -135.000000),
				url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', //https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png
				attribution:
					'&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
				name: 'OpenStreetMap',
				visible: true,
			},
			{
				// zoom: 8,
				// center: latLng(64.000000, -135.000000),
				url: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
				attribution:
					'&copy; <a href="http://osm.org/copyright">OpenTopoMap</a> contributors',
				name: 'OpenTopoMap',
				visible: false,
			},
		],
		yukonPolygon,
		zoom: 6,
		center: [64.0, -135.0],
	}),
	mounted() {
		this.getFields();
		this.fixMarkers();
		////console.log(proj4);
		proj4.defs([
			[
				'EPSG:4326',
				'+title=WGS 84 (long/lat) +proj=longlat +ellps=WGS84 +datum=WGS84 +units=degrees +no_defs',
			],
			[
				'EPSG:3978',
				'+proj=lcc +lat_1=49 +lat_2=77 +lat_0=49 +lon_0=-95 +x_0=0 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=degrees +no_defs',
			],
			[
				'EPSG:3979',
				'+proj=lcc +lat_1=49 +lat_2=77 +lat_0=49 +lon_0=-95 +x_0=0 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=degrees +no_defs',
			],
		]);
	},

	methods: {
		getFields() {
			if (!this.fields) {
				return;
			}
			this.modifiableFields = this.fields;

			let lat = parseFloat(this.modifiableFields.lat);
			let long = parseFloat(this.modifiableFields.long);
			if (!isNaN(lat) || !isNaN(long)) {
				this.changedLocation();
			}
			this.flag++;
		},
		fixMarkers() {
			//This code snippet fixes an issue where the marker icons dont appear (according to the vueleaflet docs)
			delete Icon.Default.prototype._getIconUrl;
			Icon.Default.mergeOptions({
				iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
				iconUrl: require('leaflet/dist/images/marker-icon.png'),
				shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
			});
		},
		recenterMap() {
			this.$refs.myMap.mapObject.panTo(this.siteLocation);
			//this.maps[ this.showTopographicMap ? 1 : 0].center = latLng(lat, lng);
		},
		setCenter(lat, lng) {
			//This method sets the center focus of the map
			if (isNaN(lat) || isNaN(lng)) return;

			//this.map.center = latLng(lat, lng);
			this.maps[this.showTopographicMap ? 1 : 0].center = latLng(lat, lng);
		},
		addMarker(lat, lng) {
			if (isNaN(lat) || isNaN(lng)) return;
			this.marker.latLng = latLng(lat, lng);
			this.marker.visible = true;
		},
		changedLocation() {
			// //This method handles the user input, when the data has changed, it reloads the map with the new values
			// this.addMarker(lat, long);
			// this.setCenter(lat, long);
		},

		decimalToDMS: function (decimalDegrees, isLongitude) {
			// is a duplicate of convertDDToDMS but uses less 'magic'
			let degrees = 0;

			if (decimalDegrees < 0) {
				degrees = Math.ceil(decimalDegrees);
			} else {
				degrees = Math.floor(decimalDegrees);
			}

			const minutesFloat = Math.abs(decimalDegrees - degrees) * 60;
			const minutes = Math.floor(minutesFloat);
			const seconds = ((minutesFloat - minutes) * 60).toFixed(0);

			// Determine the direction
			let direction;
			if (isLongitude) {
				direction = decimalDegrees >= 0 ? 'E' : 'W';
			} else {
				direction = decimalDegrees >= 0 ? 'N' : 'S';
			}

			return `${Math.abs(degrees)}°${minutes}'${seconds}"${direction}`;
		},
	},
	computed: {
		displayCoordinate: function () {
			// use a computed value to show the preffered coordinate system
			//decimal degrees
			if (this.selectedSystem.id === 1) {
				return { lat: this.fields.lat, long: this.fields.long };
			}
			//dms
			if (this.selectedSystem.id === 3) {
				return {
					lat: this.decimalToDMS(this.fields.lat, false),
					long: this.decimalToDMS(this.fields.long, true),
				};
			}
			return { lat: 'Error', long: 'Error' };
		},
		isOutsideYukon: function () {
			let { lat, long } = this.modifiableFields;
			return !inYukon(lat, long);
		},
		isEmpty: function () {
			let { lat, long } = this.modifiableFields;
			return lat == 0.0 && long == 0.0;
		},
		// layer () {
		//     return this.maps[ this.showTopographicMap ? 1 : 0]
		// }
	},
	watch: {
		/*
            We use a watcher because the component is rendered before the data is available (the mounted() hook is ran before the parent component
            has fetched the data), because of that we cant use mounted or created to map the fields prop to the modifiedFields obj on the state, also 'prop' values
            are not supposed to be modified, hence why we have the modifiable fields obj. If we dont use a watcher we would have to have a flag on the parent component
            to indicate when the data is available to render the component, this would make the component less independent and less reusable.

      */
		modifiableFields: {
			handler() {
				console.log('modifiableFields changed');
				this.modifiableFields.inyukon = !this.isOutsideYukon;
				this.$emit('modifiedDataCoordinates', this.modifiableFields);
			},
			deep: true,
		},
		airCrashLocation: {
			handler: function (val) {
				this.$emit('update:airCrashLocation', val);
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
