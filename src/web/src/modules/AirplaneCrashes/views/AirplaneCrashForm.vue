<template>
	<div>
		<h3>Airplane Crash Sites</h3>
		<Breadcrumbs />

		<v-row>
			<v-col
				cols="12"
				class="d-flex"
			>
				<h1 v-if="isViewingCrash">
					{{ fields.yacsinumber }} {{ fields.aircrafttype }} ({{
						fields.aircraftregistration
					}})
				</h1>
				<h1 v-else-if="isEditingCrash">Edit: {{ this.crashID }}</h1>
				<h1 v-else>New Crash Site</h1>
				<v-spacer></v-spacer>

				<!-- buttons for the view state -->
				<v-btn
					v-if="isViewingCrash && canEdit"
					class="mx-1"
					color="primary"
					@click="editMode"
				>
					<v-icon class="mr-1">mdi-pencil</v-icon>
					Edit
				</v-btn>

				<v-btn
					v-if="isViewingCrash"
					class="mx-1"
					color="info"
					:loading="loadingPdf"
					@click="downloadPdf"
				>
					<v-icon class="mr-1">mdi-printer</v-icon>
					Print
				</v-btn>
				<!-- buttons for the edit state -->
				<v-btn
					class="black--text mx-1"
					@click="cancelEdit()"
					v-if="isEditingCrash"
				>
					<v-icon>mdi-close</v-icon>
					Cancel
				</v-btn>
				<v-btn
					color="success"
					:disabled="showSave < 1 || yacsiWarning.length == 1 || !formValid"
					v-if="isEditingCrash"
					@click="saveChanges"
				>
					<v-icon class="mr-1">mdi-check</v-icon>
					Save
				</v-btn>
				<!-- buttons for the new state -->
				<v-btn
					class="black--text mx-1"
					@click="cancelNew"
					v-if="action == 'new'"
				>
					<v-icon>mdi-close</v-icon>
					Cancel
				</v-btn>
				<v-btn
					color="success"
					:disabled="showSave < 1 || yacsiWarning.length == 1"
					v-if="action == 'new'"
					@click="saveChanges"
				>
					<v-icon class="mr-1">mdi-check</v-icon>
					Create Crash Site
				</v-btn>
			</v-col>
		</v-row>
		<!-- General fields -->
		<v-form v-model="formValid">
			<v-row>
				<v-col cols="7">
					<v-row>
						<v-col>
							<!-- YASCI number -->
							<v-text-field
								outlined
								dense
								label="YASCI number"
								v-model="fields.yacsinumber"
								:readonly="isViewingCrash"
								:error-messages="yacsiWarning"
								@blur="validateYACSI()"
							></v-text-field>
						</v-col>
						<v-col>
							<!-- Aircraft Maker -->
							<v-text-field
								outlined
								dense
								label="Aircraft Make/Model"
								v-model="fields.aircrafttype"
								:readonly="isViewingCrash"
							></v-text-field>
						</v-col>
						<v-col>
							<!-- Aircraft Registration -->
							<v-text-field
								outlined
								dense
								label="Aircraft Registration"
								v-model="fields.aircraftregistration"
								:readonly="isViewingCrash"
							></v-text-field>
						</v-col>
					</v-row>
					<v-row>
						<v-col cols="6">
							<v-row>
								<v-col cols="6">
									<!-- Crash Date -->
									<v-menu
										ref="menu"
										v-model="menu"
										:close-on-content-click="false"
										:return-value.sync="fields.crashdate"
										transition="scale-transition"
										offset-y
										min-width="auto"
										:disabled="isViewingCrash"
									>
										<template v-slot:activator="{ on, attrs }">
											<v-text-field
												outlined
												dense
												v-model="crashdate"
												label="Crash Date"
												append-icon="mdi-calendar"
												readonly
												v-bind="attrs"
												v-on="on"
											></v-text-field>
										</template>
										<v-date-picker
											v-model="fields.crashdate"
											no-title
											scrollable
										>
											<v-spacer></v-spacer>
											<v-btn
												text
												color="primary"
												@click="menu = false"
											>
												Cancel
											</v-btn>
											<v-btn
												text
												color="primary"
												@click="$refs.menu.save(fields.crashdate)"
											>
												OK
											</v-btn>
										</v-date-picker>
									</v-menu>
								</v-col>
								<v-col cols="6">
									<v-select
										outlined
										dense
										v-model="fields.datedescriptor"
										:items="dateDescriptorOptions"
										:readonly="isViewingCrash"
										label="Date Descriptor"
									></v-select>
								</v-col>
							</v-row>
							<v-row>
								<v-col cols="12">
									<v-text-field
										outlined
										dense
										v-model="fields.datenote"
										label="Date Note"
										:readonly="isViewingCrash"
									></v-text-field>
								</v-col>
							</v-row>
						</v-col>
						<v-col cols="6">
							<v-row>
								<v-col cols="6">
									<h4>Country of Registration</h4>
									<v-checkbox
										label="Canadian"
										value="Canadian"
										class="mt-1 mb-0"
										hide-details
										v-model="fields.nation"
										:readonly="isViewingCrash"
									></v-checkbox>
									<v-checkbox
										label="American"
										value="American"
										class="my-0"
										hide-details
										v-model="fields.nation"
										:readonly="isViewingCrash"
									></v-checkbox>
									<v-checkbox
										label="Other"
										class="my-0"
										v-model="otherNation"
										@click="changeNation"
										:readonly="isViewingCrash"
									></v-checkbox>
									<v-text-field
										outlined
										dense
										v-if="otherNation"
										v-model="fields.nation"
										label="Other"
										:readonly="isViewingCrash"
									></v-text-field>
								</v-col>
								<v-col cols="6">
									<h4>Registration Type</h4>
									<v-checkbox
										label="Civilian"
										value="Civilian"
										class="mt-1 mb-0"
										hide-details
										v-model="fields.militarycivilian"
										:readonly="isViewingCrash"
									></v-checkbox>
									<v-checkbox
										label="Military"
										value="Military"
										class="my-0"
										hide-details
										v-model="fields.militarycivilian"
										:readonly="isViewingCrash"
									></v-checkbox>
								</v-col>
							</v-row>
						</v-col>
					</v-row>
					<v-row>
						<v-col cols="12">
							<v-alert
								outlined
								color="primary"
							>
								<div class="sub-title">Pilot</div>
								<v-row>
									<v-col>
										<v-text-field
											outlined
											dense
											v-model="fields.pilotfirstname"
											label="First Name"
											:readonly="isViewingCrash"
										></v-text-field>
									</v-col>
									<v-col>
										<v-text-field
											outlined
											dense
											v-model="fields.pilotlastname"
											label="Last Name"
											:readonly="isViewingCrash"
										></v-text-field>
									</v-col>
									<v-col>
										<v-text-field
											outlined
											dense
											v-model="fields.pilotrank"
											label="Rank"
											:readonly="isViewingCrash"
										></v-text-field>
									</v-col>
								</v-row>
							</v-alert>
						</v-col>
					</v-row>
				</v-col>
				<!-- <v-col cols="5">
                        <v-col cols="12"> -->
				<!-- Photos component, it includes a carousel and some dialogs for the button actions -->
				<!-- <Photos
                            v-if="infoLoaded"
                            :showDefault="isNewCrash"
                            :yacsiNumber="getYACSINumber"
                            @updateSelectedImage="selectedImageChanged"
                            @loadingPhotosChange="loadingPhotosChange"/>
                            </v-row>
                        </v-alert>

                    </v-col>
                </v-row>
            </v-col> -->
				<v-col cols="5">
					<v-col cols="12">
						<!-- Photos component, it includes a carousel and some dialogs for the button actions -->
						<Photos
							:showDefault="isNewCrash"
							:mode="action"
							:photoType="'aircrash'"
							:itemId="getYACSINumber"
							@updateSelectedImage="selectedImageChanged"
							:selectedImage="selectedImage"
						/>
					</v-col>
				</v-col>
			</v-row>

			<MapLoader
				:mode="action"
				:mapType="'planeCrash'"
				:airCrashLocation.sync="crashMapData"
			/>
			<!-- <MapLoader
				:mode="action"
				:mapType="'planeCrash'"
				@modifiedDataCoordinates="modifiedDataCoordinates"
				@update:airCrashLocation="updateAirCrashLocation()"
				:airCrashLocation.sync="crashMapData"
			/> -->

			<v-row>
				<v-col col="6">
					<v-row>
						<v-col>
							<v-text-field
								outlined
								dense
								v-model.number="fields.remainsonsite"
								label="Remains on Site"
								:readonly="isViewingCrash"
								:rules="numberRules"
							></v-text-field>
							<v-textarea
								outlined
								dense
								rows="5"
								class="mt-0 pt-0"
								v-model="fields.extentofremainsonsite"
								label="Extent of Remains on Site"
								:readonly="isViewingCrash"
							></v-textarea>
						</v-col>
						<v-col>
							<v-textarea
								outlined
								dense
								rows="7"
								v-model="fields.otherlocationsofremains"
								label="Other Location of Remains"
								:readonly="isViewingCrash"
							></v-textarea>
						</v-col>
					</v-row>
				</v-col>
				<v-col col="6">
					<v-row>
						<v-col cols="3">
							<v-text-field
								outlined
								dense
								v-model="fields.soulsonboard"
								label="Souls on Board"
								:readonly="isViewingCrash"
								:rules="numberRules"
							></v-text-field>
							<v-text-field
								outlined
								dense
								v-model="fields.injuries"
								label="Injuries"
								:readonly="isViewingCrash"
								:rules="numberRules"
							></v-text-field>
							<v-text-field
								outlined
								dense
								v-model="fields.fatalities"
								label="Fatalities"
								:readonly="isViewingCrash"
								:rules="numberRules"
							></v-text-field>
						</v-col>
						<v-col cols="9">
							<v-textarea
								rows="7"
								outlined
								dense
								v-model="fields.descriptionofcrashevent"
								label="Description of Crash Event"
								:readonly="isViewingCrash"
							></v-textarea>
						</v-col>
					</v-row>
				</v-col>
			</v-row>
			<!-- Additional information -->
			<v-row>
				<v-col cols="12">
					<v-textarea
						outlined
						dense
						v-model="fields.comments"
						label="Additional Information"
						:readonly="isViewingCrash"
					></v-textarea>
				</v-col>
			</v-row>
			<v-row>
				<v-col cols="5">
					<!-- Info Sources -->
					<info-sources :action="action" />
				</v-col>
				<v-col cols="7">
					<v-textarea
						outlined
						dense
						label="Significance of Aircraft"
						v-model="fields.significanceofaircraft"
						:readonly="isViewingCrash"
					></v-textarea>
				</v-col>
			</v-row>
		</v-form>

		<v-overlay :value="overlay">
			<v-progress-circular
				indeterminate
				size="64"
			></v-progress-circular>
		</v-overlay>

		<v-dialog
			v-model="dataDialog"
			max-width="490"
		>
			<v-card>
				<v-card-title class="text-h5">
					Double check your field data
				</v-card-title>
				<v-card-text
					>Make sure your YACSI number has not been entered previously, The
					YACSI number must be unique.</v-card-text
				>
				<v-card-actions>
					<v-btn
						color="green darken-1"
						text
						@click="dataDialog = false"
					>
						Ok
					</v-btn>
				</v-card-actions>
			</v-card>
		</v-dialog>
	</div>
</template>

<script>
import { AirCrashLocation } from '../models/AircrashModels';
import Breadcrumbs from '@/components/Breadcrumbs.vue';
import Photos from '@/components/PhotoEditor/Photos';
import aircrash from '@/controllers/aircrash';
import MapLoader from '../components/MapLoader';
import _ from 'lodash';
import { mapActions, mapGetters, mapState } from 'vuex';
import InfoSources from '../components/InfoSources';
export default {
	name: 'crashForm',
	components: { Photos, Breadcrumbs, MapLoader, InfoSources },
	props: {
		action: {
			type: String,
			default: 'view',
		},
		name: {
			type: String,
			default: '',
		},
		crashID: {
			type: String,
			default: 'noCrashID',
		},
	},
	data: () => ({
		overlay: false,
		//helper vars used for the name list functions

		//helper vars, they are used to determine if the component is in an edit, view or add new state
		mode: '',
		edit: false,
		showSave: 0,
		//input fields, datatable, etc
		menu: '',
		activePicker: null,
		fields: {},
		fieldsHistory: null,
		// vessel typle select options
		vesselTypeOptions: ['Launch', 'Sternwheeler', 'Ferry', 'Barge'],
		dateFormatted: '',
		// Select vars
		remainsOptions: ['Yes', 'No', '  ??'],
		dateDescriptorOptions: ['Estimate', 'Actual'],
		selectedImage: null,
		//modified coordinate fields
		modifiedMapFields: null,
		//helper var for the nations checkboxes
		// dialog to inform the user if a field has the wrong data
		dataDialog: false,
		//YACSINUMBER VALIDATION
		yacsiWarning: [],
		//number Rules
		numberRules: [
			(v) => {
				return /^[0-9]*$/.test(v) || 'A positive number is required';
			},
		],
		formValid: true,
		loadingPhotos: false,
		loadingPdf: false,
	}),
	async mounted() {
		this.overlay = true;
		if (this.action === 'new') {
			//inputs remain empty
			this.fields = await this.setEmptyAircrash();
		} else if (['edit', 'view'].includes(this.action)) {
			this.fields = await this.getAircrashByID(this.crashID);
		}

		this.overlay = false;
	},
	methods: {
		...mapActions('aircrash', ['getAircrashByID', 'setEmptyAircrash']),
		changeNation() {
			this.fields.nation = '';
		},
		async validateYACSI() {
			////console.log("original ", this.fieldsHistory.yacsinumber, "new",this.fields.yacsinumber);
			if (this.fieldsHistory) {
				if (this.fieldsHistory.yacsinumber == this.fields.yacsinumber) {
					this.yacsiWarning = [];
					return;
				}
			}

			let resp = await aircrash.getAvailableYACSI(this.fields.yacsinumber);
			if (resp.available) {
				this.yacsiWarning = [];
			} else {
				this.yacsiWarning = ['The YACSI Number must be unique.'];
			}
		},

		//Functions dedicated to handle the edit, add, view modes
		async cancelEdit() {
			this.yacsiWarning = [];
			this.fields = await this.getAircrashByID(this.crashID);
			this.$router.push(`/airplane/view/${this.crashID}`);
		},
		cancelNew() {
			this.$router.push(`/airplane/`);
		},
		viewMode() {
			// this.mode = 'view';
			this.$router.push(`/airplane/view/${this.crashID}`);
		},
		editMode() {
			// this.mode = 'edit';

			this.$router.push(`/airplane/edit/${this.crashID}`);
			this.showSave = 0;
		},

		async saveChanges() {
			this.overlay = true;
			//Mapping coordinate data
			//Mapping general fields
			let crash = { ...this.fields };
			//Removing useless values

			delete crash.infoSources;
			delete crash.sources;
			delete crash.lat;
			delete crash.long;
			//Mapping infosources
			// let editedInfoSources = this.fields.infoSources.filter(
			// 	(x) => x.isEdited == true
			// );
			// let removedInfoSources = this.deletedSources;
			// let newInfoSources = this.fields.infoSources
			// 	.filter((x) => x.isNew == true)
			// 	.map((x) => ({ Type: x.Type, Source: x.Source }));
			// //Final data obj

			const removedInfoSources = this.removedInfoSources;
			const editedInfoSources = this.editedInfoSources;
			const newInfoSources = this.newInfoSources;

			let data = {
				aircrash: crash,
				removedInfoSources,
				newInfoSources,
				editedInfoSources,
			};
			console.log(data);
			if (this.action == 'new') {
				let resp = await aircrash.post(data);
				if (resp.response) {
					if (resp.status == 409) {
						this.$store.commit(
							'alerts/setText',
							'The Yacsi number already exists.'
						);
						this.$store.commit('alerts/setType', 'warning');
						this.$store.commit('alerts/setTimeout', 5000);
						this.$store.commit('alerts/setAlert', true);
						this.overlay = false;
					}
				} else {
					this.overlay = false;
					this.$router.push(`/airplane/`);
				}
			} else {
				await aircrash.put(this.crashID, data);
				this.overlay = false;
				this.$router.push({
					name: 'airplaneView',
					params: {
						name: this.crashID,
						yacsinumber: this.crashID,
					},
				});
			}
			this.overlay = false;
		},
		getSources() {
			return _.join(this.infoSources, ';');
		},
		formatDate(date) {
			if (!date) return null;
			//date = date.substr(0, 10);
			const [year, month, day] = date.split('-');
			return `${month}/${day}/${year}`;
		},

		modifiedDataCoordinates(val) {
			this.modifiedMapFields = val;
			this.showSave = this.showSave + 1;
		},
		updateAirCrashLocation(val) {
			console.log('updating map data...');
			this.modifiedMapFields = val;
			this.showSave = this.showSave + 1;
		},
		selectedImageChanged(val) {
			this.selectedImage = val;
			////console.log(val);
		},
		loadingPhotosChange(val) {
			this.loadingPhotos = val;
		},
		async downloadPdf() {
			this.loadingPdf = true;
			let res = await aircrash.getPdf(parseInt(this.crashID));
			let blob = new Blob([res], { type: 'application/octetstream' });
			let url = window.URL || window.webkitURL;
			let link = url.createObjectURL(blob);
			let a = document.createElement('a');
			a.setAttribute('download', `Aircrash.pdf`); //`Boat-${this.fields.Name}.pdf`
			a.setAttribute('href', link);
			document.body.appendChild(a);
			a.click();
			document.body.removeChild(a);
			this.loadingPdf = false;
		},
	},
	computed: {
		...mapGetters('aircrash', [
			'editedInfoSources',
			'newInfoSources',
			'removedInfoSources',
			'',
		]),
		...mapState('aircrash', ['deletedSources']),

		// airCrash: {
		// 	get() {
		// 		return this.$store.state.aircrash.airCrash;
		// 	},
		// 	set(value) {
		// 		console.log(value);
		// 		this.$store.commit('SET_AIRCRASH', value);
		// 	},
		// },

		otherNation() {
			if (!['Canadian', 'American'].includes(this.fields.nation)) {
				return true;
			}
			return false;
		},
		crashMapData: {
			// let m =
			// console.log(m);
			get() {
				return new AirCrashLocation(this.fields);
			},
			set(val) {
				this.fields.lat = val.lat;
				this.fields.long = val.long;
				this.fields.inYukon = val.inYukon;
				this.fields.crashlocation = val.crashlocation;
				this.fields.accuracy = val.accuracy;
				this.fields.Location = `POINT(${this.fields.long} ${this.fields.lat})`;
			},
		},
		isAircrashEditor() {
			return this.$store.state.auth.user.roles.includes(
				'Airplane Crash Editor'
			);
		},
		isAdministrator() {
			return this.$store.state.auth.user.roles.includes('Administrator');
		},
		canEdit() {
			return this.isAircrashEditor || this.isAdministrator;
		},

		getYACSINumber() {
			if (this.$route.params.yacsinumber) {
				return this.$route.params.yacsinumber;
			} else return this.crashID;
		},
		crashdate() {
			return this.formatDate(this.fields.crashdate);
		},
		isNewCrash() {
			return this.action == 'new';
		},
		isEditingCrash() {
			return this.action == 'edit';
		},
		isViewingCrash() {
			return this.action == 'view';
		},
	},
	watch: {
		fields: {
			/* eslint-disable */
			handler(newval) {
				this.showSave = this.showSave + 1;
			} /* eslint-enable */,
			deep: true,
		},
		menu1(val) {
			val && setTimeout(() => (this.activePicker = 'YEAR'));
		} /* eslint-disable */,
		'fields.crashdate': function (val) {
			this.dateFormatted = this.formatDate(this.fields.crashdate);
		} /* eslint-enable */,
	},
};
</script>
