<template>
	<div>
		<v-dialog v-if="mode == 'new'" v-model="dialog" persistent max-width="800px">
			<template v-slot:activator="{ on, attrs }">
				<v-btn v-if="!typeGrid" color="primary" outlined class="ml-auto mr-1" v-bind="attrs" v-on="on"
					@click="openNewDialog">
					ADD ACTION
				</v-btn>
				<v-btn v-else color="primary" class="mx-2 my-0" style="height: 40px;" v-bind="attrs" v-on="on"
					@click="openNewDialog">
					Add Action
				</v-btn>
			</template>
			<v-card>
				<v-card-title>
					<v-row>
						<v-col class="d-flex flex-row" cols="12">
							<span class="text-h5 mt-3">New Action</span>
							<v-spacer></v-spacer>
						</v-col>
					</v-row>
				</v-card-title>
				<v-card-text>
					<v-form v-model="valid" ref="actionDialog">
						<v-row>
							<v-col cols="6">
								<v-autocomplete v-if="typeGrid" outlined dense clearable @click="searchSites"
									:items="siteList" :search-input.sync="siteSearch" :loading="loadingSites"
									name="Site" item-text="SiteName" item-value="SiteID" label="Site"
									v-model="fields.SiteID" :rules="rules"></v-autocomplete>
								<v-text-field v-else outlined dense readonly name="Site Name" label="Site Name"
									v-model="Site.SiteName"></v-text-field>

								<v-text-field outlined dense name="ActionDescription" label="Action Description"
									v-model="fields.ActionDesc" :rules="rules"></v-text-field>

								<v-select outlined dense name="Priority" label="Priority" :items="priorityList"
									v-model="fields.Priority" :rules="rules"></v-select>
							</v-col>
							<v-col cols="6">
								<v-autocomplete v-if="!typeInspection" outlined dense clearable
									@click="searchInspections" :items="inspectionList"
									:search-input.sync="inspectionSearch" :loading="loadingInspections"
									name="Inspection" item-text="Description" item-value="InspectID" label="Inspection"
									v-model="fields.InspectID"></v-autocomplete>
								<v-text-field v-else outlined dense name="Inspection" label="Inspection" readonly
									v-model="Inspection.Description"></v-text-field>

								<v-text-field outlined dense name="CreatedBy" label="Created By"
									v-model="fields.CreatedBy" :rules="rules"></v-text-field>

								<v-menu ref="newCreatedDateMenu" v-model="newCreatedDateMenu"
									:close-on-content-click="false" transition="scale-transition" offset-y
									min-width="auto">
									<template v-slot:activator="{ on, attrs }">
										<v-text-field outlined dense v-model="fields.CreatedDate" label="Created Date"
											append-icon="mdi-calendar" readonly v-bind="attrs" v-on="on"
											:rules="rules"></v-text-field>
									</template>
									<v-date-picker v-model="fields.CreatedDate" no-title scrollable
										@input="newCreatedDateMenu = false"></v-date-picker>
								</v-menu>
							</v-col>
						</v-row>
						<v-row>
							<v-col cols="6">
								<v-menu ref="newToBeCompleteDateMenu" v-model="newToBeCompleteDateMenu"
									:close-on-content-click="false" transition="scale-transition" offset-y
									min-width="auto">
									<template v-slot:activator="{ on, attrs }">
										<v-text-field outlined dense v-model="fields.ToBeCompleteDate"
											label="To Be Completed Date" append-icon="mdi-calendar" readonly
											v-bind="attrs" v-on="on"></v-text-field>
									</template>
									<v-date-picker v-model="fields.ToBeCompleteDate" no-title scrollable
										@input="newToBeCompleteDateMenu = false"></v-date-picker>
								</v-menu>
							</v-col>
							<v-col cols="6">
								<v-textarea outlined dense name="Notes" label="Notes"
									v-model="fields.CompletionDesc"></v-textarea>
							</v-col>
						</v-row>
					</v-form>
				</v-card-text>
				<v-card-actions>
					<v-btn color="warning" outlined @click="dialog = false">
						Cancel
					</v-btn>
					<v-spacer></v-spacer>
					<v-btn color="primary" :disabled="!valid" @click="saveNew">
						Save
					</v-btn>
				</v-card-actions>
			</v-card>
		</v-dialog>
		<!-- edit dialog  -->
		<v-dialog v-if="mode == 'edit'" v-model="editDialog" persistent max-width="800px">
			<template #activator="{ on: dialog }">
				<v-tooltip bottom>
					<template #activator="{ on: tooltip }">
						<v-btn v-on="{ ...tooltip, ...dialog }" icon class="grey--text text--darken-2"
							@click="openEditDialog()">
							<v-icon small>mdi-eye</v-icon>
						</v-btn>
					</template>
					<span>View</span>
				</v-tooltip>
			</template>

			<v-card>
				<v-card-title>
					<v-row>
						<v-col class="d-flex flex-row" cols="12">
							<span class="text-h5 mt-3">{{ textMode }} Action</span>
							<v-spacer></v-spacer>
							<DeleteDialog :type="'Action'" :id="editFields.ActionID" @deleteItem="deleteItem" />
							<v-btn text v-if="!internalEditMode" color="success" @click="editMode">Edit</v-btn>
						</v-col>
					</v-row>
				</v-card-title>
				<v-card-text>
					<v-form v-model="form2" ref="actionEditDialog">
						<v-row>
							<v-col cols="6">
								<v-text-field outlined dense name="Site" disabled v-model="editFields.SiteName"
									label="Site"></v-text-field>

								<v-text-field :disabled="!internalEditMode" outlined dense name="CreatedBy"
									label="Created By" v-model="editFields.CreatedBy" :rules="rules"></v-text-field>
							</v-col>
							<v-col cols="6">
								<v-autocomplete outlined dense clearable :disabled="!internalEditMode"
									@click="searchInspections" :items="inspectionList"
									:search-input.sync="inspectionSearch" :loading="loadingInspections"
									name="Inspection" item-text="Description" return-object label="Inspection"
									v-model="editFields.Inspection"></v-autocomplete>

								<v-menu ref="editCreatedDateMenu" v-model="editCreatedDateMenu"
									:close-on-content-click="false" transition="scale-transition" offset-y
									min-width="auto" :disabled="!internalEditMode">
									<template v-slot:activator="{ on, attrs }">
										<v-text-field :disabled="!internalEditMode" outlined dense
											v-model="editFields.CreatedDate" label="Created Date"
											append-icon="mdi-calendar" readonly v-bind="attrs" v-on="on"
											:rules="rules"></v-text-field>
									</template>
									<v-date-picker v-model="editFields.CreatedDate" no-title scrollable
										@input="editCreatedDateMenu = false"></v-date-picker>
								</v-menu>
							</v-col>
						</v-row>
						<v-row>
							<v-col cols="6">
								<v-text-field :disabled="!internalEditMode" outlined dense name="ActionDescription"
									label="Action Description" v-model="editFields.ActionDesc"
									:rules="rules"></v-text-field>

								<v-select :disabled="!internalEditMode" outlined dense name="Priority" label="Priority"
									:items="priorityList" v-model="editFields.Priority" :rules="rules"></v-select>

								<v-menu ref="editToBeCompleteDateMenu" v-model="editToBeCompleteDateMenu"
									:close-on-content-click="false" transition="scale-transition" offset-y
									min-width="auto" :disabled="!internalEditMode">
									<template v-slot:activator="{ on, attrs }">
										<v-text-field :disabled="!internalEditMode" outlined dense
											v-model="editFields.ToBeCompleteDate" label="To Be Completed Date"
											append-icon="mdi-calendar" readonly v-bind="attrs" v-on="on"></v-text-field>
									</template>
									<v-date-picker v-model="editFields.ToBeCompleteDate" no-title scrollable
										@input="editToBeCompleteDateMenu = false"></v-date-picker>
								</v-menu>
							</v-col>
							<v-col cols="6">
								<v-text-field :disabled="!internalEditMode" outlined dense name="CompletedBy"
									label="Completed By" v-model="editFields.CompletedBy" :rules="rules"></v-text-field>

								<v-menu ref="editCompletedDateMenu" v-model="editCompletedDateMenu"
									:close-on-content-click="false" transition="scale-transition" offset-y
									min-width="auto" :disabled="!internalEditMode">
									<template v-slot:activator="{ on, attrs }">
										<v-text-field :disabled="!internalEditMode" outlined dense
											v-model="editFields.ActionCompleteDate" label="Completed Date"
											append-icon="mdi-calendar" readonly v-bind="attrs" v-on="on"></v-text-field>
									</template>
									<v-date-picker v-model="editFields.ActionCompleteDate" no-title scrollable
										@input="editCompletedDateMenu = false"></v-date-picker>
								</v-menu>
							</v-col>
						</v-row>
						<v-row>
							<v-col cols="12">
								<v-textarea :disabled="!internalEditMode" outlined dense name="Notes" label="Notes"
									v-model="editFields.CompletionDesc" :rules="rules"></v-textarea>
							</v-col>
						</v-row>
					</v-form>
					<DocumentHandler :doclist="docs" @newDocumment="newDocumment" :objID="{
						key: 'ActionID',
						doctype: 'actions',
						value: dataToEdit.item.ActionID,
					}" :displayDelete="internalEditMode" @deletedItem="deletedDoc" />
				</v-card-text>
				<v-card-actions>
					<v-btn color="warning" outlined @click="closeDialog()">
						{{ internalEditMode ? 'Cancel' : 'Close' }}
					</v-btn>
					<v-spacer></v-spacer>
					<v-btn color="primary" @click="saveEdit()" :disabled="!form2" v-if="internalEditMode">
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
		loadingSites: false,
		newCreatedDateMenu: false,
		newToBeCompleteDateMenu: false,
		editCreatedDateMenu: false,
		editToBeCompleteDateMenu: false,
		editCompletedDateMenu: false,
		//edit dialog
		form2: false,
		editing: false,
		editDialog: false,
		editFields: {},
		fieldsHistory: null,
		internalEditMode: false,
		priorityList: ['High', 'Med', 'Low'],
		documments: [],
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
		async newDocumment() {
			await this.getDocs();
		},
		async deletedDoc() {
			await this.getDocs();
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
			delete data.Inspection;
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
		normalizeDate(date) {
			if (!date) return null;
			return date.split('T')[0];
		},
		async openEditDialog() {
			const { item } = this.dataToEdit;
			this.editFields = { ...item };
			this.editFields.CreatedDate = this.normalizeDate(this.editFields.CreatedDate);
			this.editFields.ToBeCompleteDate = this.normalizeDate(this.editFields.ToBeCompleteDate);
			this.editFields.ActionCompleteDate = this.normalizeDate(this.editFields.ActionCompleteDate);
			await this.searchInspections();
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
	},
};
</script>
