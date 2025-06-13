<template>
	<div>
		<Accordion>
			<template v-slot:title>
				<v-card-title
					primary-title
					style="display: inline-block"
				>
					Site Record
				</v-card-title>
			</template>
			<template v-slot:content>
				<v-form
					v-model="valid"
					ref="siteRecordForm"
				>
					<v-row class="my-1">
						<v-col cols="6">
							<v-text-field
								v-model="fields.bordenRecord"
								class="default"
								label="Borden Record"
								required
								dense
								outlined
								background-color="white"
								:readonly="mode == 'view'"
							></v-text-field>

							<v-text-field
								v-model="fields.paleoRecord"
								label="Paleo Record"
								required
								dense
								outlined
								background-color="white"
								:readonly="mode == 'view'"
							></v-text-field>

							<v-text-field
								v-model="fields.archivalRecord"
								label="Archival Record"
								required
								dense
								outlined
								background-color="white"
								:readonly="mode == 'view'"
							></v-text-field>

							<v-checkbox
								v-model="fields.isOtherRecord"
								:label="'Other or No Record?'"
								dense
								outlined
								background-color="white"
								:readonly="mode == 'view'"
							></v-checkbox>

							<v-checkbox
								v-model="fields.isSiteDefault"
								:label="'Is Site Default?'"
								dense
								outlined
								background-color="white"
								:readonly="mode == 'view'"
							></v-checkbox>
						</v-col>

						<v-col cols="6">
							<v-card
								color="#fff2d5"
								v-for="(item, i) in sites"
								:key="`site-${i}`"
								class="mb-3"
							>
								<v-card-text>
									<v-btn
										v-if="mode == 'edit'"
										color="warning"
										x-small
										fab
										title="Remove"
										class="float-right"
										style="
											margin-top: -6px !important;
											margin-bottom: 0px !important;
										"
										@click="deleteAssociation('place', item.personId)"
									>
										<v-icon>mdi-close</v-icon>
									</v-btn>
									<h3>Associated Site</h3>
								</v-card-text>
								<v-text-field
									v-model="item.primaryName"
									label="Primary Name"
									class="mx-3"
									readonly
									dense
									outlined
									background-color="white"
								></v-text-field>
								<v-row class="mx-3">
									<v-text-field
										v-model="item.yHSIId"
										label="YHSI Id"
										class="mb-4"
										readonly
										dense
										outlined
										background-color="white"
										hide-details
									></v-text-field>
									<v-text-field
										v-model="item.communityName"
										label="Community"
										class="ml-3 mb-4"
										readonly
										dense
										outlined
										background-color="white"
										hide-details
									></v-text-field>
								</v-row>
								<div class="mx-3 mb-3">
									<a @click="clickSite(item.id)">
										<span underline>View Site Details</span>
									</a>
								</div>
							</v-card>

							<v-card
								color="#fff2d5"
								v-for="(item, i) in places"
								:key="`place-${i}`"
								class="mb-3"
							>
								<v-card-text>
									<v-btn
										v-if="mode == 'edit'"
										color="warning"
										x-small
										fab
										title="Remove"
										class="float-right"
										style="
											margin-top: -6px !important;
											margin-bottom: 0px !important;
										"
										@click="deleteAssociation('ytplace', item.id)"
									>
										<v-icon>mdi-close</v-icon>
									</v-btn>
									<h3>Associated Place</h3>
								</v-card-text>
								<v-row class="mx-3">
									<v-col cols="12">
										<v-text-field
											v-model="item.name"
											label="Name"
											readonly
											dense
											outlined
											background-color="white"
											hide-details
										></v-text-field
									></v-col>
									<v-col cols="12">
										<v-text-field
											v-model="item.firstNationNames"
											label="First Nation Name"
											readonly
											dense
											outlined
											background-color="white"
											hide-details
										></v-text-field>
									</v-col>
									<v-col cols="12">
										<v-text-field
											v-model="item.placeTypes"
											label="Place Types"
											readonly
											dense
											outlined
											background-color="white"
											hide-details
										></v-text-field>
									</v-col>
								</v-row>
								<div class="mx-3 mb-3">
									<a @click="clickPlace(item.name)">
										<span underline>View Place Details</span>
									</a>
								</div>
							</v-card>

							<v-card
								color="#fff2d5"
								v-for="(item, i) in boats"
								:key="`boat-${i}`"
								class="mb-3"
							>
								<v-card-text>
									<v-btn
										v-if="mode == 'edit'"
										color="warning"
										x-small
										fab
										title="Remove"
										class="float-right"
										style="
											margin-top: -6px !important;
											margin-bottom: 0px !important;
										"
										@click="deleteAssociation('boat', item.id)"
									>
										<v-icon>mdi-close</v-icon>
									</v-btn>
									<h3>Associated Boat</h3>
								</v-card-text>
								<v-row class="mx-3">
									<v-text-field
										v-model="item.name"
										label="Name"
										readonly
										dense
										outlined
										background-color="white"
									></v-text-field>
									<v-text-field
										v-model="item.vesseltype"
										label="Vessel Type"
										class="ml-3"
										readonly
										dense
										outlined
										background-color="white"
										hide-details
									></v-text-field>
								</v-row>
								<v-text-field
									v-model="item.owners"
									label="Owner"
									class="mx-3 mb-4"
									readonly
									dense
									outlined
									background-color="white"
									hide-details
								></v-text-field>
								<div class="mx-3 mb-3">
									<a @click="clickBoat(item.name)">
										<span underline>View Boat Details</span>
									</a>
								</div>
							</v-card>

							<v-card
								color="#fff2d5"
								v-for="(item, i) in aircrashes"
								:key="`aircrash-${i}`"
								class="mb-3"
							>
								<v-card-text>
									<v-btn
										v-if="mode == 'edit'"
										color="warning"
										x-small
										fab
										title="Remove"
										class="float-right"
										style="
											margin-top: -6px !important;
											margin-bottom: 0px !important;
										"
										@click="deleteAssociation('aircrash', item.yacsinumber)"
									>
										<v-icon>mdi-close</v-icon>
									</v-btn>
									<h3>Associated Airplane Crash</h3>
								</v-card-text>
								<v-row class="mx-3">
									<v-text-field
										v-model="item.yacsinumber"
										label="YACSI Number"
										readonly
										dense
										outlined
										background-color="white"
									></v-text-field>
									<v-text-field
										v-model="item.aircraftRegistration"
										label="Aircraft Registration"
										class="ml-3"
										readonly
										dense
										outlined
										background-color="white"
										hide-details
									></v-text-field>
								</v-row>
								<v-text-field
									v-model="item.aircraftType"
									label="Aircraft Type"
									class="mx-3 mb-4"
									readonly
									dense
									outlined
									background-color="white"
									hide-details
								></v-text-field>
								<div class="mx-3 mb-3">
									<a @click="clickAircrash(item.yacsinumber)">
										<span underline>View Airplane Crash Details</span>
									</a>
								</div>
							</v-card>

							<v-card
								color="#fff2d5"
								v-for="(item, i) in people"
								:key="`people-${i}`"
								class="mb-3"
							>
								<v-card-text>
									<v-btn
										v-if="mode == 'edit'"
										color="warning"
										x-small
										fab
										title="Remove"
										class="float-right"
										style="
											margin-top: -6px !important;
											margin-bottom: 0px !important;
										"
										@click="deleteAssociation('people', item.personId)"
									>
										<v-icon>mdi-close</v-icon>
									</v-btn>
									<h3>Associated Person</h3>
								</v-card-text>
								<v-row class="mx-3 mb-3">
									<v-text-field
										v-model="item.name"
										label="Name"
										readonly
										dense
										outlined
										background-color="white"
										hide-details
									></v-text-field>
								</v-row>
								<v-row class="mx-3">
									<v-text-field
										v-model="item.birthYear"
										label="Birth Year"
										readonly
										dense
										outlined
										background-color="white"
									></v-text-field>
									<v-text-field
										v-model="item.deathYear"
										label="Death Year"
										class="ml-3"
										readonly
										dense
										outlined
										background-color="white"
										hide-details
									></v-text-field>
								</v-row>
								<div class="mx-3 mb-3">
									<a @click="clickPerson(item.name)">
										<span underline>View Person Details</span>
									</a>
								</div>
							</v-card>

							<v-card
								color="#fff2d5"
								v-for="(item, i) in burials"
								:key="`burial-${i}`"
								class="mb-3"
							>
								<v-card-text>
									<v-btn
										v-if="mode == 'edit'"
										color="warning"
										x-small
										fab
										title="Remove"
										class="float-right"
										style="
											margin-top: -6px !important;
											margin-bottom: 0px !important;
										"
										@click="deleteAssociation('burial', item.burialId)"
									>
										<v-icon>mdi-close</v-icon>
									</v-btn>
									<h3>Associated Burial</h3>
								</v-card-text>
								<v-row class="mx-3 mb-3">
									<v-text-field
										v-model="item.name"
										label="Name"
										readonly
										dense
										outlined
										background-color="white"
										hide-details
									></v-text-field>
								</v-row>
								<v-row class="mx-3">
									<v-text-field
										v-model="item.birthYear"
										label="Birth Year"
										readonly
										dense
										outlined
										background-color="white"
									></v-text-field>
									<v-text-field
										v-model="item.deathYear"
										label="Death Year"
										class="ml-3"
										readonly
										dense
										outlined
										background-color="white"
										hide-details
									></v-text-field>
								</v-row>
								<div class="mx-3 mb-3">
									<a @click="clickBurial(item.burialId)">
										<span underline>View Burial Details</span>
									</a>
								</div>
							</v-card>

							<v-card
								color="#fff2d5"
								v-for="(item, i) in intSites"
								:key="`intsite-${i}`"
								class="mb-3"
							>
								<v-card-text>
									<v-btn
										v-if="mode == 'edit'"
										color="warning"
										x-small
										fab
										title="Remove"
										class="float-right"
										style="
											margin-top: -6px !important;
											margin-bottom: 0px !important;
										"
										@click="
											deleteAssociation('interpretive-sites', item.siteId)
										"
									>
										<v-icon>mdi-close</v-icon>
									</v-btn>
									<h3>Associated Interpretive Site</h3>
								</v-card-text>
								<v-row class="mx-3 mb-3">
									<v-text-field
										v-model="item.siteName"
										label="Site Name"
										readonly
										dense
										outlined
										background-color="white"
										hide-details
									></v-text-field>
								</v-row>
								<v-row class="mx-3">
									<v-text-field
										v-model="item.routeName"
										label="Route Name"
										readonly
										dense
										outlined
										background-color="white"
									></v-text-field>
									<v-text-field
										v-model="item.kmNum"
										label="KM Number"
										class="ml-3"
										readonly
										dense
										outlined
										background-color="white"
										hide-details
									></v-text-field>
								</v-row>
								<div class="mx-3 mb-3">
									<a @click="clickIntSite(item.siteId)">
										<span underline>View Interpretive Site Details</span>
									</a>
								</div>
							</v-card>
						</v-col>
					</v-row>
				</v-form>
			</template>
		</Accordion>
	</div>
</template>

<script>
import Accordion from '../Accordion';
import axios from 'axios';
import { PHOTO_URL } from '../../../urls';

export default {
	name: 'siteRecord',
	components: { Accordion },
	props: ['fields', 'mode', 'itemType'],
	data: () => ({
		valid: false,
		generalRules: [(v) => !!v || 'This field is required'],
		sites: [],
		places: [],
		boats: [],
		aircrashes: [],
		people: [],
		burials: [],
		intSites: [],
	}),
	created() {
		if (this.fields.rowId) {
			// Fetch associations
			axios.get(`${PHOTO_URL}/${this.fields.rowId}/place`).then((resp) => {
				this.sites = resp.data.data;
			});
			axios.get(`${PHOTO_URL}/${this.fields.rowId}/ytplace`).then((resp) => {
				this.places = resp.data.data;
			});
			axios.get(`${PHOTO_URL}/${this.fields.rowId}/boat`).then((resp) => {
				this.boats = resp.data.data;
			});
			axios.get(`${PHOTO_URL}/${this.fields.rowId}/aircrash`).then((resp) => {
				this.aircrashes = resp.data.data;
			});
			axios.get(`${PHOTO_URL}/${this.fields.rowId}/people`).then((resp) => {
				this.people = resp.data.data;
			});
			axios.get(`${PHOTO_URL}/${this.fields.rowId}/burial`).then((resp) => {
				this.burials = resp.data.data;
			});
			axios
				.get(`${PHOTO_URL}/${this.fields.rowId}/interpretive-sites`)
				.then((resp) => {
					this.intSites = resp.data.data;
				});
		}
	},
	methods: {
		validate() {
			this.$refs.siteRecordForm.validate();
		},
		clickSite(siteId) {
			this.$router.push(`/sites/${siteId}`);
		},
		clickPlace(name) {
			this.$router.push(`/places/view/${name}`);
		},
		clickBoat(name) {
			this.$router.push(`/boats/view/${name}`);
		},
		clickAircrash(yacsinumber) {
			this.$router.push(`/airplane/view/${yacsinumber}`);
		},
		clickPerson(name) {
			this.$router.push(`/people/view/${name}`);
		},
		clickBurial(name) {
			this.$router.push(`/burials/view/${name}`);
		},
		clickIntSite(siteId) {
			this.$router.push(`/interpretive-sites/view/${siteId}`);
		},
		deleteAssociation(itemType, itemId) {
			axios
				.delete(`${PHOTO_URL}/${this.fields.rowId}/${itemType}/${itemId}`)
				.then(() => {
					switch (itemType) {
						case 'place': {
							// Sites can only have one photo currently (since placeId is right on the photo table)
							this.sites = [];
							break;
						}
						case 'ytplace': {
							this.places = this.places.filter(function (obj) {
								return obj.id !== itemId;
							});
							break;
						}
						case 'boat': {
							this.boats = this.boats.filter(function (obj) {
								return obj.id !== itemId;
							});
							break;
						}
						case 'aircrash': {
							this.aircrashes = this.aircrashes.filter(function (obj) {
								return obj.yacsinumber !== itemId;
							});
							break;
						}
						case 'people': {
							this.people = this.people.filter(function (obj) {
								return obj.personId !== itemId;
							});
							break;
						}
						case 'burial': {
							this.burials = this.burials.filter(function (obj) {
								return obj.burialId !== itemId;
							});
							break;
						}
						case 'interpretive-sites': {
							this.intSites = this.intSites.filter(function (obj) {
								return obj.siteId !== itemId;
							});
							break;
						}
					}
					this.$emit('siteRecordChange', this.fields);

					this.$store.commit('alerts/setText', 'Association removed');
					this.$store.commit('alerts/setType', 'success');
					this.$store.commit('alerts/setTimeout', 5000);
					this.$store.commit('alerts/setAlert', true);
				});
		},
	},
	watch: {
		fields: {
			handler() {
				this.$emit('siteRecordChange', this.fields);
			},
			deep: true,
		},
	},
};
</script>
