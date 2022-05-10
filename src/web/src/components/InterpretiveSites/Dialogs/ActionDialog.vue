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
					ADD ACTION
				</v-btn>
				<v-btn
					v-else
					class="black--text mx-1"
					v-bind="attrs"
					v-on="on"
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
									<label v-else>
										<h3>{{ Site.SiteName }} test</h3>
									</label>

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
									<v-text-field
										outlined
										dense
										name="Inspection"
										label="Inspection"
										v-model="fields.Inspection"
										:rules="rules"
									></v-text-field>

									<v-text-field
										outlined
										dense
										name="CreatedDate"
										label="Created Date"
										v-model="fields.CreatedDate"
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
										v-model="fields.ActionDesc"
										:rules="rules"
									></v-text-field>

									<v-text-field
										outlined
										dense
										name="Priority"
										label="Priority"
										v-model="fields.Priority"
										:rules="rules"
									></v-text-field>

									<v-text-field
										outlined
										dense
										name="ToBeCompleted"
										label="To Be Completed Date"
										v-model="fields.ToBeCompleteDate"
										:rules="rules"
									></v-text-field>
								</v-col>
								<v-col cols="6">
									<v-text-field
										outlined
										dense
										name="CompletedBy"
										label="Completed By"
										v-model="fields.CompletedBy"
										:rules="rules"
									></v-text-field>

									<v-text-field
										outlined
										dense
										name="CompletedDate"
										label="Completed Date"
										v-model="fields.ActionCompleteDate"
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
							<v-icon small>mdi-pencil</v-icon>
						</v-btn>
					</template>
					<span>Edit</span>
				</v-tooltip>
			</template>

			<v-card>
				<v-card-title>
					<v-row>
						<v-col
							class="d-flex flex-row"
							cols="12"
						>
							<span class="text-h5 mt-3">Edit Action</span>
							<v-spacer></v-spacer>
							<v-btn
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
									<v-select
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
										v-model="editFields.ToBeCompleteDate"
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
import interpretiveSites from '../../../controllers/interpretive-sites';
import DocumentHandler from './DocumentHandler.vue';
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
		editing: false,
		editDialog: false,
		editFields: {},
		documentHeaders: [
			{ text: 'Document Name', value: 'DocumentName' },
			{ text: 'Date Uploaded', value: 'DateUploaded' },
			{ text: 'Uploader', value: 'Uploader' },
		],
		newDocuments: [],
		editedDocuments: [],
	}),
	methods: {
		documentAdded(val) {
			this.fields.documents.push(val);
		},
		editMode() {
			this.editing = true;
		},
		async saveNew() {
			let data = { ...this.fields };
			if (this.typeGrid) {
				console.log('grid action', data);
				this.fields.CompletedBy = '';
				console.log(`
        [ActionID] smallint,
				[InspectID] smallint,
				[SiteID] smallint,
				[ActionDesc] varchar,
				[ToBeCompleteDate] date,
				[ActionCompleteDate] date,
				[CompletionDesc] varchar,
				[Priority] varchar,
				[CreatedBy] varchar,
				[CreatedDate] date,
				[CompletedBy] varchar
        `);

				const res = await interpretiveSites.postAction(data);
				this.$emit('gridActionAdded', res);
			} else {
				data.SiteID = this.Site.SiteID;
				data.new = true;
				this.$emit('newAction', data);
			}
			this.$refs.actionDialog.reset();
			this.dialog = false;
		},
		async saveEdit() {
			let data = { ...this.editFields };
			if (this.typeGrid) {
				console.log('grid action', data);
				const res = await interpretiveSites.putAction(data);
				this.$emit('gridActionEdited', res);
			} else {
				data.SiteID = this.Site.SiteID;
				data.new = true;
				this.$emit('editAction', data);
			}

			this.$refs.actionEditDialog.reset();
			this.editing = false;
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
	},
};
</script>
