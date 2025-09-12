<template>
	<div>
		<v-dialog
			v-if="mode == 'new'"
			v-model="dialog"
			persistent
			max-width="800px"
		>
			<template v-slot:activator="{ on, attrs }">
				<v-btn
					v-if="!typeGrid"
					color="primary"
					outlined
					class="ml-auto mr-1"
					v-bind="attrs"
					v-on="on"
					@click="openNewDialog"
				>
					ADD ACTION
				</v-btn>
				<v-btn
					v-else
					class="black--text mx-1"
					v-bind="attrs"
					v-on="on"
					@click="openNewDialog"
				>
					<v-icon class="mr-1">mdi-plus-circle-outline</v-icon>
					Add Action
				</v-btn>
			</template>
			<v-card>
				<v-card-title>
					<v-row>
						<v-col
							class="d-flex flex-row"
							cols="12"
						>
							<span class="text-h5 mt-3">New Action</span>
							<v-spacer></v-spacer>
						</v-col>
					</v-row>
				</v-card-title>
				<v-card-text>
					<!-- style="height: 400px" -->
					<v-container>
						<v-form
							v-model="valid"
							ref="actionDialog"
						>
							<v-row>
								<v-col cols="6">
									<v-autocomplete
										v-if="typeGrid"
										outlined
										dense
										clearable
										@click="searchSites"
										:items="siteList"
										:search-input.sync="siteSearch"
										:loading="loadingSites"
										name="Site"
										item-text="SiteName"
										item-value="SiteID"
										label="Site"
										v-model="fields.SiteID"
										:rules="rules"
									></v-autocomplete>
									<v-text-field
										v-else
										outlined
										dense
										readonly
										name="Site Name"
										label="Site Name"
										v-model="Site.SiteName"
									></v-text-field>

									<v-text-field
										outlined
										dense
										name="CreatedBy"
										label="Created By"
										v-model="fields.CreatedBy"
										:rules="rules"
									></v-text-field>
								</v-col>
								<v-col cols="6">
									<!-- <v-text-field
										outlined
										dense
										name="Inspection"
										label="Inspection"
										v-model="fields.Inspection"
									></v-text-field> -->
									<v-autocomplete
										v-if="!typeInspection"
										outlined
										dense
										clearable
										@click="searchInspections"
										:items="inspectionList"
										:search-input.sync="inspectionSearch"
										:loading="loadingInspections"
										name="Inspection"
										item-text="Description"
										item-value="InspectID"
										label="Inspection"
										v-model="fields.InspectID"
									></v-autocomplete>

									<v-text-field
										v-else
										outlined
										dense
										name="Inspection"
										label="Inspection"
										readonly
										v-model="Inspection.Description"
									></v-text-field>
									{{ Inspection }}
									<v-text-field
										outlined
										dense
										name="CreatedDate"
										label="Created Date"
										v-model="fields.CreatedDate"
										:rules="dateRules"
									></v-text-field>
								</v-col>
							</v-row>
							<v-row>
								<v-col cols="6">
									<v-text-field
										outlined
										dense
										name="ActionDescription"
										label="Action Description"
										v-model="fields.ActionDesc"
										:rules="rules"
									></v-text-field>

									<v-select
										outlined
										dense
										name="Priority"
										label="Priority"
										:items="priorityList"
										v-model="fields.Priority"
										:rules="rules"
									></v-select>
								</v-col>
								<v-col cols="6">
									<v-text-field
										outlined
										dense
										name="ToBeCompleted"
										label="To Be Completed Date"
										v-model="fields.ToBeCompleteDate"
										:rules="dateRules"
									></v-text-field>
									<!-- <v-text-field
										outlined
										dense
										name="CompletedBy"
										label="Completed By"
										v-model="fields.CompletedBy"
									></v-text-field> -->

									<!-- <v-text-field
										outlined
										dense
										name="CompletedDate"
										label="Completed Date"
										v-model="fields.ActionCompleteDate"
										:rules="dateRules"
									></v-text-field> -->
								</v-col>
							</v-row>
							<v-row>
								<v-col cols="12">
									<v-textarea
										outlined
										dense
										name="Notes"
										label="Notes"
										v-model="fields.CompletionDesc"
										:rules="rules"
									></v-textarea>
								</v-col>
							</v-row>

							<DocumentHandler :default="true" />
						</v-form>
					</v-container>
				</v-card-text>
				<v-card-actions>
					<v-spacer></v-spacer>
					<v-btn
						color="blue darken-1"
						text
						@click="dialog = false"
					>
						Close
					</v-btn>
					<v-btn
						color="blue darken-1"
						text
						:disabled="!valid"
						@click="saveNew"
					>
						Save
					</v-btn>
				</v-card-actions>
			</v-card>
		</v-dialog>
		<!-- edit dialog  -->
		<v-dialog
			v-if="mode == 'edit'"
			v-model="editDialog"
			persistent
			max-width="800px"
		>
			<template #activator="{ on: dialog }">
				<v-tooltip bottom>
					<template #activator="{ on: tooltip }">
						<v-btn
							v-on="{ ...tooltip, ...dialog }"
							icon
							class="grey--text text--darken-2"
							@click="openEditDialog()"
						>
							<v-icon small>mdi-eye</v-icon>
						</v-btn>
					</template>
					<span>View</span>
				</v-tooltip>
			</template>

			<v-card>
				<v-card-title>
					<v-row>
						<v-col
							class="d-flex flex-row"
							cols="12"
						>
							<span class="text-h5 mt-3">{{ textMode }} Action</span>
							<v-spacer></v-spacer>
							<DeleteDialog
								:type="'Action'"
								:id="editFields.ActionID"
								@deleteItem="deleteItem"
							/>
							<v-btn
								text
								v-if="!internalEditMode"
								color="success"
								@click="editMode"
								>Edit</v-btn
							>
						</v-col>
					</v-row>
				</v-card-title>
				<v-card-text>
					<v-container>
						<v-form
							v-model="form2"
							ref="actionEditDialog"
						>
							<v-row>
								<v-col cols="6">
									<!-- <v-select
										outlined
										dense
										:items="data"
										name="Site"
										item-text="SiteName"
										item-value="SiteID"
										label="Site"
										v-model="siteSearch"
										:rules="rules"
									></v-select> -->
									<v-text-field
										outlined
										dense
										name="Site"
										disabled
										v-model="editFields.SiteName"
										label="Site"
									></v-text-field>

									<v-text-field
										:disabled="!internalEditMode"
										outlined
										dense
										name="CreatedBy"
										label="Created By"
										v-model="editFields.CreatedBy"
										:rules="rules"
									></v-text-field>
								</v-col>
								<v-col cols="6">
									<v-autocomplete
										outlined
										dense
										clearable
										:disabled="!internalEditMode"
										@click="searchInspections"
										:items="inspectionList"
										:search-input.sync="inspectionSearch"
										:loading="loadingInspections"
										name="Inspection"
										item-text="Description"
										return-object
										label="Inspection"
										v-model="editFields.Inspection"
									></v-autocomplete>

									<v-text-field
										:disabled="!internalEditMode"
										outlined
										dense
										name="CreatedDate"
										label="Created Date"
										v-model="editFields.CreatedDate"
										:rules="dateRules"
									></v-text-field>
								</v-col>
							</v-row>
							<v-row>
								<v-col cols="6">
									<v-text-field
										:disabled="!internalEditMode"
										outlined
										dense
										name="ActionDescription"
										label="Action Description"
										v-model="editFields.ActionDesc"
										:rules="rules"
									></v-text-field>

									<v-select
										:disabled="!internalEditMode"
										outlined
										dense
										name="Priority"
										label="Priority"
										:items="priorityList"
										v-model="editFields.Priority"
										:rules="rules"
									></v-select>

									<v-text-field
										:disabled="!internalEditMode"
										outlined
										dense
										name="ToBeCompleted"
										label="To Be Completed Date"
										v-model="editFields.ToBeCompleteDate"
										:rules="dateRules"
									></v-text-field>
								</v-col>
								<v-col cols="6">
									<v-text-field
										:disabled="!internalEditMode"
										outlined
										dense
										name="CompletedBy"
										label="Completed By"
										v-model="editFields.CompletedBy"
										:rules="rules"
									></v-text-field>

									<v-text-field
										:disabled="!internalEditMode"
										outlined
										dense
										name="CompletedDate"
										label="Completed Date"
										v-model="editFields.ActionCompleteDate"
										:rules="dateRules"
									></v-text-field>
								</v-col>
							</v-row>
							<v-row>
								<v-col cols="12">
									<v-textarea
										:disabled="!internalEditMode"
										outlined
										dense
										name="Notes"
										label="Notes"
										v-model="editFields.CompletionDesc"
										:rules="rules"
									></v-textarea>
								</v-col>
							</v-row>
						</v-form>
						<DocumentHandler
							:doclist="docs"
							@newDocumment="newDocumment"
							:objID="{
								key: 'ActionID',
								doctype: 'actions',
								value: dataToEdit.item.ActionID,
							}"
							:displayDelete="internalEditMode"
							@deletedItem="deletedDoc"
						/>
					</v-container>
				</v-card-text>
				<v-card-actions>
					<v-btn
						color="grey darken-1"
						text
						@click="closeDialog()"
					>
						Close{{ cancelActive }}
					</v-btn>
					<v-spacer></v-spacer>
					<v-btn
						color="blue darken-1"
						text
						@click="saveEdit()"
						:disabled="!form2"
					>
						Save
					</v-btn>
				</v-card-actions>
			</v-card>
		</v-dialog>
	</div>
</template>

<script>
import DeleteDialog from './DeleteDialog.vue';
import { mapGetters } from 'vuex';
import interpretiveSites from '../../../controllers/interpretive-sites';
import DocumentHandler from './DocumentHandler.vue';
export default {
	props: ['type', 'Site', 'Inspection', 'data', 'mode', 'dataToEdit'],
	components: { DocumentHandler, DeleteDialog },
	data: () => ({
		//new Dialog
		dialog: false,
		valid: false,
		fields: {},
		siteList: [],
		siteSearch: '',
		rules: [(value) => !!value || 'Required.'],
		dateRules: [
			(v) => !!v || 'This field is required',
			(v) =>
				/^(?:(?:31(\/|-|\.)(?:0?[13578]|1[02]))\1|(?:(?:29|30)(\/|-|\.)(?:0?[13-9]|1[0-2])\2))(?:(?:1[6-9]|[2-9]\d)?\d{2})$|^(?:29(\/|-|\.)0?2\3(?:(?:(?:1[6-9]|[2-9]\d)?(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00))))$|^(?:0?[1-9]|1\d|2[0-8])(\/|-|\.)(?:(?:0?[1-9])|(?:1[0-2]))\4(?:(?:1[6-9]|[2-9]\d)?\d{2})$/.test(
					v
				) || 'Correct date format required.',
		],
		loadingSites: false,
		//edit dialog
		form2: false,
		editing: false,
		editDialog: false,
		editFields: {},
		fieldsHistory: null,
		internalEditMode: false,
		documentHeaders: [
			{ text: 'Document Name', value: 'DocumentName' },
			{ text: 'Date Uploaded', value: 'DateUploaded' },
			{ text: 'Uploader', value: 'Uploader' },
		],
		priorityList: ['High', 'Med', 'Low'],
		documments: [],
		editedDocuments: [],
		loading: false,
		inspectionList: [],
		inspectionSearch: '',
		loadingInspections: false,
	}),
	methods: {
		openNewDialog() {
			this.fields.CreatedBy = this.username;
		},
		async deleteItem(id) {
			await interpretiveSites.removeAction(id);
			this.$emit('deletedAction', this.dataToEdit.index);
			this.editDialog = false;
		},
		newDocumment(val) {
			this.documments.push(val);
		},
		deletedDoc(id) {
			this.documments = this.documments.filter((x) => x.DocID !== id);
		},
		editMode() {
			this.fieldsHistory = { ...this.editFields };
			this.internalEditMode = true;
		},
		async saveNew() {
			this.loading = true;
			let data = { ...this.fields };
			if (this.typeGrid) {
				this.fields.CompletedBy = '';
				const res = await interpretiveSites.postAction({ item: data });
				this.$emit('gridActionAdded', res);
			} else if (this.typeInspection) {
				this.fields.CompletedBy = '';
				data.InspectID = this.Inspection.InspectID;
				const res = await interpretiveSites.postAction({ item: data });
				this.$emit('newAction', res);
			} else {
				data.SiteID = this.Site.SiteID;
				//data.new = true;
				const res = await interpretiveSites.postAction({ item: data });
				this.$emit('newAction', res);
			}
			this.$refs.actionDialog.reset();
			this.loading = false;
			this.dialog = false;
		},
		async saveEdit() {
			this.loading = true;
			let data = { ...this.editFields };
			delete data.SiteName;
			delete data.ActionID;
			if (this.typeGrid) {
				const res = await interpretiveSites.putAction(
					this.editFields.ActionID,
					{ item: data }
				);
				this.$emit('gridActionEdited', res);
			} else {
				data.SiteID = this.Site.SiteID;
				//data.new = true;

				const res = await interpretiveSites.putAction(
					this.editFields.ActionID,
					{ item: data }
				);
				this.$emit('editAction', { data: res, index: this.dataToEdit.index });
			}

			this.$refs.actionEditDialog.reset();
			this.internalEditMode = false;
			this.loading = false;
			this.editDialog = false;
		},
		async openEditDialog() {
			const { item } = this.dataToEdit;
			this.editFields = { ...item };
			await this.searchInspections();
			//await this.searchSites();
			await this.getDocs();
			this.editDialog = true;
		},
		closeDialog() {
			if (this.internalEditMode) {
				this.internalEditMode = false;
				this.editFields = { ...this.fieldsHistory };
			}
			this.editDialog = false;
		},
		async searchSites() {
			this.loadingSites = true;
			let list = await interpretiveSites.get(
				0,
				5,
				'SiteName',
				'asc',
				this.siteSearch,
				'',
				'',
				'',
				'',
				'',
				'',
				'',
				'',
				''
			);
			this.siteList = list.body;
			this.loadingSites = false;
		},
		async searchInspections() {
			this.loadingInspections = true;
			let res = await interpretiveSites.getInspections(
				'',
				this.inspectionSearch,
				'',
				'Description',
				'asc',
				0,
				5
			);
			this.inspectionList = res.body;
			this.loadingInspections = false;
		},
		async getDocs() {
			let res = await interpretiveSites.getDocumentsGeneral(
				'actions',
				this.dataToEdit.item.ActionID
			);
			this.documments = [...res.data];
		},
	},
	watch: {
		siteSearch: {
			deep: true,
			handler() {
				this.searchSites();
			},
		},
	},
	computed: {
		...mapGetters({ username: 'fullName' }),
		docs() {
			return this.documments;
		},
		typeGrid() {
			return this.type === 'grid';
		},
		typeInspection() {
			return this.type === 'inspection';
		},
		typeSiteView() {
			return this.type === 'siteview';
		},
		textMode() {
			return this.internalEditMode ? 'Edit' : 'View';
		},
		cancelActive() {
			return this.internalEditMode ? '/Cancel' : '';
		},
	},
};
</script>
