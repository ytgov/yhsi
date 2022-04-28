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
								<v-col cols="6">
									<v-text-field
										outlined
										dense
										v-model="InspectedBy"
										label="Inspected By"
										:rules="rules"
									></v-text-field>
								</v-col>
								<v-col cols="6">
									<v-text-field
										outlined
										dense
										v-model="InspectionDate"
										label="Inspection Date"
										:rules="rules"
									></v-text-field>
								</v-col>
								<v-col cols="12">
									<v-textarea
										outlined
										dense
										v-model="Description"
										label="Description"
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
						@click="saveNew()"
					>
						Save
					</v-btn>
				</v-card-actions>
			</v-card>
		</v-dialog>

		<!-- edit dialog -->
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
							<v-icon small>mdi-pencil</v-icon>
						</v-btn>
					</template>
					<span>Edit</span>
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
										v-model="InspectedByEdit"
										label="Inspected By"
										:rules="rules"
									></v-text-field>
								</v-col>
								<v-col cols="6">
									<v-text-field
										outlined
										dense
										v-model="InspectionDateEdit"
										label="Inspection Date"
										:rules="rules"
									></v-text-field>
								</v-col>
								<v-col cols="12">
									<v-textarea
										outlined
										dense
										v-model="DescriptionEdit"
										label="Description"
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
export default {
	props: ['mode', 'inspectionToEdit'],
	data: () => ({
		dialog: false,
		InspectionDate: '',
		InspectedBy: '',
		Description: '',
		valid: false,
		rules: [(value) => !!value || 'Required.'],
		//editDialog
		editDialog: false,
		form2: false,
		InspectionDateEdit: '',
		InspectedByEdit: '',
		DescriptionEdit: '',
	}),
	methods: {
		saveNew() {
			this.$emit('newInspection', {
				InspectionDate: this.InspectionDate,
				Description: this.Description,
				InspectedBy: this.InspectedBy,
				new: true,
			});
			this.$refs.inspectionDialog.reset();
			this.dialog = false;
		},
		saveEdit() {
			this.$emit(
				'editInspection',
				{
					Source: this.SourceEdit,
					edited: true,
					SourceID: this.sourceToEdit.Source.SourceID,
				},
				this.sourceToEdit.index
			);
			this.$refs.inspectionEditDialog.reset();
			this.editDialog = false;
		},
		openEditDialog() {
			this.SourceEdit = this.sourceToEdit.Source.Source;
			this.editDialog = true;
		},
	},
};
</script>
