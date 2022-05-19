<template>
	<v-row>
		<v-col cols="12">
			<v-row>
				<v-col
					cols="12"
					class="d-flex flex-row"
				>
					<v-spacer></v-spacer>
					<v-dialog
						v-model="dialog"
						persistent
						max-width="490"
					>
						<template v-slot:activator="{ on, attrs }">
							<v-btn
								color="primary"
								outlined
								v-if="!isDefault"
								v-bind="attrs"
								v-on="on"
							>
								ADD DOCUMENT
							</v-btn>
						</template>
						<v-card>
							<v-card-title class="text-h5"> New Documment </v-card-title>
							<v-card-text>
								<v-container>
									<v-form
										v-model="form"
										ref="docummentDialog"
									>
										<v-row>
											<v-col cols="12">
												<v-text-field
													:readonly="loading"
													outlined
													dense
													name="Description"
													label="Description"
													v-model="fields.DocDesc"
													:rules="rules"
												></v-text-field>

												<v-file-input
													:disabled="loading"
													outlined
													dense
													accept="/*"
													label="Choose documment for upload"
													prepend-icon="mdi-file"
													@change="onFileSelected"
													:rules="rules"
												></v-file-input>
											</v-col>
										</v-row>
									</v-form>
								</v-container>
							</v-card-text>
							<v-card-actions>
								<v-btn
									color="grey darken-1"
									text
									@click="dialog = false"
								>
									Close
								</v-btn>
								<v-spacer></v-spacer>
								<v-btn
									color="green darken-1"
									text
									@click="newDocument"
									:loading="loading"
								>
									Save
								</v-btn>
							</v-card-actions>
						</v-card>
					</v-dialog>
				</v-col>
			</v-row>
			<v-row>
				<v-col cols="12">
					<v-data-table
						:headers="headers"
						:items="doclist"
						:items-per-page="5"
						:no-data-text="
							isDefault
								? 'You will be able to add documments once the general object is created'
								: 'No documments added'
						"
						class="elevation-0"
					>
						<template v-slot:item="{ item }">
							<tr>
								<td class="parent-row">
									{{ item.DocDesc }}
								</td>
								<td class="child-row">{{ item.UploadDate }}</td>
								<td class="child-row">{{ item.UploadedBy }}</td>
								<td class="child-row">
									<DeleteDialog
										v-if="displayDelete"
										:type="'Documment'"
										:id="item.DocID"
										@deleteItem="deleteItem"
										:mode="'table'"
									/>
									<v-btn
										icon
										@click="downloadDoc(item.DocID)"
										:loading="downloading"
									>
										<v-icon>mdi-download</v-icon>
									</v-btn>
								</td>
							</tr>
						</template></v-data-table
					>
				</v-col>
			</v-row>
		</v-col>
	</v-row>
</template>

<script>
import downloadFile from '../../../utils/dataToFile';
import DeleteDialog from './DeleteDialog.vue';
import { mapGetters } from 'vuex';
import interpretiveSites from '../../../controllers/interpretive-sites';
export default {
	name: 'DocumentHandler',
	props: ['doclist', 'default', 'objID', 'displayDelete'], // objID :{ key: AssetID, value: 1, doctype: 'assets' }
	components: { DeleteDialog },
	data: () => ({
		loading: false,
		headers: [
			{ text: 'Document Description', value: 'DocDesc' },
			{ text: 'Date Uploaded', value: 'UploadDate' },
			{ text: 'Uploader', value: 'UploadedBy' },
			{ text: '', value: 'actions' },
		],
		dialog: false,
		fields: {},
		sendObj: {},
		form: false,
		rules: [(value) => !!value || 'Required.'],
		currentRemoval: null,
		downloading: false,
	}),
	methods: {
		async newDocument() {
			this.loading = true;
			const { DocDesc } = this.fields;

			this.sendObj[this.objID.key] = this.objID.value;
			this.sendObj.DocDesc = DocDesc;
			this.sendObj.UploadedBy = this.username; //fullName
			this.sendObj.FileType = this.file.name.replace(/^.*\./, '');
			const formData = new FormData();
			let prevFields = Object.entries(this.sendObj);
			for (let i = 0; i < prevFields.length; i++) {
				formData.append(prevFields[i][0], prevFields[i][1]);
			}
			formData.append('file', this.file);
			let res = await interpretiveSites.newDocumment(formData);
			this.$emit('newDocumment', res);

			this.loading = false;
			this.dialog = false;
		},
		async removeDocumment() {},
		async deleteItem(id) {
			await interpretiveSites.removeDocummentGeneral(
				this.objID.doctype,
				id
				//this.objID.value
			);
		},
		async downloadDoc(id) {
			console.log('downloading');
			let res = await interpretiveSites.downloadDocByID(id);
			console.log('file', res.data);
			downloadFile(res.data[0].Document, 'file', res.data[0].FileType);
		},
		textData() {
			return this.default
				? 'You will be able to add documments once the general object is created'
				: 'No documments added';
		},
		async onFileSelected(event) {
			this.file = event;
		},
	},
	computed: {
		isDefault() {
			return this.default;
		},
		...mapGetters({ username: 'fullName' }),
	},
};
</script>
