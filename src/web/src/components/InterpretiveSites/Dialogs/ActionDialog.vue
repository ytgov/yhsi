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
					color="primary"
					outlined
					class="ml-auto mr-1"
					v-bind="attrs"
					v-on="on"
				>
					ADD ACTION
				</v-btn>
			</template>
			<v-card>
				<v-card-title>
					<span class="text-h5">New Action</span>
				</v-card-title>
				<v-card-text>
					<v-container>
						<v-form
							v-model="valid"
							ref="actionDialog"
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
										v-model="fields.SiteID"
										:rules="rules"
									></v-select>
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
										v-model="fields.ToBeCompleted"
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
					<span class="text-h5">Edit Action</span>
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
										v-if="typeGrid"
										outlined
										dense
										:items="data"
										name="Site"
										item-text="SiteName"
										item-value="SiteID"
										label="Site"
										v-model="editFields.SiteID"
										:rules="rules"
									></v-select>
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
import interpretiveSites from '../../../controllers/interpretive-sites';
export default {
	props: ['type', 'Site', 'data', 'mode', 'dataToEdit'],
	data: () => ({
		//new Dialog
		dialog: false,
		valid: false,
		fields: {},
		sites: [],
		rules: [(value) => !!value || 'Required.'],
		//edit dialog
		form2: false,
		editDialog: false,
		editFields: {},
	}),
	methods: {
		async saveNew() {
			let data = { ...this.fields };
			if (this.typeGrid) {
				console.log('grid action', data);
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
			this.editDialog = false;
		},
		openEditDialog() {
			const { item } = this.dataToEdit;
			this.editFields = { ...item };

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
