<template>
	<div>
		<v-card-title style="width: 100%; display: block">
			Management
			<div class="float-right">
				<v-btn
					class="my-0"
					color="primary"
					@click="saveChanges()"
					>Save</v-btn
				>
			</div>
		</v-card-title>
		<v-divider class="mb-5"></v-divider>
		<v-form v-model="valid">
			<div class="row mx-1">
				<div class="col-md-12">
					<v-card class="default mt-2">
						<v-card-text>
							<h3>Revision Logs</h3>
							<div
								class="row"
								v-for="(item, i) of revisionLogs"
								:key="i"
							>
								<div class="col-md-5">
									<v-select
										v-model="item.revisionLogType"
										label="Revision type"
										:items="revisionTypeOptions"
										item-value="value"
										item-text="text"
										dense
										outlined
										background-color="white"
										hide-details
									></v-select>
								</div>
								<div class="col-md-5">
									<v-text-field
										v-model="item.revisionDate"
										label="Date"
										dense
										outlined
										background-color="white"
										hide-details
									></v-text-field>
								</div>

								<div class="col-md-2">
									<v-btn
										color="warning"
										x-small
										fab
										title="Remove"
										class="my-0 float-right"
										@click="removeLog(i)"
										><v-icon>mdi-close</v-icon>
									</v-btn>
								</div>
								<div class="col-md-5">
									<v-text-field
										v-model="item.revisedBy"
										label="Revised by"
										dense
										outlined
										background-color="white"
										hide-details
									></v-text-field>
								</div>
								<div class="col-md-5">
									<v-text-field
										v-model="item.details"
										label="Details"
										dense
										outlined
										background-color="white"
										hide-details
									></v-text-field>
								</div>

								<div
									v-if="i < revisionLogs.length - 1"
									class="col-md-12"
								>
									<hr />
								</div>
							</div>
							<v-btn
								class="mt-5"
								color="primary"
								@click="addLog()"
							>
								Add Revision Log
							</v-btn>
						</v-card-text>
					</v-card>
				</div>

				<div class="col-md-12">
					<v-card class="default mt-2">
						<v-card-text>
							<h3>Contacts</h3>
							<div
								class="row"
								v-for="(item, i) of contacts"
								:key="i"
							>
								<div class="col-md-10">
									<v-select
										v-model="item.contactType"
										:items="contactTypeOptions"
										item-text="text"
										item-value="value"
										label="Type"
										dense
										outlined
										background-color="white"
										hide-details
									></v-select>
								</div>
								<div class="col-md-2">
									<v-btn
										color="warning"
										x-small
										fab
										title="Remove"
										class="my-0 float-right"
										@click="removeContact(i)"
										><v-icon>mdi-close</v-icon>
									</v-btn>
								</div>
								<div class="col-md-5">
									<v-text-field
										v-model="item.firstName"
										label="First name"
										dense
										outlined
										background-color="white"
										hide-details
									></v-text-field>
								</div>
								<div class="col-md-5">
									<v-text-field
										v-model="item.lastName"
										label="Last name"
										dense
										outlined
										background-color="white"
										hide-details
									></v-text-field>
								</div>

								<div class="col-md-5">
									<v-text-field
										v-model="item.phoneNumber"
										label="Phone"
										dense
										outlined
										background-color="white"
										hide-details
									></v-text-field>
								</div>
								<div class="col-md-5">
									<v-text-field
										v-model="item.email"
										label="Email"
										dense
										outlined
										background-color="white"
										hide-details
									></v-text-field>
								</div>
								<div class="col-md-5">
									<v-textarea
										label="Mailing address"
										v-model="item.mailingAddress"
										dense
										outlined
										background-color="white"
										hide-details
									></v-textarea>
								</div>
								<div class="col-md-5">
									<v-textarea
										label="Description"
										v-model="item.description"
										dense
										outlined
										background-color="white"
										hide-details
									></v-textarea>
								</div>

								<div
									v-if="i < contacts.length - 1"
									class="col-md-12"
								>
									<hr />
								</div>
							</div>
							<v-btn
								class="mt-5"
								color="primary"
								@click="addContact()"
							>
								Add Contact
							</v-btn>
						</v-card-text>
					</v-card>
				</div>

				<div class="col-md-12">
					<v-card class="default mt-2">
						<v-card-text>
							<h3>Web Links</h3>
							<div
								class="row"
								v-for="(item, i) of links"
								:key="i"
							>
								<div class="col-md-3">
									<v-select
										v-model="item.type"
										:items="linkTypeOptions"
										item-text="text"
										item-value="value"
										label="Link type"
										dense
										outlined
										background-color="white"
										hide-details
									></v-select>
								</div>
								<div class="col-md-7">
									<v-text-field
										v-model="item.address"
										label="Web address"
										dense
										outlined
										background-color="white"
										hide-details
									></v-text-field>
								</div>
								<div class="col-md-2">
									<v-btn
										color="warning"
										x-small
										fab
										title="Remove"
										class="my-0 float-right"
										@click="removeLink(i)"
										><v-icon>mdi-close</v-icon>
									</v-btn>
								</div>
							</div>
							<v-btn
								class="mt-5"
								color="primary"
								@click="addLink()"
							>
								Add Web Link
							</v-btn>
						</v-card-text>
					</v-card>
				</div>

				<div class="col-md-6">
					<v-card class="default">
						<v-card-text>
							<h3>Designation Information</h3>

							<v-select
								v-model="fields.jurisdiction"
								label="Jurisdiction"
								:items="jurisdictionOptions"
								dense
								outlined
								background-color="white"
							></v-select>

							<v-menu
								ref="menu"
								v-model="menu"
								:close-on-content-click="false"
								transition="scale-transition"
								offset-y
								min-width="auto"
							>
								<template v-slot:activator="{ on, attrs }">
									<v-text-field
										v-model="fields.recognitionDateDisplay"
										label="Recognition date"
										append-icon="mdi-calendar"
										readonly
										v-bind="attrs"
										v-on="on"
										dense
										outlined
										background-color="white"
									></v-text-field>
								</template>
								<v-date-picker
									ref="picker"
									v-model="fields.recognitionDateDisplay"
									:max="new Date().toISOString().substr(0, 10)"
									min="1950-01-01"
									@change="save"
								></v-date-picker>
							</v-menu>

							<v-select
								v-model="fields.ownerConsent"
								:items="ownerConsentOptions"
								label="Owner consent"
								dense
								outlined
								background-color="white"
							></v-select>

							<v-checkbox
								class="my-0"
								v-model="fields.isPubliclyAccessible"
								label="Publicly accessible?"
								dense
								outlined
							></v-checkbox>
						</v-card-text>
					</v-card>
				</div>
				<div class="col-md-6">
					<v-text-field
						v-model="fields.yGBuildingNumber"
						label="YG building number"
						dense
						outlined
						background-color="white"
					></v-text-field>

					<v-text-field
						v-model="fields.yGReserveNumber"
						label="YG reserve number"
						dense
						outlined
						background-color="white"
					></v-text-field>

					<v-text-field
						v-model="fields.cIHBNumber"
						label="CIHB number"
						dense
						outlined
						background-color="white"
					></v-text-field>

					<v-text-field
						v-model="fields.fHBRONumber"
						label="FHBRO number"
						dense
						outlined
						background-color="white"
					></v-text-field>
				</div>

				<div class="col-md-12">
					<v-select
						v-model="fields.statuteId"
						label="Recognition Authority / Recognition Type / Statute"
						:items="statuteOptions"
						item-text="display"
						item-value="id"
						dense
						outlined
						background-color="white"
						hide-details
					></v-select>
				</div>
				<div class="col-md-12">
					<v-select
						v-model="fields.statute2Id"
						:items="statuteOptions"
						item-text="display"
						item-value="id"
						label="Recognition Authority / Recognition Type / Statute 2"
						dense
						outlined
						background-color="white"
						hide-details
					></v-select>
				</div>
			</div>
		</v-form>
	</div>
</template>

<script>
import axios from 'axios';
import store from '../../../store';
import { PLACE_URL, STATIC_URL } from '../../../urls';
/* Important**, field data that was not found on the swaggerhub api docs provided was assumed to be in development, hence, some placeholder variables were created. */
export default {
	name: 'formManagement',
	data: () => ({
		valid: false,
		loadedId: -1,
		generalRules: [
			(v) => !!v || 'This input is required',
			(v) => v.length <= 20 || 'This input must be less than 20 characters',
		],
		date: null,
		menu: false,
		currentUser: 'asd',

		revisionLogs: [],
		contacts: [],
		links: [],

		revisionTypeOptions: [],
		contactTypeOptions: [],
		linkTypeOptions: [],
		jurisdictionOptions: [],
		ownerConsentOptions: [],
		statuteOptions: [],

		fields: {
			cIHBNumber: '', //
			doorCondition: '',
			fHBRONumber: '', //
			jurisdiction: '', //
			ownerConsent: '', //
			recognitionDate: '', //
			isPubliclyAccessible: false, //
			statute2Id: '', //
			statuteId: '', //
			yGBuildingNumber: '', //
			yGReserveNumber: '', //
		},
	}),
	created: function () {
		let id = this.$route.params.id;
		this.loadedId = id;
		this.currentUser = store.getters.fullName;

		axios
			.get(`${PLACE_URL}/${id}`)
			.then((resp) => {
				this.fields = resp.data.data;
				this.fields.recognitionDate = this.fields.recognitionDate || '';
				this.revisionLogs = resp.data.relationships.revisionLogs.data;
				this.contacts = resp.data.relationships.contacts.data;
				this.links = resp.data.relationships.webLinks.data;
				store.dispatch('addSiteHistory', resp.data.data);
				this.$parent.siteName = this.fields.primaryName;
			})
			.catch((error) => console.error(error));

		axios.get(`${STATIC_URL}/revision-log-type`).then((resp) => {
			this.revisionTypeOptions = resp.data.data;
		});
		axios.get(`${STATIC_URL}/contact-type`).then((resp) => {
			this.contactTypeOptions = resp.data.data;
		});
		axios.get(`${STATIC_URL}/link-type`).then((resp) => {
			this.linkTypeOptions = resp.data.data;
		});
		axios.get(`${STATIC_URL}/jurisdiction`).then((resp) => {
			this.jurisdictionOptions = resp.data.data;
		});
		axios.get(`${STATIC_URL}/statute`).then((resp) => {
			this.statuteOptions = resp.data.data;
		});
		axios.get(`${STATIC_URL}/owner-consent`).then((resp) => {
			this.ownerConsentOptions = resp.data.data;
		});
	},
	methods: {
		save(date) {
			this.$refs.menu.save(date);
		},

		addLog() {
			let date = new Date();
			let month = ('0' + (date.getMonth() + 1)).slice(-2);
			let day = ('0' + date.getDate()).slice(-2);

			this.revisionLogs.push({
				placeId: this.loadedId,
				revisionLogType: 5,
				revisionDate: `${date.getFullYear()}-${month}-${day}`,
				revisedBy: this.currentUser,
			});
		},
		removeLog(index) {
			this.revisionLogs.splice(index, 1);
		},
		addContact() {
			this.contacts.push({ placeId: this.loadedId, contactType: 1 });
		},
		removeContact(index) {
			this.contacts.splice(index, 1);
		},
		addLink() {
			this.links.push({ type: 1, address: 'https://', placeId: this.loadedId });
		},
		removeLink(index) {
			this.links.splice(index, 1);
		},
		saveChanges() {
			let body = {
				cIHBNumber: this.fields.cIHBNumber,
				doorCondition: this.fields.doorCondition,
				fHBRONumber: this.fields.fHBRONumber,
				jurisdiction: this.fields.jurisdiction,
				ownerConsent: this.fields.ownerConsent,
				recognitionDate: this.fields.recognitionDateDisplay,
				isPubliclyAccessible: this.fields.isPubliclyAccessible,
				statute2Id: this.fields.statute2Id,
				statuteId: this.fields.statuteId,
				yGBuildingNumber: this.fields.yGBuildingNumber,
				yGReserveNumber: this.fields.yGReserveNumber,
				links: this.links,
				contacts: this.contacts,
				revisionLogs: this.revisionLogs,
			};

			axios
				.put(`${PLACE_URL}/${this.loadedId}/management`, body)
				.then((resp) => {
					this.$emit('showAPIMessages', resp.data);
				})
				.catch((err) => {
					this.$emit('showError', err);
				});
		},
	},
	watch: {
		menu(val) {
			val && setTimeout(() => (this.$refs.picker.activePicker = 'YEAR'));
		},
	},
};
</script>
