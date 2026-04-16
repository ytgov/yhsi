<template>
	<div>
		<v-dialog v-if="mode == 'new'" v-model="dialog" persistent max-width="800px">
			<template v-slot:activator="{ on, attrs }">
				<v-btn v-if="!typeGrid" color="primary" outlined class="ml-auto mr-1" v-bind="attrs" v-on="on">
					ADD ASSET
				</v-btn>
				<v-btn v-else color="primary" class="mx-2 my-0" style="height: 40px;" v-bind="attrs" v-on="on">
					Add Asset
				</v-btn>
			</template>
			<v-card>
				<v-card-title>
					<span class="text-h5">New Asset</span>
				</v-card-title>
				<v-card-text>
					<v-form v-model="valid" ref="assetDialog">
						<v-row>
							<v-col cols="6">
								<v-autocomplete v-if="typeGrid" outlined dense clearable @click="searchSites"
									:items="siteList" :search-input.sync="siteSearch" :loading="loadingSites"
									name="Site" item-text="SiteName" item-value="SiteID" label="Site"
									v-model="fields.SiteID" :rules="rules"></v-autocomplete>
								<v-text-field v-else outlined dense readonly name="Site Name" label="Site Name"
									v-model="Site.SiteName"></v-text-field>

								<v-select :items="availableCategories" outlined dense item-text="Category"
									item-value="Category" name="Category" label="Category" :loading="loadingCatalogs"
									v-model="fields.Category" :rules="rules"></v-select>

								<v-select outlined dense name="Maintained By" label="Maintained By"
									:items="maintainerOptions" item-text="MaintOwnName" item-value="MaintOwnName"
									:loading="loadingCatalogs" v-model="fields.Maintainer"></v-select>
							</v-col>
							<v-col cols="6">
								<v-select outlined dense name="Type" label="Type" item-text="Type" item-value="Type"
									:loading="loadingCatalogs" :items="availableTypes" v-model="fields.Type"
									:rules="rules"></v-select>

								<v-menu ref="newInstallDateMenu" v-model="newInstallDateMenu"
									:close-on-content-click="false" transition="scale-transition" offset-y
									min-width="auto">
									<template v-slot:activator="{ on, attrs }">
										<v-text-field outlined dense v-model="fields.InstallDate"
											label="Installation Date" append-icon="mdi-calendar" readonly v-bind="attrs"
											v-on="on"></v-text-field>
									</template>
									<v-date-picker v-model="fields.InstallDate" no-title scrollable
										@input="newInstallDateMenu = false"></v-date-picker>
								</v-menu>

								<v-radio-group v-model="fields.Status" row label="Active" class="mt-0">
									<v-radio label="Yes" value="Yes"></v-radio>
									<v-radio label="No" value="No"></v-radio>
								</v-radio-group>
							</v-col>
						</v-row>
						<v-row>
							<v-col cols="6">
								<v-textarea outlined dense name="Description" label="Description"
									v-model="fields.Description" :rules="rules"></v-textarea>
							</v-col>
							<v-col cols="6">
								<v-textarea outlined dense name="Sign Text" label="Sign Text"
									v-model="fields.SignText"></v-textarea>
							</v-col>
						</v-row>
						<v-row>
							<v-col cols="6">
								<v-menu ref="newDecommissionDateMenu" v-model="newDecommissionDateMenu"
									:close-on-content-click="false" transition="scale-transition" offset-y
									min-width="auto">
									<template v-slot:activator="{ on, attrs }">
										<v-text-field outlined dense v-model="fields.DecommissionDate"
											label="Decommission Date" append-icon="mdi-calendar" readonly v-bind="attrs"
											v-on="on"></v-text-field>
									</template>
									<v-date-picker v-model="fields.DecommissionDate" no-title scrollable
										@input="newDecommissionDateMenu = false"></v-date-picker>
								</v-menu>
							</v-col>
							<v-col cols="6">
								<v-textarea outlined dense name="DecommissionNotes" label="Decommission Notes"
									v-model="fields.DecommissionNotes"></v-textarea>
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
					<v-col class="d-flex flex-row" cols="12">
						<span class="text-h5 mt-3">{{ textMode }} Asset</span>
						<v-spacer></v-spacer>
						<DeleteDialog :type="'Asset'" :id="editFields.AssetID" @deleteItem="deleteItem" />
						<v-btn color="success" v-if="!internalEditMode" text @click="editMode">Edit</v-btn>
					</v-col>
				</v-card-title>
				<v-card-text>
					<v-form v-model="form2" ref="assetEditDialog">
						<v-row>
							<v-col cols="6">
								<v-text-field outlined dense name="Site" label="Site" disabled
									v-model="editFields.SiteName"></v-text-field>

								<v-select :disabled="!internalEditMode" :items="availableCategories" outlined dense
									item-text="Category" item-value="Category" name="Category" label="Category"
									:loading="loadingCatalogs" v-model="editFields.Category" :rules="rules"></v-select>

								<MaintainerList :list="maintainers" :mode="internalEditMode ? 'edit' : 'view'"
									@newMaintainer="newMaintainer" @deleteMaintainer="deleteMaintainer" />
							</v-col>
							<v-col cols="6">
								<v-select :disabled="!internalEditMode" outlined dense name="Type" label="Type"
									item-text="Type" item-value="Type" :loading="loadingCatalogs"
									:items="availableTypes" v-model="editFields.Type" :rules="rules"></v-select>

								<v-menu ref="editInstallDateMenu" v-model="editInstallDateMenu"
									:close-on-content-click="false" transition="scale-transition" offset-y
									min-width="auto" :disabled="!internalEditMode">
									<template v-slot:activator="{ on, attrs }">
										<v-text-field :disabled="!internalEditMode" outlined dense
											v-model="editFields.InstallDate" label="Installation Date"
											append-icon="mdi-calendar" readonly v-bind="attrs" v-on="on"></v-text-field>
									</template>
									<v-date-picker v-model="editFields.InstallDate" no-title scrollable
										@input="editInstallDateMenu = false"></v-date-picker>
								</v-menu>

								<v-radio-group :disabled="!internalEditMode" v-model="editFields.Status" row
									class="mt-0">
									<v-radio label="Active" value="Yes"></v-radio>
									<v-radio label="Inactive" value="No"></v-radio>
								</v-radio-group>
							</v-col>
						</v-row>
						<v-row>
							<v-col cols="6">
								<v-textarea :disabled="!internalEditMode" outlined dense name="Description"
									label="Description" v-model="editFields.Description" :rules="rules"></v-textarea>
							</v-col>
							<v-col cols="6">
								<v-textarea :disabled="!internalEditMode" outlined dense name="Sign Text"
									label="Sign Text" v-model="editFields.SignText"></v-textarea>
							</v-col>
						</v-row>
						<v-row>
							<v-col cols="6">
								<v-menu ref="editDecommissionDateMenu" v-model="editDecommissionDateMenu"
									:close-on-content-click="false" transition="scale-transition" offset-y
									min-width="auto" :disabled="!internalEditMode">
									<template v-slot:activator="{ on, attrs }">
										<v-text-field :disabled="!internalEditMode" outlined dense
											v-model="editFields.DecommissionDate" label="Decommission Date"
											append-icon="mdi-calendar" readonly v-bind="attrs" v-on="on"></v-text-field>
									</template>
									<v-date-picker v-model="editFields.DecommissionDate" no-title scrollable
										@input="editDecommissionDateMenu = false"></v-date-picker>
								</v-menu>
							</v-col>
							<v-col cols="6">
								<v-textarea :disabled="!internalEditMode" outlined dense name="DecommissionNotes"
									label="Decommission Notes" v-model="editFields.DecommissionNotes"></v-textarea>
							</v-col>
						</v-row>
					</v-form>
					<DocumentHandler :doclist="docs" @newDocumment="newDocumment" :displayDelete="internalEditMode"
						:objID="{
							key: 'AssetID',
							doctype: 'assets',
							value: dataToEdit.item.AssetID,
						}" @deletedItem="deletedDoc" />
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
import MaintainerList from '../InterpetiveSiteComponents/MaintainerList.vue';
import DeleteDialog from './DeleteDialog.vue';
import DocumentHandler from './DocumentHandler.vue';
import catalogs from '../../../controllers/catalogs';
import interpretiveSites from '../../../controllers/interpretive-sites';
export default {
	props: ['type', 'Site', 'data', 'mode', 'dataToEdit'],
	components: { DocumentHandler, DeleteDialog, MaintainerList },
	data: () => ({
		//new Dialog
		dialog: false,
		valid: false,
		fields: {},
		siteList: [],
		siteSearch: '',
		rules: [(value) => !!value || 'Required.'],
		loadingSites: false,
		newInstallDateMenu: false,
		newDecommissionDateMenu: false,
		editInstallDateMenu: false,
		editDecommissionDateMenu: false,
		//edit dialog
		form2: false,
		editDialog: false,
		editFields: {},
		assetTypes: [],
		categoryTypes: [],
		maintainers: [],
		maintainerOptions: [],
		documments: [],
		loadingCatalogs: false,
		internalEditMode: false,
		fieldsHistory: null,
	}),
	mounted() {
		this.getTypes();
		this.getCategories();
		this.getMaintainerOptions();
	},
	methods: {
		closeDialog() {
			if (this.internalEditMode) {
				this.internalEditMode = false;
				this.editFields = { ...this.fieldsHistory };
			}
			this.editDialog = false;
		},
		async deleteItem(id) {
			await interpretiveSites.removeAsset(id);
			this.$emit('deletedAsset', this.dataToEdit.index);
			this.editDialog = false;
		},
		async newDocumment() {
			await this.getDocs();
		},
		async deletedDoc() {
			await this.getDocs();
		},
		newMaintainer(val) {
			val.AssetID = this.dataToEdit.item.AssetID;
			this.maintainers.push(val);
		},
		deleteMaintainer(id) {
			this.maintainers = this.maintainers.map((x) => {
				if (x.MaintID === id) {
					x.deleted = true;
				}
				return x;
			});
		},
		editMode() {
			this.fieldsHistory = { ...this.editFields };
			this.internalEditMode = true;
		},
		async getTypes() {
			this.loadingCatalogs = true;
			this.assetTypes = await catalogs.getAssetType();
			this.loadingCatalogs = false;
		},
		async getCategories() {
			this.loadingCatalogs = true;
			this.categoryTypes = await catalogs.getCategories();
			this.loadingCatalogs = false;
		},
		async getMaintainerOptions() {
			this.maintainerOptions = await catalogs.getMaintainers();
		},
		async getMaintainers() {
			this.loadingCatalogs = true;
			this.maintainers = await interpretiveSites.getMaintainersByAssetID(
				this.dataToEdit.item.AssetID
			);
			this.loadingCatalogs = false;
		},
		async saveNew() {
			let item = { ...this.fields };
			if (this.typeGrid) {
				const res = await interpretiveSites.postAsset({ item });
				this.$emit('gridAssetAdded', res);
			} else {
				item.SiteID = this.Site.SiteID;
				const res = await interpretiveSites.postAsset({ item });
				//item.new = true;
				this.$emit('newAsset', res);
			}
			this.$refs.assetDialog.reset();
			this.dialog = false;
		},
		async saveEdit() {
			let data = { ...this.editFields };
			delete data.Maintainer;
			delete data.AssetID;
			delete data.SiteName;
			if (this.typeGrid) {
				const res = await interpretiveSites.putAsset(this.editFields.AssetID, {
					item: data,
					maintainers: this.maintainers,
				});

				this.$emit('gridAssetEdited', res);
			} else {
				data.SiteID = this.Site.SiteID;
				// data.new = true;
				// this.$emit('editAsset', data);

				const res = await interpretiveSites.putAsset(this.editFields.AssetID, {
					item: data,
					maintainers: this.maintainers,
				});
				this.$emit('editAsset', { data: res, index: this.dataToEdit.index });
			}

			this.$refs.assetEditDialog.reset();
			this.editDialog = false;
		},
		normalizeDate(date) {
			if (!date) return null;
			return date.split('T')[0];
		},
		async openEditDialog() {
			const { item } = this.dataToEdit;
			this.editFields = { ...item };
			this.editFields.InstallDate = this.normalizeDate(this.editFields.InstallDate);
			this.editFields.DecommissionDate = this.normalizeDate(this.editFields.DecommissionDate);
			await this.getDocs();
			await this.getMaintainers();
			this.editDialog = true;
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
		async getDocs() {
			let res = await interpretiveSites.getDocumentsGeneral(
				'assets',
				this.dataToEdit.item.AssetID
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
		docs() {
			return this.documments ? this.documments : [];
		},
		typeGrid() {
			return this.type === 'grid';
		},
		typeSiteView() {
			return this.type === 'siteview';
		},
		availableTypes() {
			return this.assetTypes;
		},
		availableCategories() {
			return this.categoryTypes;
		},
		textMode() {
			return this.internalEditMode ? 'Edit' : 'View';
		},
	},
};
</script>
