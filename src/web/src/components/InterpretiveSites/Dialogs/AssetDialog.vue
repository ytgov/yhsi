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
				>
					ADD ASSET
				</v-btn>
				<v-btn
					v-else
					class="black--text mx-1"
					v-bind="attrs"
					v-on="on"
				>
					<v-icon class="mr-1">mdi-plus-circle-outline</v-icon>
					Add Asset
				</v-btn>
			</template>
			<v-card>
				<v-card-title>
					<span class="text-h5">New Asset</span>
				</v-card-title>
				<v-card-text>
					<v-container>
						<v-form
							v-model="valid"
							ref="assetDialog"
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
									<label v-else>
										<h3>{{ Site.SiteName }}</h3>
									</label>

									<v-select
										:items="availableCategories"
										outlined
										dense
										item-text="Category"
										item-value="Category"
										name="Category"
										label="Category"
										:loading="loadingCatalogs"
										v-model="fields.Category"
										:rules="rules"
									></v-select>

									<!-- <v-text-field
										outlined
										dense
										name="Owned By"
										label="Owned By"
										v-model="fields.OwnedBy"
										:rules="rules"
									></v-text-field> -->
								</v-col>
								<v-col cols="6">
									<v-select
										outlined
										dense
										name="Type"
										label="Type"
										item-text="Type"
										item-value="Type"
										:loading="loadingCatalogs"
										:items="availableTypes"
										v-model="fields.Type"
										:rules="rules"
									></v-select>

									<v-text-field
										outlined
										dense
										name="Installation Date"
										label="Installation Date"
										v-model="fields.InstallDate"
										:rules="dateRules"
									></v-text-field>

									<v-select
										outlined
										dense
										name="Maintained By"
										label="Maintained By"
										:items="maintainers"
										item-text="MaintOwnName"
										item-value="MaintOwnName"
										:loading="loadingCatalogs"
										v-model="fields.Maintainer"
										:rules="rules"
									></v-select>
								</v-col>
							</v-row>
							<v-row>
								<v-col cols="12">
									<v-textarea
										outlined
										dense
										name="Sign Text"
										label="Sign Text"
										v-model="fields.SignText"
										:rules="rules"
									></v-textarea>

									<v-textarea
										outlined
										dense
										name="Description"
										label="Description"
										v-model="fields.Description"
										:rules="rules"
									></v-textarea>
								</v-col>
							</v-row>
							<v-row>
								<v-col cols="12">
									<h3>Active</h3>
									<v-radio-group
										v-model="fields.Status"
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
									<v-text-field
										outlined
										dense
										name="DecommissionDate"
										label="Decommission Date"
										:rules="dateRules"
										v-model="fields.DecommissionDate"
									></v-text-field>
									<v-textarea
										outlined
										dense
										name="DecommissionNotes"
										label="Decommission Notes"
										v-model="fields.DecommissionNotes"
										:rules="rules"
									></v-textarea>
								</v-col>
							</v-row>
							<DocumentHandler :default="true" />
						</v-form>
					</v-container>
				</v-card-text>
				<v-card-actions>
					<v-btn
						color="blue darken-1"
						text
						@click="dialog = false"
					>
						Close
					</v-btn>
					<v-spacer></v-spacer>
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
					<v-col
						class="d-flex flex-row"
						cols="12"
					>
						<span class="text-h5 mt-3">{{ textMode }} Asset</span>
						<v-spacer></v-spacer>
						<v-btn
							color="success"
							v-if="!internalEditMode"
							text
							@click="editMode"
							>Edit</v-btn
						>
					</v-col>
				</v-card-title>
				<v-card-text>
					<v-container>
						<v-form
							v-model="form2"
							ref="assetEditDialog"
						>
							<v-row>
								<v-col cols="6">
									<!-- <v-autocomplete
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
										v-model="editFields.SiteID"
										:rules="rules"
									></v-autocomplete>
									<label v-else>
										<h3>{{ Site.SiteName }}</h3>
									</label> -->
									<v-text-field
										outlined
										dense
										name="Site"
										label="Site"
										readonly
										v-model="Site.SiteName"
									></v-text-field>

									<v-select
										:readonly="!internalEditMode"
										:items="availableCategories"
										outlined
										dense
										item-text="Category"
										item-value="Category"
										name="Category"
										label="Category"
										:loading="loadingCatalogs"
										v-model="editFields.Category"
										:rules="rules"
									></v-select>

									<!-- <v-text-field
										outlined
										dense
										name="Owned By"
										label="Owned By"
										v-model="editFields.OwnedBy"
										:rules="rules"
									></v-text-field> -->
								</v-col>
								<v-col cols="6">
									<v-select
										:readonly="!internalEditMode"
										outlined
										dense
										name="Type"
										label="Type"
										item-text="Type"
										item-value="Type"
										:loading="loadingCatalogs"
										:items="availableTypes"
										v-model="editFields.Type"
										:rules="rules"
									></v-select>

									<v-text-field
										:readonly="!internalEditMode"
										outlined
										dense
										name="Installation Date"
										label="Installation Date"
										v-model="editFields.InstallDate"
										:rules="dateRules"
									></v-text-field>

									<v-select
										:readonly="!internalEditMode"
										outlined
										dense
										name="Maintained By"
										label="Maintained By"
										:items="maintainers"
										item-text="MaintOwnName"
										item-value="MaintOwnName"
										:loading="loadingCatalogs"
										v-model="editFields.Maintainer"
										:rules="rules"
									></v-select>
								</v-col>
							</v-row>
							<v-row>
								<v-col cols="12">
									<v-textarea
										:readonly="!internalEditMode"
										outlined
										dense
										name="Sign Text"
										label="Sign Text"
										v-model="editFields.SignText"
										:rules="rules"
									></v-textarea>

									<v-textarea
										:readonly="!internalEditMode"
										outlined
										dense
										name="Description"
										label="Description"
										v-model="editFields.Description"
										:rules="rules"
									></v-textarea>
								</v-col>
							</v-row>
							<v-row>
								<v-col cols="12">
									<h3>Active</h3>
									<v-radio-group
										:readonly="!internalEditMode"
										v-model="editFields.Status"
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
									<v-text-field
										outlined
										:readonly="!internalEditMode"
										dense
										name="DecommissionDate"
										label="Decommission Date"
										:rules="dateRules"
										v-model="editFields.DecommissionDate"
									></v-text-field>
									<v-textarea
										outlined
										:readonly="!internalEditMode"
										dense
										name="DecommissionNotes"
										label="Decommission Notes"
										v-model="editFields.DecommissionNotes"
										:rules="rules"
									></v-textarea>
								</v-col>
							</v-row>
						</v-form>
						<DocumentHandler
							:doclist="docs"
							@newDocumment="newDocumment"
							:objID="{
								key: 'AssetID',
								value: dataToEdit.item.AssetID,
							}"
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
						Save {{ form2 }}
					</v-btn>
				</v-card-actions>
			</v-card>
		</v-dialog>
	</div>
</template>

<script>
import DocumentHandler from './DocumentHandler.vue';
import catalogs from '../../../controllers/catalogs';
import interpretiveSites from '../../../controllers/interpretive-sites';
export default {
	props: ['type', 'Site', 'data', 'mode', 'dataToEdit'],
	components: { DocumentHandler },
	data: () => ({
		//new Dialog
		dialog: false,
		valid: false,
		fields: {},
		siteList: [],
		siteSearch: '',
		rules: [(value) => !!value || 'Required.'],
		loadingSites: false,
		//edit dialog
		form2: false,
		editDialog: false,
		editFields: {},
		dateRules: [
			(v) => !!v || 'This field is required',
			(v) =>
				/^(?:(?:31(\/|-|\.)(?:0?[13578]|1[02]))\1|(?:(?:29|30)(\/|-|\.)(?:0?[13-9]|1[0-2])\2))(?:(?:1[6-9]|[2-9]\d)?\d{2})$|^(?:29(\/|-|\.)0?2\3(?:(?:(?:1[6-9]|[2-9]\d)?(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00))))$|^(?:0?[1-9]|1\d|2[0-8])(\/|-|\.)(?:(?:0?[1-9])|(?:1[0-2]))\4(?:(?:1[6-9]|[2-9]\d)?\d{2})$/.test(
					v
				) || 'Correct date format required.',
		],
		assetTypes: [],
		categoryTypes: [],
		maintainers: [],
		documments: [],
		loadingCatalogs: false,
		internalEditMode: false,
		fieldsHistory: null,
	}),
	mounted() {
		this.getTypes();
		this.getCategories();
		this.getMaintainers();
	},
	methods: {
		closeDialog() {
			if (this.internalEditMode) {
				this.internalEditMode = false;
				this.editFields = { ...this.fieldsHistory };
			}
			this.editDialog = false;
		},
		newDocumment(val) {
			this.documments.push(val.data);
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
		async getMaintainers() {
			this.loadingCatalogs = true;
			this.maintainers = await catalogs.getMaintainers();
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
			if (this.typeGrid) {
				const res = await interpretiveSites.putAsset(data);
				if (res) {
					await interpretiveSites.addDocumments({
						documments: this.documments,
						AssetID: res.AssetID,
					});
				}
				this.$emit('gridAssetEdited', res);
			} else {
				data.SiteID = this.Site.SiteID;
				data.new = true;
				this.$emit('editAsset', data);
			}

			this.$refs.assetEditDialog.reset();
			this.editDialog = false;
		},
		async openEditDialog() {
			const { item } = this.dataToEdit;
			this.editFields = { ...item };
			await this.getDocs();
			this.editDialog = true;
		},
		async searchSites() {
			this.loadingSites = true;
			console.log('function called');
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
			console.log(list);
			this.loadingSites = false;
		},
		async getDocs() {
			let res = await interpretiveSites.getDocummentsGeneral(
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
				console.log('changed');
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
		cancelActive() {
			return this.internalEditMode ? '/Cancel' : '';
		},
	},
};
</script>
