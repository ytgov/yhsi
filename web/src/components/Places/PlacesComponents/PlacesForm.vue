<template>
	<div>
		<h3>Places</h3>
		<Breadcrumbs />
		<!-- header section -->
		<v-row>
			<v-col
				cols="12"
				class="d-flex"
			>
				<h1 v-if="mode == 'view'">{{ fields.name }}</h1>
				<v-text-field
					v-else
					label="Place name"
					v-model="fields.name"
					dense
					outlined
					background-color="white"
					hide-details
					required
				></v-text-field>
				<v-spacer></v-spacer>

				<!-- buttons for the view state -->
				<v-btn
					class="mx-1 form-header"
					color="primary"
					@click="editMode"
					v-if="mode == 'view'"
				>
					<v-icon class="mr-1">mdi-pencil</v-icon>
					Edit
				</v-btn>
				<PrintButton
					v-if="mode == 'view'"
					:data="printData"
					:name="printData.name"
					:selectedImage="selectedImage"
					class="mx-1 form-header"
				/>

				<!-- buttons for the edit state -->
				<v-btn
					class="black--text mx-1 form-header"
					@click="cancelEdit"
					v-if="mode == 'edit'"
				>
					<v-icon>mdi-close</v-icon>
					Cancel
				</v-btn>
				<v-btn
					color="success"
					:disabled="changesMade < 1"
					v-if="mode == 'edit'"
					@click="saveChanges"
					class="form-header"
				>
					<v-icon class="mr-1">mdi-check</v-icon>
					Save
				</v-btn>

				<!-- buttons for the new state -->
				<v-btn
					class="black--text mx-1 form-header"
					@click="cancelNew"
					v-if="mode == 'new'"
				>
					<v-icon>mdi-close</v-icon>
					Cancel
				</v-btn>
				<v-btn
					color="primary"
					:disabled="changesMade < 1"
					v-if="mode == 'new'"
					@click="createPlace"
					class="form-header"
				>
					<v-icon class="mr-1">mdi-check</v-icon>
					Create Place
				</v-btn>
			</v-col>
		</v-row>
		<!-- end header section -->

		<!-- Body top -->
		<div class="row">
			<div class="col-md-3">
				<!-- Names list -->
				<v-card class="default mb-5">
					<v-card-text>
						<h3>Alternate Names</h3>
						<div
							class="row"
							v-for="(item, i) of altNames"
							:key="i"
						>
							<div class="col-md-10">
								<v-text-field
									v-model="item.alternateName"
									label="Alternate name"
									:readonly="mode == 'view'"
									dense
									outlined
									background-color="white"
									hide-details
								>
								</v-text-field>
							</div>

							<div
								v-if="mode != 'view'"
								class="col-md-2"
							>
								<v-btn
									color="warning"
									x-small
									fab
									title="Remove"
									class="my-0 float-right"
									@click="removeName(i)"
									><v-icon>mdi-close</v-icon></v-btn
								>
							</div>
						</div>
						<v-btn
							v-if="mode != 'view'"
							class="mt-5"
							color="primary"
							@click="addName()"
						>
							Add Alternate Name
						</v-btn>
					</v-card-text>
				</v-card>

				<v-text-field
					v-if="mode == 'view'"
					class="default mb-5"
					label="Place types"
					v-model="placeTypeNames"
					:readonly="mode == 'view'"
					dense
					outlined
					background-color="white"
					hide-details
				></v-text-field>

				<v-select
					v-else
					dense
					outlined
					v-model="placeTypes"
					:items="placeTypeOptions"
					item-text="PlaceType"
					item-value="Id"
					multiple
					clearable
					label="Place types"
				></v-select>

				<v-textarea
					label="Notes"
					v-model="fields.notes"
					:readonly="mode == 'view'"
					dense
					outlined
					background-color="white"
					hide-details
				></v-textarea>
			</div>

			<!-- Middle section -->
			<div class="col-md-5">
				<v-card class="default mb-5">
					<v-card-text>
						<h3>First Nation Names</h3>
						<div
							class="row"
							v-for="(item, i) of fnNames"
							:key="i"
						>
							<div class="col-md-11">
								<v-row>
									<div class="col-md-6">
										<v-text-field
											v-model="item.fnName"
											:readonly="mode == 'view'"
											label="Name"
											dense
											outlined
											hide-details
											background-color="white"
											required
										></v-text-field>
									</div>
									<div class="col-md-6">
										<v-text-field
											v-model="item.fnLanguage"
											:readonly="mode == 'view'"
											label="Language"
											dense
											outlined
											hide-details
											background-color="white"
											required
										></v-text-field>
									</div>
								</v-row>
								<v-row>
									<div class="col-md-12">
										<v-text-field
											v-model="item.fnDesription"
											:readonly="mode == 'view'"
											label="Description"
											dense
											outlined
											hide-details
											background-color="white"
											required
										></v-text-field>
									</div>
								</v-row>
							</div>

							<div
								v-if="mode != 'view'"
								class="col-md-1"
							>
								<v-btn
									color="warning"
									x-small
									fab
									title="Remove"
									class="my-0 float-right"
									@click="removeFnName(i)"
									><v-icon>mdi-close</v-icon></v-btn
								>
							</div>
							<div
								v-if="i < fnNames.length - 1"
								class="col-md-12"
							>
								<hr />
							</div>
						</div>
						<v-btn
							v-if="mode != 'view'"
							class="mt-5"
							color="primary"
							@click="addFnName()"
						>
							Add First Nation Name
						</v-btn>
					</v-card-text>
				</v-card>

				<v-card class="default mb-5">
					<v-card-text>
						<h3>First Nation Associations</h3>
						<div
							class="row"
							v-for="(item, i) of fnAssociations"
							:key="i"
						>
							<div class="col-md-11">
								<v-row>
									<v-col cols="6">
										<v-select
											v-model="item.fnAssociationType"
											label="Association"
											:items="fnAssociationTypeOptions"
											item-text="text"
											item-value="value"
											:readonly="mode == 'view'"
											:class="{ 'read-only-form-item': mode == 'view' }"
											dense
											outlined
											hide-details
											background-color="white"
										></v-select>
									</v-col>
									<v-col cols="6">
										<v-select
											v-model="item.firstNationId"
											label="First Nation"
											:items="firstNationOptions"
											item-value="id"
											item-text="description"
											:readonly="mode == 'view'"
											:class="{ 'read-only-form-item': mode == 'view' }"
											dense
											outlined
											hide-details
											background-color="white"
										></v-select>
									</v-col>
								</v-row>
							</div>

							<div
								v-if="mode != 'view'"
								class="col-md-1"
							>
								<v-btn
									color="warning"
									x-small
									fab
									title="Remove"
									class="my-0 float-right"
									@click="removeFNAssociation(i)"
									><v-icon>mdi-close</v-icon></v-btn
								>
							</div>
						</div>
						<v-btn
							v-if="mode != 'view'"
							class="mt-5"
							color="primary"
							@click="addFNAssociation()"
						>
							Add Association
						</v-btn>
					</v-card-text>
				</v-card>
			</div>
			<!-- End middle section -->

			<!-- Photos component -->
			<div class="col-md-4">
				<GenericRecordPhotosCard
					v-if="mode != 'new'"
					record="ytplace"
					:recordId="placeId"
					:showAddPhotoButton="mode == 'edit'"
					@newSelectedImage="updateSelectedImage"
				/>
				<EmptyPhotosCard 
					v-else 
				/>
			</div>
		</div>
		<!-- end body top -->

		<MapLoader
			v-if="infoLoaded"
			:mode="mode"
			:mapType="'ytPlace'"
			@modifiedDataCoordinates="modifiedDataCoordinates"
			:fields="{
				accuracy: fields.accuracy,
				inyukon: null,
				locationDesc: fields.locationDesc,
				lat: fields.latitude,
				long: fields.longitude,
				Location: null,
				mapSheet: fields.mapSheet,
			}"
		/>

		<v-divider class="my-5"></v-divider>

		<HistoricRecord
			v-if="histories != undefined && mode != 'new' && infoLoaded"
			:historicRecords="histories"
			:mode="mode"
			:placeId="placeId"
			@historic-record-change="historicRecordChange"
		/>
	</div>
</template>

<script>
import GenericRecordPhotosCard from '@/components/photos/GenericRecordPhotosCard.vue';
import EmptyPhotosCard from "@/components/photos/EmptyPhotosCard.vue"

import Breadcrumbs from '../../Breadcrumbs.vue';
import HistoricRecord from './HistoricRecord';
import PrintButton from './PrintButton';
import MapLoader from '../../MapLoader';
import catalogs from '../../../controllers/catalogs';
import { YTPLACE_URL, STATIC_URL } from '../../../urls';
import axios from 'axios';
//import _ from "lodash";

export default {
	name: 'placesForm',
	components: { Breadcrumbs, PrintButton, HistoricRecord, MapLoader, GenericRecordPhotosCard, EmptyPhotosCard },
	data: () => ({
		mode: '',
		fields: {},
		placeTypes: [],
		placeTypeNames: [],
		fnNames: [],
		altNames: [],
		fnAssociations: [],
		placeTypeOptions: [],
		selectedImage: null,
		changesMade: 0,
		firstNationOptions: [],
		fnAssociationTypeOptions: [],
		histories: [],
		modifiedMapFields: null,
		placeId: null,

		//helper vars used for the name list functions
		editTableNames: -1, // tells the list which element will be edited (it has problems with accuracy, i.e: you cant distinguish between an edit & a new element being added)
		addingName: false, // tells the list if the user is adding a new element, this helps distinguish between an edit & a new element being added...
		helperName: null,
		validName: false,
		nameRules: [(v) => !!v || 'Name is required'],

		infoLoaded: false,
	}),
	created() {
		// Get static data
		this.getPlaceTypeLookup();
		axios.get(`${STATIC_URL}/first-nation`).then((resp) => {
			this.firstNationOptions = resp.data.data;
		});
		axios.get(`${STATIC_URL}/first-nation-association-type`).then((resp) => {
			this.fnAssociationTypeOptions = resp.data.data;
		});

		// Fetch or reset place data depending on path
		if (this.checkPath('edit')) {
			this.mode = 'edit';
			this.saveCurrentPlace();
			this.loadItem(localStorage.currentPlaceId);
		} else if (this.checkPath('new')) {
			this.mode = 'new';
			//inputs remain empty
			this.resetData();
		} else if (this.checkPath('view')) {
			this.mode = 'view';
			this.saveCurrentPlace();
			this.loadItem(localStorage.currentPlaceId);
		}
	},
	watch: {
		fields: {
			/* eslint-disable */
			handler() {
				this.changesMade = this.changesMade + 1;
			} /* eslint-enable */,
			deep: true,
		},
		placeTypes: {
			/* eslint-disable */
			handler() {
				this.changesMade = this.changesMade + 1;
			} /* eslint-enable */,
			deep: true,
		},
		fnAssociations: {
			/* eslint-disable */
			handler() {
				this.changesMade = this.changesMade + 1;
			} /* eslint-enable */,
			deep: true,
		},
		fnNames: {
			/* eslint-disable */
			handler() {
				this.changesMade = this.changesMade + 1;
			} /* eslint-enable */,
			deep: true,
		},
		altNames: {
			/* eslint-disable */
			handler() {
				this.changesMade = this.changesMade + 1;
			} /* eslint-enable */,
			deep: true,
		},
	},
	methods: {
		checkPath(word) {
			let path = this.$route.path.split('/');
			if (path[2] == word) {
				return true;
			}
			return false;
		},
		saveCurrentPlace() {
			if (this.$route.params.id) {
				localStorage.currentPlaceId = this.$route.params.id;
			}
			this.placeId = localStorage.currentPlaceId;
		},
		loadItem(id) {
			axios
				.get(`${YTPLACE_URL}/${id}`)
				.then((resp) => {
					this.setPlace(resp.data);
				})
				.catch((error) => console.error(error));
		},
		setPlace(place) {
			this.fields = place.data;
			this.histories = place.relationships.histories.data;
			this.placeTypes = place.relationships.placeTypes.data;
			this.placeTypeNames = this.placeTypes.map((x) => (x = x.placeType));
			this.placeTypes = this.placeTypes.map((x) => (x = x.placeTypeLookupId));
			this.fnNames = place.relationships.fnNames.data;
			this.altNames = place.relationships.altNames.data;
			this.fnAssociations = place.relationships.fnAssociations.data;
			this.infoLoaded = true;
		},
		setPlaceTypeNames() {
			this.placeTypeNames = [];
			for (let on of this.placeTypeOptions) {
				let match = this.placeTypes.filter((n) => n == on.Id);
				if (match.length > 0) {
					this.placeTypeNames.push(on.PlaceType);
				}
			}
		},
		async getPlaceTypeLookup() {
			let data = await catalogs.getPlaceTypes();
			let arr = data.body;
			this.placeTypeOptions = arr;
		},
		resetData() {
			this.fields = {
				id: '',
				name: '',
				locationDesc: '',
				latitude: '',
				longitude: '',
				mapSheet: '',
				notes: '',
				accuracy: '',
			};
			this.photos = [];
			this.placeTypes = [];
			this.fnNames = [];
			this.altNames = [];
			this.histories = [];
			this.fnAssociations = [];
			this.histories = [];
		},
		editMode() {
			// Store the current fields in order to avoid reloading data on cancel edit
			this.mode = 'edit';
			this.$router.push(`/places/edit/${this.fields.name}`);
			this.changesMade = 0;
			//this.resetListVariables();
		},
		selectedImageChanged(val) {
			this.selectedImage = val;
		},
		cancelEdit() {
			this.mode = 'view';
			this.$router.push(`/places/view/${this.fields.name}`);
			this.loadItem(localStorage.currentPlaceId);
		},
		cancelNew() {
			this.$router.push(`/places/`);
		},
		saveChanges() {
			let body = {
				name: this.fields.name,
				locationDesc: this.modifiedMapFields.locationDesc,
				latitude: this.modifiedMapFields.lat,
				longitude: this.modifiedMapFields.long,
				accuracy: this.modifiedMapFields.accuracy,
				mapSheet: this.modifiedMapFields.mapSheet,
				notes: this.fields.notes,
				photos: this.photos,
				placeTypes: this.placeTypes,
				fnNames: this.fnNames,
				altNames: this.altNames,
				histories: this.histories,
				fnAssociations: this.fnAssociations,
			};

			axios
				.put(`${YTPLACE_URL}/${localStorage.currentPlaceId}`, body)
				.then(() => {
					this.mode = 'view';
					this.$router.push(`/places/view/${this.fields.name}`);
					this.setPlaceTypeNames();
					this.$store.commit('alerts/setText', 'Place created');
					this.$store.commit('alerts/setType', 'success');
					this.$store.commit('alerts/setTimeout', 5000);
					this.$store.commit('alerts/setAlert', true);
				})
				.catch(() => {
					let errText = !this.fields.name
						? 'Place name is required'
						: 'Missing required place data';
					this.$store.commit('alerts/setText', errText);
					this.$store.commit('alerts/setType', 'warning');
					this.$store.commit('alerts/setTimeout', 5000);
					this.$store.commit('alerts/setAlert', true);
				});
		},
		createPlace() {
			let body = {
				place: {
					name: this.fields.name,
					notes: this.fields.notes,
				},
				altNames: this.altNames,
				fnNames: this.fnNames,
				fnAssociations: this.fnAssociations,
				placeTypes: this.placeTypes,
			};

			axios
				.post(`${YTPLACE_URL}/`, body)
				.then((resp) => {
					this.mode = 'view';
					this.$router.push(`/places/view/${this.fields.name}`);
					localStorage.currentPlaceId = resp.data.data.id;
					this.placeId = localStorage.currentPlaceId;
					this.loadItem(localStorage.currentPlaceId);
					this.$store.commit('alerts/setText', 'Place updated');
					this.$store.commit('alerts/setType', 'success');
					this.$store.commit('alerts/setTimeout', 5000);
					this.$store.commit('alerts/setAlert', true);
				})
				.catch(() => {
					let errText = !this.fields.name
						? 'Place name is required'
						: 'Missing required place data';
					this.$store.commit('alerts/setText', errText);
					this.$store.commit('alerts/setType', 'warning');
					this.$store.commit('alerts/setTimeout', 5000);
					this.$store.commit('alerts/setAlert', true);
				});
		},
		addName() {
			this.altNames.push({
				alternateName: '',
				placeId: localStorage.currentPlaceId,
				id: null,
			});
		},
		removeName(index) {
			this.altNames.splice(index, 1);
		},
		addFNAssociation() {
			this.fnAssociations.push({
				placeId: localStorage.currentPlaceId,
				fnAssociationType: 1,
				firstNationId: 1,
			});
		},
		removeFNAssociation(index) {
			this.fnAssociations.splice(index, 1);
		},
		addFnName() {
			this.fnNames.push({ placeId: localStorage.currentPlaceId });
		},
		removeFnName(index) {
			this.fnNames.splice(index, 1);
		},
		historicRecordChange() {
			this.changesMade = this.changesMade + 1;
		},
		modifiedDataCoordinates(val) {
			this.modifiedMapFields = val;
			this.changesMade = this.changesMade + 1;
		},
	},
	computed: {
		printData() {
			let printData = this.fields;
			printData.histories = this.histories;
			printData.placeTypes = this.placeTypes;
			printData.placeTypeNames = this.placeTypeNames;
			printData.fnNames = this.fnNames;
			printData.fnAssociations = this.fnAssociations;
			printData.histories = this.histories;
			printData.altNames = this.altNames;
			printData.fnAssociationTypeOptions = this.fnAssociationTypeOptions;
			printData.firstNationOptions = this.firstNationOptions;
			return printData;
		},
	},
};
</script>
