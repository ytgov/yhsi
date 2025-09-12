<template>
	<v-row justify="center">
		<v-dialog
			v-model="dialog"
			persistent
			max-width="600px"
		>
			<v-card>
				<v-card-title>
					<span class="text-h5">Edit Category</span>
				</v-card-title>
				<v-card-text>
					<v-row>
						<v-col cols="12">
							<v-form
								ref="editCategoryForm"
								:lazy-validation="false"
								v-model="valid"
							>
								<v-row class="mt-2">
									<v-col cols="6">
										<v-text-field
											outlined
											dense
											ref="Category"
											label="Category"
											v-model="data.Category"
											:rules="generalRules"
										></v-text-field>
									</v-col>
									<v-col cols="6">
										<v-select
											outlined
											dense
											ref="Status"
											label="Status"
											:items="statuses"
											item-text="text"
											item-value="value"
											v-model="data.Status"
										></v-select>
									</v-col>
								</v-row>
							</v-form>
						</v-col>
					</v-row>
				</v-card-text>
				<v-card-actions>
					<v-btn
						text
						@click="closeDialog"
						class="black--text"
					>
						Close
					</v-btn>
					<v-spacer></v-spacer>
					<v-btn
						color="success"
						text
						:disabled="!valid"
						@click="save"
					>
						Save
					</v-btn>
				</v-card-actions>
			</v-card>
		</v-dialog>
	</v-row>
</template>

<script>
import catalogs from '../../../../controllers/catalogs';
export default {
	props: ['dialog', 'data'],
	data: () => ({
		input: null,
		valid: false,
		generalRules: [(v) => !!v || 'This field is required'],
		statuses: [
			{ text: 'Active', value: true },
			{ text: 'Inactive', value: false },
		],
	}),
	methods: {
		closeDialog() {
			this.$emit('closeEditDialog');
		},
		async save() {
			let data = {
				data: { Category: this.data.Category, Status: this.data.Status },
			};
			await catalogs.putCategory(this.data.CatLUpID, data);
			this.$router.go();
		},
		//not needed
		validate() {
			this.$refs.editCategoryForm.validate();
		},
		reset() {
			this.$refs.editCategoryForm.reset();
		},
		resetValidation() {
			this.$refs.editCategoryForm.resetValidation();
		},
	},
	watch: {
		data: {
			handler() {
				this.input = this.data.Type;
			},
			deep: true,
		},
	},
};
</script>
