<template>
	<v-container fluid>
		<h3>Interpretvie Site Information</h3>
		<Breadcrumbs />
		<v-row>
			<v-col
				cols="12"
				class="d-flex"
			>
				<div class="d-flex mb-2">
					<h1 class="mt-auto mb-auto">{{ fields.SiteName }}</h1>
				</div>
				<v-spacer></v-spacer>
				<!-- buttons for the view state -->
				<v-btn
					class="black--text mx-1"
					@click="editMode"
					v-if="isView"
				>
					<v-icon class="mr-1">mdi-pencil</v-icon>
					Edit
				</v-btn>
				<v-btn
					class="black--text mx-1"
					@click="downloadPdf"
					:loading="loadingPdf"
				>
					<v-icon class="mr-1">mdi-printer</v-icon>
					Print
				</v-btn>
				<!-- buttons for the edit state -->
				<v-btn
					class="black--text mx-1"
					@click="cancelEdit"
					v-if="isEdit"
				>
					<v-icon>mdi-close</v-icon>
					Cancel
				</v-btn>
				<v-btn
					color="success"
					:disabled="showSave < 1"
					v-if="!isView"
					@click="saveChanges"
				>
					<v-icon class="mr-1">mdi-check</v-icon>
					Done
				</v-btn>
			</v-col>
		</v-row>
		<v-row>
			<v-col cols="12">
				<v-expansion-panels
					v-model="panel"
					multiple
				>
					<v-expansion-panel>
						<v-expansion-panel-header>
							<h2>Site Information</h2>
						</v-expansion-panel-header>
						<v-expansion-panel-content>
							<v-row>
								<v-col cols="8">
									<v-row>
										<v-col cols="6">
											<v-text-field
												name="SiteName"
												label="Site Name"
												outlined
												dense
												v-model="fields.SiteName"
												:readonly="isView"
											></v-text-field>
											<v-text-field
												name="EstablishedYear"
												label="Established Year"
												outlined
												dense
												v-model="fields.EstablishedYear"
												:readonly="isView"
											></v-text-field>
											<v-text-field
												name="MaintainedBy"
												label="Maintained"
												outlined
												dense
												v-model="fields.SiteName"
												:readonly="isView"
											></v-text-field>
										</v-col>
										<v-col cols="6">
											<v-text-field
												name="NotificationSigns"
												outlined
												dense
												label="Advanced notification signs"
												v-model="fields.AdvancedNotification"
												:readonly="isView"
											></v-text-field>
											<v-textarea
												name="NotificationDesc"
												outlined
												dense
												label="Advanced Notification Description"
												:readonly="isView"
												v-model="fields.NotificationDesc"
											></v-textarea>
										</v-col>
									</v-row>
								</v-col>
								<v-col cols="4">
									<h4>Photos</h4>
									<!-- <Photos 
                          v-if="true" 
                          :showDefault="isNew" 
                          :photoType="'burial'"
                          :itemId="currentIntSiteID"
                          @updateSelectedImage="selectedImageChanged" 
                          :selectedImage="selectedImage" 
                          @loadingPhotosChange="loadingPhotosChange"/>    -->
								</v-col>
							</v-row>
						</v-expansion-panel-content>
					</v-expansion-panel>
					<v-expansion-panel>
						<v-expansion-panel-header>
							<h2>Location</h2>
						</v-expansion-panel-header>
						<v-expansion-panel-content>
							<v-row>
								<v-col cols="12">
									<MapLoader
										v-if="true"
										:mode="mode"
										:mapType="'intSite'"
										@modifiedDataCoordinates="modifiedDataCoordinates"
										:fields="{
											RouteName: fields.RouteName,
											KMNum: fields.KMNum,
											LocationDesc: fields.LocationDesc,
											lat: fields.Latitude,
											long: fields.Longitude,
											MapSheet: fields.MapSheet,
										}"
									/>
								</v-col>
							</v-row>
						</v-expansion-panel-content>
					</v-expansion-panel>
					<v-expansion-panel v-if="!isNew">
						<v-expansion-panel-header>
							<h2>Assets</h2>
						</v-expansion-panel-header>
						<v-expansion-panel-content>
							<v-row>
								<v-col cols="12">
									<v-data-table
										:headers="assetHeaders"
										:items="fields.assets"
										:items-per-page="5"
										class="elevation-0"
									>
										<!-- <template v-slot:item="{ item, index }">
                            <tr v-if="item.deleted != true">
                                <td class="parent-row">{{ item.Name }}</td>
                                <td class="child-row">{{ item.Location }}</td>
                                <td class="child-row">{{ item.Quantity }}</td>
                                <td class="child-row">{{ item.Relationship }}</td>
                                <td class="child-row">
                                  <div class="d-flex flex-row">
                                    <KinDialog v-if="!isView" :mode="'edit'" :data="relationships" @editKinship="editKinship" :kinToEdit="{ index, Kinship: item}"/>
                                    <v-tooltip bottom v-if="!isView">
                                        <template v-slot:activator="{ on, attrs }">
                                                <v-btn 
                                                v-bind="attrs"
                                                v-on="on"
                                                icon class="grey--text text--darken-2"  @click="deleteKinship(index)">
                                                    <v-icon
                                                    small
                                                    >mdi-trash-can</v-icon>  
                                                </v-btn>
                                        </template>
                                        <span>Delete</span>
                                    </v-tooltip>
                                  </div>
                                </td>   
                            </tr>            
                          </template>   -->
									</v-data-table>
								</v-col>
							</v-row>
						</v-expansion-panel-content>
					</v-expansion-panel>
					<v-expansion-panel v-if="!isNew">
						<v-expansion-panel-header>
							<h2>Actions</h2>
						</v-expansion-panel-header>
						<v-expansion-panel-content>
							<v-row>
								<v-col cols="12">
									<v-data-table
										:headers="actionHeaders"
										:items="fields.actions"
										:items-per-page="5"
										class="elevation-0"
									>
										<!-- <template v-slot:item="{ item, index }">
                            <tr v-if="item.deleted != true">
                                <td class="parent-row">{{ item.Name }}</td>
                                <td class="child-row">{{ item.Location }}</td>
                                <td class="child-row">{{ item.Quantity }}</td>
                                <td class="child-row">{{ item.Relationship }}</td>
                                <td class="child-row">
                                  <div class="d-flex flex-row">
                                    <KinDialog v-if="!isView" :mode="'edit'" :data="relationships" @editKinship="editKinship" :kinToEdit="{ index, Kinship: item}"/>
                                    <v-tooltip bottom v-if="!isView">
                                        <template v-slot:activator="{ on, attrs }">
                                                <v-btn 
                                                v-bind="attrs"
                                                v-on="on"
                                                icon class="grey--text text--darken-2"  @click="deleteKinship(index)">
                                                    <v-icon
                                                    small
                                                    >mdi-trash-can</v-icon>  
                                                </v-btn>
                                        </template>
                                        <span>Delete</span>
                                    </v-tooltip>
                                  </div>
                                </td>   
                            </tr>            
                          </template>   -->
									</v-data-table>
								</v-col>
							</v-row>
						</v-expansion-panel-content>
					</v-expansion-panel>
					<v-expansion-panel>
						<v-expansion-panel-header>
							<h2>Inspections</h2>
						</v-expansion-panel-header>
						<v-expansion-panel-content>
							<v-row>
								<v-col cols="12">
									<v-data-table
										:headers="inspectionHeaders"
										:items="fields.inspections"
										:items-per-page="5"
										class="elevation-0"
									>
										<!-- <template v-slot:item="{ item, index }">
                            <tr v-if="item.deleted != true">
                                <td class="parent-row">{{ item.Name }}</td>
                                <td class="child-row">{{ item.Location }}</td>
                                <td class="child-row">{{ item.Quantity }}</td>
                                <td class="child-row">{{ item.Relationship }}</td>
                                <td class="child-row">
                                  <div class="d-flex flex-row">
                                    <KinDialog v-if="!isView" :mode="'edit'" :data="relationships" @editKinship="editKinship" :kinToEdit="{ index, Kinship: item}"/>
                                    <v-tooltip bottom v-if="!isView">
                                        <template v-slot:activator="{ on, attrs }">
                                                <v-btn 
                                                v-bind="attrs"
                                                v-on="on"
                                                icon class="grey--text text--darken-2"  @click="deleteKinship(index)">
                                                    <v-icon
                                                    small
                                                    >mdi-trash-can</v-icon>  
                                                </v-btn>
                                        </template>
                                        <span>Delete</span>
                                    </v-tooltip>
                                  </div>
                                </td>   
                            </tr>            
                          </template>   -->
									</v-data-table>
								</v-col>
							</v-row>
						</v-expansion-panel-content>
					</v-expansion-panel>
				</v-expansion-panels>
			</v-col>
		</v-row>
		<v-overlay :value="overlay">
			<v-progress-circular
				indeterminate
				size="64"
			></v-progress-circular>
		</v-overlay>
	</v-container>
</template>

<script>
import Breadcrumbs from '../../Breadcrumbs';
import interpretiveSites from '../../../controllers/interpretive-sites';
import catalogs from '../../../controllers/catalogs';
// import MembershipDialog from "./Dialogs/MembershipDialog.vue";
// import OccupationDialog from "./Dialogs/OccupationDialog.vue";
// import SourceDialog from "./Dialogs/SourceDialog.vue";
// import KinDialog from "./Dialogs/KinDialog.vue";
// import SiteVisitDialog from "./Dialogs/SiteVisitDialog.vue";
import MapLoader from '../../MapLoader.vue';
// import Photos from "../../PhotoEditor/Photos";
import countries from '../../../misc/countries';
export default {
	name: 'BurialComponent',
	components: {
		Breadcrumbs,
		MapLoader,
		// MembershipDialog,
		// OccupationDialog,
		// SiteVisitDialog,
		// KinDialog,
		// SourceDialog,
		//Photos
	},
	data: () => ({
		username: 'username',
		panel: [0, 1, 2, 3],
		overlay: false,
		items: null,
		selectedItem: null,
		mode: null,
		/* VALIDATION*/
		dataAccessValidation: false,
		rules: [(value) => !!value || 'Required.'],
		/* FIELDS*/
		fields: {},
		fieldsHistory: null,
		menu: false,
		menu2: false,
		showSave: 0,
		actionHeaders: [
			{ text: 'Action Required', value: 'Membership' },
			{ text: 'To be Completed by', value: 'Chapter' },
			{ text: 'Priority', value: 'Notes' },
			{ text: 'Completed date', value: 'actions' },
			{ text: 'Completion Notes', value: 'actions' },
		],
		inspectionHeaders: [
			{ text: 'Inspection Date', value: 'Inscription' },
			{ text: 'Description', value: 'MarkerDescription' },
			{ text: 'Inspected by', value: 'Condition' },
			{ text: 'Actions', value: 'RecordedBy' },
		],
		assetHeaders: [
			{ text: 'Category', value: 'Category' },
			{ text: 'Type', value: 'Type' },
			{ text: 'Size', value: 'Size' },
			{ text: 'Sign Text', value: 'SignText' },
			{ text: 'Description', value: 'Description' },
			{ text: 'Maintained', value: 'Maintained' },
			{ text: 'Install Date', value: 'InstallDate' },
			{ text: 'Active', value: 'Status' },
		],
		routes: [],
		//photos
		selectedImage: null,
		loadingPhotos: false,
		infoLoaded: false,
		loadingPdf: false,
	}),
	mounted() {
		if (this.checkPath('edit')) {
			this.mode = 'edit';
			//after this, the fields get filled with the info obtained from the api
			this.getDataFromApi();
		} else if (this.checkPath('view')) {
			this.mode = 'view';
			//after this, the fields get filled with the info obtained from the api
			this.getDataFromApi();
		} else {
			this.mode = 'new';
			this.noData();
		}
		//console.log(countries);
	},
	methods: {
		/*this function checks if the current path contains a specific word, this can be done with a simple includes but 
    //it causes confusion when a boat or owner has 'new' in its name, leading the component to think it should use the 'new' mode,
    this problem is solved by using this funtion.*/
		checkPath(word) {
			let path = this.$route.path.split('/');
			// //console.log(path);
			if (path[2] == word) {
				return true;
			}
			return false;
		},
		modifiedDataCoordinates() {},
		resetValidation() {
			this.$refs.sForm.reset();
		},
		noData() {
			this.fields = {
				//information section
				FirstName: '',
				LastName: '',
				OriginCountry: '',
				OriginState: '',
				OriginCity: '',
				BirthDate: '',
				DeathDate: '',
				Age: '',
				//history section
				Religion: '',
				Occupations: [],
				Memberships: [],
				Gender: '',
				Notes: '',
				//Death
				Manner: '',
				Cause: '',
				FuneralPaidBy: '',
				Sources: [],
				Kinships: [],
				//Burial
				BuriedInYukon: '',
				BodyShipped: '',
				BurialLocation: '',
				Other: '',
				PlotDescription: '',
				CemetaryID: '',
				Cemetary: '',
				SiteVisits: [],
			};
		},
		saveCurrentIntSiteID() {
			localStorage.currentIntSiteID = this.$route.params.id;
		},
		async getDataFromApi() {
			this.overlay = true;
			if (this.$route.params.id) {
				this.saveCurrentIntSiteID();
			}
			this.fields = await interpretiveSites.getById(
				localStorage.currentIntSiteID
			);
			this.routes = await catalogs.getRoutes();
			console.log(this.routes);
			// this.fields = await burials.getById(localStorage.currentBurialID);
			// this.cemetaries = await catalogs.getCemetaries();
			// this.causes = await catalogs.getCauses();
			// this.religions = await catalogs.getReligions();
			// this.occupations = await catalogs.getOccupations();
			// this.memberships = await catalogs.getMemberships();
			// this.relationships = await catalogs.getRelationships();
			console.log(this.fields);
			this.overlay = false;
		},
		viewMode() {
			this.mode = 'view';
			this.$router.push(
				`/interpretive-sites/view/${localStorage.currentIntSiteID}`
			);
		},
		editMode() {
			this.fieldsHistory = { ...this.fields };
			this.mode = 'edit';
			this.$router.push(
				`/interpretive-sites/edit/${localStorage.currentIntSiteID}`
			);
			this.showSave = 0;
		},
		cancelEdit() {
			if (this.fieldsHistory) {
				this.fields = { ...this.fieldsHistory };
			}
			this.mode = 'view';
			//this.resetListVariables();
			this.$router.push(
				`/interpretive-sites/view/${localStorage.currentIntSiteID}`
			);
		},
		selectedImageChanged(val) {
			this.selectedImage = val;
		},
		loadingPhotosChange(val) {
			this.loadingPhotos = val;
		},
		async saveChanges() {
			this.overlay = true;
			//console.log(this.fields);
			// let {
			// 	Age,
			// 	BirthDateNotes,
			// 	BirthDay,
			// 	BirthMonth,
			// 	BirthYear,
			// 	Memberships,
			// 	SiteVisits,
			// 	Kinships,
			// 	DeathDateNotes,
			// 	DeathDay,
			// 	DeathMonth,
			// 	DeathYear,
			// 	DestinationShipped,
			// 	FirstName,
			// 	FuneralPaidBy,
			// 	Gender,
			// 	GenderOther,
			// 	LastName,
			// 	Manner,
			// 	Occupations,
			// 	Sources,
			// 	OriginCity,
			// 	OriginCountry,
			// 	OriginState,
			// 	OtherCemetaryDesc,
			// 	OtherCountry,
			// 	PersonNotes,
			// 	PlotDescription,
			// 	ShippedIndicator,
			// 	Cause,
			// 	Cemetary,
			// 	Religion,
			// } = this.fields;
			// //BurialID
			// const burial = {
			// 	Age,
			// 	BirthDateNotes,
			// 	BirthDay,
			// 	BirthMonth,
			// 	BirthYear,
			// 	DeathDateNotes,
			// 	DeathDay,
			// 	DeathMonth,
			// 	DeathYear,
			// 	DestinationShipped,
			// 	FirstName,
			// 	FuneralPaidBy,
			// 	Gender,
			// 	GenderOther,
			// 	LastName,
			// 	Manner,
			// 	OriginCity,
			// 	OriginCountry,
			// 	OriginState,
			// 	OtherCemetaryDesc,
			// 	OtherCountry,
			// 	PersonNotes,
			// 	PlotDescription,
			// 	ShippedIndicator,
			// 	//Ids directly on the burial table
			// 	CauseID: Cause.CauseLUpID,
			// 	CemetaryID: Cemetary.CemetaryLUpID,
			// 	ReligionID: Religion.ReligionLUpID,
			// };
			// ////console.log(data);
			// const data = {
			// 	burial,
			// 	Memberships,
			// 	SiteVisits,
			// 	Kinships,
			// 	Sources,
			// 	Occupations,
			// };
			//console.log(JSON.stringify(data));

			// if (this.isNew) {
			// 	await burials.post(data);
			// } else {
			// 	await burials.put(localStorage.currentBurialID, data);
			// }
			this.overlay = false;
			this.$router.push({ name: 'BurialsGrid' });
			this.$router.go();
		},
		newOccupation(val) {
			this.fields.Occupations.push(val);
		},
		deleteOccupation(index) {
			if (index > -1) {
				let val = this.fields.Occupations[index];
				val.deleted = true;
				this.$set(this.fields.Occupations, index, val);
			}
		},
		editOccupation(val, index) {
			////console.log(val, index);
			if (this.isNew) {
				delete val.edit;
				val.new = true;
			}
			this.$set(this.fields.Occupations, index, val);
		},
		newKinship(val) {
			this.fields.Kinships.push(val);
		},
		editKinship(val, index) {
			////console.log(val, index);
			if (this.isNew) {
				delete val.edit;
				val.new = true;
			}
			this.$set(this.fields.Kinships, index, val);
		},
		deleteKinship(index) {
			if (index > -1) {
				let val = this.fields.Kinships[index];
				val.deleted = true;
				this.$set(this.fields.Kinships, index, val);
			}
		},
		newMembership(val) {
			////console.log(val);
			this.fields.Memberships.push(val);
		},
		editMembership(val, index) {
			// //console.log(val, index);
			if (this.isNew) {
				delete val.edited;
				val.new = true;
			}
			this.$set(this.fields.Memberships, index, val);
		},
		deleteMembership(index) {
			//console.log(index);
			if (index > -1) {
				let val = this.fields.Memberships[index];
				val.deleted = true;
				this.$set(this.fields.Memberships, index, val);
			}
		},
		newSiteVisit(val) {
			this.fields.SiteVisits.push(val);
		},
		editSiteVisit(val, index) {
			////console.log(val, index);
			if (this.isNew) {
				delete val.edit;
				val.new = true;
			}
			this.$set(this.fields.SiteVisits, index, val);
		},
		deleteSiteVisit(index) {
			if (index > -1) {
				let val = this.fields.SiteVisits[index];
				val.deleted = true;
				this.$set(this.fields.SiteVisits, index, val);
			}
		},
		newSource(val) {
			this.fields.Sources.push(val);
		},
		editSource(val, index) {
			////console.log(val, index);
			if (this.isNew) {
				delete val.edit;
				val.new = true;
			}
			this.$set(this.fields.Sources, index, val);
		},
		deleteSource(index) {
			if (index > -1) {
				let val = this.fields.Sources[index];
				val.deleted = true;
				this.$set(this.fields.Sources, index, val);
			}
		},
		save(date) {
			this.$refs.menu.save(date);
		},
		formatDate(date) {
			if (!date) return null;
			//date = date.substr(0, 10);
			const [year, month, day] = date.split('-');
			return `${month}/${day}/${year}`;
		},
		async downloadPdf() {
			this.loadingPdf = true;
			// let res = await burials.getPdf(parseInt(localStorage.currentIntSiteID));
			// let blob = new Blob([res], { type: 'application/octetstream' });
			// let url = window.URL || window.webkitURL;
			// let link = url.createObjectURL(blob);
			// let a = document.createElement('a');
			// a.setAttribute('download', 'Burials.pdf');
			// a.setAttribute('href', link);
			// document.body.appendChild(a);
			// a.click();
			// document.body.removeChild(a);
			this.loadingPdf = false;
		},
	},
	computed: {
		isEditable() {
			return this.mode == 'edit' ? true : false;
		},
		param() {
			return this.$route.params.id;
		},
		serviceEnd() {
			return this.formatDate(this.fields.ServiceEnd);
		},
		availableDataAccess() {
			return this.dataAccessOptions.filter(
				(x) => !this.sites.some((item) => item.dataAccess === x)
			);
		},
		filteredOccupations() {
			return this.occupations.filter(
				(x) => !this.fields.Occupations.some((item) => item === x)
			);
		},
		filteredMemberships() {
			return this.memberships.filter(
				(x) =>
					!this.fields.Memberships.some(
						(item) => item.MembershipLUpID === x.MembershipLUpID
					)
			);
		},
		isView() {
			return this.mode == 'view';
		},
		isEdit() {
			return this.mode == 'edit';
		},
		isNew() {
			return this.mode == 'new';
		},
		currentIntSiteID() {
			if (this.mode == 'new') return false;

			return localStorage.currentIntSiteID;
		},
		getCountries() {
			return countries;
		},
	},
	watch: {
		fields: {
			handler() {
				this.showSave = this.showSave + 1;
			},
			deep: true,
		},
	},
};
</script>

<style scoped>
.list-menu {
	padding: 0px 8px 0px 0px;
}
.card-text {
	color: #000; /* Fallback for older browsers */
	color: rgba(0, 0, 0, 0.5);
}
</style>
