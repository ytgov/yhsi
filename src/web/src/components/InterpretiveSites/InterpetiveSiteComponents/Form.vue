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
					v-if="isView"
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
					:disabled="showSave < 1 || !valid"
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
				<v-form
					lazy-validation
					v-model="valid"
					ref="intSiteForm"
				>
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
												<!-- :rules="notifRules" -->
												<label> Advanced Notification Signs?</label>
												<v-radio-group
													v-model="fields.AdvancedNotification"
													row
												>
													<v-radio
														label="Yes"
														value="Yes"
													></v-radio>
													<v-radio
														label="No"
														value="No"
													></v-radio>
												</v-radio-group>

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
										<Photos
											v-if="true"
											:mode="mode"
											:showDefault="isNew"
											:photoType="'interpretive-sites'"
											:itemId="currentIntSiteID"
											@updateSelectedImage="selectedImageChanged"
											:selectedImage="selectedImage"
											@loadingPhotosChange="loadingPhotosChange"
										/>
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
												dataReady: overlay,
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
									<v-col
										cols="12"
										class="d-flex flex-row"
									>
										<ActionDialog
											:mode="'new'"
											:type="'siteview'"
											:Site="{
												SiteName: fields.SiteName,
												SiteID: fields.SiteID,
											}"
											class="ml-auto mr-1"
											@newAction="newAction"
										/>
									</v-col>
								</v-row>
								<v-row>
									<v-col cols="12">
										<v-data-table
											:headers="actionHeaders"
											:items="fields.actions"
											:items-per-page="5"
											class="elevation-0"
										>
											<template v-slot:item="{ item, index }">
												<tr>
													<td class="parent-row">
														{{ item.ActionDesc }}
													</td>
													<td class="child-row">{{ item.CompletedBy }}</td>
													<td class="child-row">{{ item.Priority }}</td>
													<td class="child-row">
														{{ item.ActionCompleteDate }}
													</td>
													<td class="child-row">{{ item.CompletionDesc }}</td>
													<td class="child-row">
														<ActionDialog
															:mode="'edit'"
															:type="'siteview'"
															:Site="{
																SiteName: fields.SiteName,
																SiteID: fields.SiteID,
															}"
															:dataToEdit="{ item, index }"
															@editAction="editAction"
														/>
													</td>
												</tr>
											</template>
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
									<v-col
										cols="12"
										class="d-flex flex-row"
									>
										<InspectionDialog
											:mode="'new'"
											class="ml-auto mr-1"
											@newInspection="newInspection"
										/>
									</v-col>
								</v-row>
								<v-row>
									<v-col cols="12">
										<v-data-table
											:headers="inspectionHeaders"
											:items="fields.inspections"
											:items-per-page="5"
											class="elevation-0"
										>
											<template v-slot:item="{ item, index }">
												<tr>
													<td class="parent-row">
														{{ item.InspectionDate }}
													</td>
													<td class="child-row">{{ item.Description }}</td>
													<td class="child-row">{{ item.InspectedBy }}</td>
													<td class="child-row">
														<InspectionDialog
															:mode="'edit'"
															:type="'siteview'"
															:Site="{
																SiteName: fields.SiteName,
																SiteID: fields.SiteID,
															}"
															:dataToEdit="{ item, index }"
															@editAction="editAction"
														/>
													</td>
												</tr>
											</template>
										</v-data-table>
									</v-col>
								</v-row>
							</v-expansion-panel-content>
						</v-expansion-panel>
					</v-expansion-panels>
				</v-form>
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
import InspectionDialog from '../Dialogs/InspectionDialog.vue';
import ActionDialog from '../Dialogs/ActionDialog.vue';
import MapLoader from '../../MapLoader.vue';
import Photos from '../../PhotoEditor/Photos';
import countries from '../../../misc/countries';
export default {
	name: 'IntSiteComponent',
	components: {
		Breadcrumbs,
		MapLoader,
		InspectionDialog,
		ActionDialog,
		Photos,
	},
	data: () => ({
		username: 'username',
		//form
		valid: false,
		panel: [0, 1, 2, 3, 4],
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
			{ text: 'Action Required', value: 'ActionDesc' },
			{ text: 'To be Completed by', value: 'CompletedBy' },
			{ text: 'Priority', value: 'Priority' },
			{ text: 'Completed date', value: 'ActionCompleteDate' },
			{ text: 'Completion Notes', value: 'CompletionDesc' },
		],
		inspectionHeaders: [
			{ text: 'Inspection Date', value: 'InspectionDate' },
			{ text: 'Description', value: 'Description' },
			{ text: 'Inspected by', value: 'InspectedBy' },
			{ text: '', value: 'actions' },
		],
		assetHeaders: [
			{ text: 'Category', value: 'Category' },
			{ text: 'Type', value: 'Type' },
			{ text: 'Size', value: 'Size' },
			{ text: 'Sign Text', value: 'SignText' },
			{ text: 'Description', value: 'Description' },
			{ text: 'Maintained', value: 'Maintained' },
			{ text: 'Install Date', value: 'InstallDate' },
			{ text: 'Status', value: 'Status' },
		],
		//rules
		notifRules: [
			(v) => !!v || 'Required.',
			(v) => v.length <= 7 || 'Length must be less than 7 characters',
		],

		routes: [],
		modifiedMapFields: {},
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
		resetValidation() {
			this.$refs.sForm.reset();
		},
		noData() {
			this.fields = {
				SiteName: '',
				EstablishedYear: '',
				Maintainer: '',
				NotificationDesc: '',
				AdvancedNotification: '',
				LocationDesc: '',
				RouteName: '',
				KMNum: '',
				MapSheet: '',
				Latitude: '',
				Longitude: '',
				//lists
				inspections: [],
				actions: [],
				assets: [],
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
		modifiedDataCoordinates(val) {
			this.modifiedMapFields = val;
			this.showSave = this.showSave + 1;
		},
		selectedImageChanged(val) {
			this.selectedImage = val;
		},
		loadingPhotosChange(val) {
			this.loadingPhotos = val;
		},
		async saveChanges() {
			this.overlay = true;
			let {
				SiteName,
				EstablishedYear,
				//Maintainer,
				NotificationDesc,
				AdvancedNotification,
				//lists
				inspections,
				actions,
				assets,
			} = this.fields;
			let { LocationDesc, RouteName, KMNum, MapSheet, lat, long } =
				this.modifiedMapFields;
			const item = {
				SiteName,
				EstablishedYear,
				//Maintainer,
				NotificationDesc,
				AdvancedNotification,
				LocationDesc,
				RouteName,
				KMNum,
				MapSheet,
				Latitude: lat,
				Longitude: long,
			};
			const data = {
				item,
				inspections,
				actions,
				assets,
			};
			//console.log(JSON.stringify(data));

			if (this.isNew) {
				await interpretiveSites.post(data);
			} else {
				await interpretiveSites.put(localStorage.currentIntSiteID, data);
			}
			this.overlay = false;
			this.$router.push({ name: 'InterpretiveSitesGrid' });
			this.$router.go();
		},
		newAction(val) {
			this.fields.actions.push(val);
		},
		editAction() {},
		newInspection(val) {
			this.fields.inspections.push(val);
		},
		newAsset(val) {
			this.fields.assets.push(val);
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
