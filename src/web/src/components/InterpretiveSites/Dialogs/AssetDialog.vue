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
									{{ fields.SiteID }}
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
										:items="availableTypes"
										v-model="fields.Type"
										:rules="rules"
									></v-select>

									<v-text-field
										outlined
										dense
										name="Installation Date"
										label="Installation Date"
										v-model="fields.InstallationDate"
										:rules="rules"
									></v-text-field>

									<v-text-field
										outlined
										dense
										name="Maintained By"
										label="Maintained By"
										v-model="fields.MaintainedBy"
										:rules="rules"
									></v-text-field>
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
										:rules="rules"
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
							<DocumentHandler />
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
							<v-icon small>mdi-pencil</v-icon>
						</v-btn>
					</template>
					<span>Edit</span>
				</v-tooltip>
			</template>

			<v-card>
				<v-card-title>
					<span class="text-h5">Edit Asset</span>
				</v-card-title>
				<v-card-text>
					<v-container>
						<v-form
							v-model="form2"
							ref="assetEditDialog"
						>
							<v-row>
								<v-col cols="6">
									<v-select
										v-if="typeGrid"
										outlined
										dense
										:items="data"
										name="Site"
										item-text="SiteName"
										item-value="SiteID"
										label="Site"
										v-model="siteSearch"
										:rules="rules"
									></v-select>
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
										v-model="fields.SiteID"
										:rules="rules"
									></v-autocomplete> -->
									<label v-else>{{ Site.SiteName }}</label>

									<v-text-field
										outlined
										dense
										name="CreatedBy"
										label="Created By"
										v-model="editFields.CreatedBy"
										:rules="rules"
									></v-text-field>
								</v-col>
								<v-col cols="6">
									<v-text-field
										outlined
										dense
										name="Inspection"
										label="Inspection"
										v-model="editFields.Inspection"
										:rules="rules"
									></v-text-field>

									<v-text-field
										outlined
										dense
										name="CreatedDate"
										label="Created Date"
										v-model="editFields.CreatedDate"
										:rules="rules"
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
										v-model="editFields.ActionDesc"
										:rules="rules"
									></v-text-field>

									<v-text-field
										outlined
										dense
										name="Priority"
										label="Priority"
										v-model="editFields.Priority"
										:rules="rules"
									></v-text-field>

									<v-text-field
										outlined
										dense
										name="ToBeCompleted"
										label="To Be Completed Date"
										v-model="editFields.ToBeCompleted"
										:rules="rules"
									></v-text-field>
								</v-col>
								<v-col cols="6">
									<v-text-field
										outlined
										dense
										name="CompletedBy"
										label="Completed By"
										v-model="editFields.CompletedBy"
										:rules="rules"
									></v-text-field>

									<v-text-field
										outlined
										dense
										name="CompletedDate"
										label="Completed Date"
										v-model="editFields.ActionCompleteDate"
										:rules="rules"
									></v-text-field>
								</v-col>
							</v-row>
							<v-row>
								<v-col cols="12">
									<v-textarea
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
					</v-container>
				</v-card-text>
				<v-card-actions>
					<v-spacer></v-spacer>
					<v-btn
						color="blue darken-1"
						text
						@click="editDialog = false"
					>
						Close
					</v-btn>
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
		assetTypes: [],
		categoryTypes: [],
	}),
	mounted() {
		this.getTypes();
		this.getCategories();
	},
	methods: {
		async getTypes() {
			this.assetTypes = await catalogs.getAssetType();
		},
		async getCategories() {
			this.categoryTypes = await catalogs.getCategories();
		},
		async saveNew() {
			let data = { ...this.fields };
			if (this.typeGrid) {
				console.log('grid action', data);
				// ActionCompleteDate: "test"
				// ActionDesc: "tesst"
				// CompletedBy: "test"
				// CompletionDesc: "test"
				// CreatedBy: "test"
				// CreatedDate: "tsest"
				// Inspection: "test"
				// Priority: "test"
				// SiteID: 7
				// ToBeCompleted: "teset"

				// [ActionID] smallint,
				// [InspectID] smallint,
				// [SiteID] smallint,
				// [ActionDesc] varchar,
				// [ToBeCompleteDate] date,
				// [ActionCompleteDate] date,
				// [CompletionDesc] varchar,
				// [Priority] varchar,
				// [CreatedBy] varchar,
				// [CreatedDate] date,
				// [CompletedBy] varchar,
				//const res = await interpretiveSites.postAsset(data);
				//this.$emit('gridAssetAdded', res);
			} else {
				data.SiteID = this.Site.SiteID;
				data.new = true;
				this.$emit('newAsset', data);
			}
			this.$refs.assetDialog.reset();
			this.dialog = false;
		},
		async saveEdit() {
			let data = { ...this.editFields };
			if (this.typeGrid) {
				console.log('grid action', data);
				const res = await interpretiveSites.putAsset(data);
				this.$emit('gridAssetEdited', res);
			} else {
				data.SiteID = this.Site.SiteID;
				data.new = true;
				this.$emit('editAsset', data);
			}

			this.$refs.assetEditDialog.reset();
			this.editDialog = false;
		},
		openEditDialog() {
			const { item } = this.dataToEdit;
			this.editFields = { ...item };

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
	},
};
</script>
