<template>
	<div>
		<v-dialog
			v-if="mode == 'new'"
			v-model="dialog"
			persistent
			max-width="600px"
		>
			<template v-slot:activator="{ on, attrs }">
				<v-btn
					color="primary"
					v-bind="attrs"
					v-on="on"
					outlined
					class="ml-auto mr-1"
				>
					ADD INSPECTION
				</v-btn>
			</template>
			<v-card>
				<v-card-title>
					<span class="text-h5">New Inspection</span>
				</v-card-title>
				<v-card-text>
					<v-container>
						<v-form
							v-model="valid"
							ref="inspectionDialog"
						>
							<v-row>
								<v-col cols="12">
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
								</v-col>
								<v-col cols="6">
									<v-text-field
										outlined
										dense
										v-model="fields.InspectedBy"
										label="Inspected By"
										:rules="rules"
									></v-text-field>
								</v-col>
								<v-col cols="6">
									<v-text-field
										outlined
										dense
										v-model="fields.InspectionDate"
										label="Inspection Date"
										:rules="dateRules"
									></v-text-field>
								</v-col>
								<v-col cols="12">
									<v-textarea
										outlined
										dense
										v-model="fields.Description"
										label="Description"
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
						@click="saveNew()"
					>
						Save
					</v-btn>
				</v-card-actions>
			</v-card>
		</v-dialog>

		<!-- view/edit dialog -->
		<v-dialog
			v-if="mode == 'edit'"
			v-model="editDialog"
			persistent
			max-width="600px"
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
					<span class="text-h5">Edit Inspection</span>
				</v-card-title>
				<v-card-text>
					<v-container>
						<v-form
							v-model="form2"
							ref="inspectionEditDialog"
						>
							<v-row>
								<v-col cols="6">
									<v-text-field
										outlined
										dense
										v-model="editFields.InspectedBy"
										label="Inspected By"
										:rules="rules"
									></v-text-field>
								</v-col>
								<v-col cols="6">
									<v-text-field
										outlined
										dense
										v-model="editFields.InspectionDate"
										label="Inspection Date"
										:rules="rules"
									></v-text-field>
								</v-col>
								<v-col cols="12">
									<v-textarea
										outlined
										dense
										v-model="editFields.Description"
										label="Description"
										:rules="rules"
									></v-textarea>
								</v-col>
							</v-row>
							<v-divider></v-divider>
							<v-row>
								<v-col cols="12">
									<v-row>
										<v-col
											cols="12"
											class="d-flex flex-row"
										>
											<v-spacer></v-spacer>
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
											></v-data-table>
										</v-col>
									</v-row>
								</v-col>
							</v-row>
							<v-divider></v-divider>
							<DocumentHandler :data="fields.documents" />
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
import ActionDialog from './ActionDialog.vue';
import interpretiveSites from '../../../controllers/interpretive-sites';
import DocumentHandler from './DocumentHandler.vue';
export default {
	props: ['mode', 'Site', 'dataToEdit'],
	components: { DocumentHandler, ActionDialog },
	data: () => ({
		dialog: false,
		fields: {},
		editFields: {},
		valid: false,
		rules: [(value) => !!value || 'Required.'],
		//editDialog
		editDialog: false,
		form2: false,
		actionHeaders: [
			{ text: 'Action Required', value: 'ActionDesc' },
			{ text: 'To be Completed by', value: 'CompletedBy' },
			{ text: 'Priority', value: 'Priority' },
			{ text: 'Completed date', value: 'ActionCompleteDate' },
			{ text: 'Completion Notes', value: 'CompletionDesc' },
		],
		dateRules: [
			(v) => !!v || 'This field is required',
			(v) =>
				/^(?:(?:31(\/|-|\.)(?:0?[13578]|1[02]))\1|(?:(?:29|30)(\/|-|\.)(?:0?[13-9]|1[0-2])\2))(?:(?:1[6-9]|[2-9]\d)?\d{2})$|^(?:29(\/|-|\.)0?2\3(?:(?:(?:1[6-9]|[2-9]\d)?(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00))))$|^(?:0?[1-9]|1\d|2[0-8])(\/|-|\.)(?:(?:0?[1-9])|(?:1[0-2]))\4(?:(?:1[6-9]|[2-9]\d)?\d{2})$/.test(
					v
				) || 'Correct date format required.',
		],
		siteList: [],
		siteSearch: '',
		loadingSites: false,
	}),
	methods: {
		newAction() {},
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
			this.loadingSites = false;
		},
		async saveNew() {
			let { InspectionDate, InspectedBy, Description } = this.fields;
			// this.$emit('newInspection', {
			// 	InspectionDate,
			// 	InspectedBy,
			// 	Description,
			// 	new: true,
			// });
			if (!this.typeGrid) {
				let res = await interpretiveSites.postInspection({
					item: {
						SiteID: this.Site.SiteID,
						InspectionDate,
						InspectedBy,
						Description,
					},
				});
				this.$emit('newInspection', res);
			}

			this.$refs.inspectionDialog.reset();
			this.dialog = false;
		},
		saveEdit() {
			let { InspectionDate, InspectedBy, Description } = this.editFields;
			this.$emit(
				'editInspection',
				{
					InspectionDate,
					InspectedBy,
					Description,
					edited: true,
				},
				this.dataToEdit.index
			);
			this.$refs.inspectionEditDialog.reset();
			this.editDialog = false;
		},
		openEditDialog() {
			this.editFields = { ...this.dataToEdit.item };
			this.editDialog = true;
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
