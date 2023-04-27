<template>
	<div>
		<v-row>
			<div class="col-md-12 d-flex">
				<v-text-field
					v-if="mode != 'new'"
					flat
					prepend-icon="mdi-magnify"
					class="mt-4"
					hide-details
					label="Search"
					v-model="search"
					dense
					outlined
					background-color="white"
				></v-text-field>

				<v-spacer></v-spacer>

				<v-btn
					v-if="mode != 'view'"
					color="primary"
					:disabled="disableAddRecord"
					@click="addRecord"
					>Add Historic Record</v-btn
				>
			</div>
		</v-row>
		<v-row>
			<v-col cols="12">
				<v-card>
					<v-data-table
						:headers="headers"
						:items="data"
						:search="search"
						:footer-props="{ 'items-per-page-options': [10, 30, 100] }"
					>
						<template
							v-slot:body.prepend="{}"
							v-if="addingItem"
						>
							<tr>
								<td>
									<v-textarea v-model="historicRecordHelper"></v-textarea>
								</td>
								<td>
									<v-textarea v-model="referenceHelper"></v-textarea>
								</td>
								<td>
									<v-checkbox
										dense
										outlined
										v-model="restrictedHelper"
										label=""
										:true-value="1"
										:false-value="0"
									></v-checkbox>
								</td>
								<td>
									<v-tooltip bottom>
										<template v-slot:activator="{ on, attrs }">
											<v-btn
												v-bind="attrs"
												v-on="on"
												:disabled="!historicRecordHelper"
												icon
												class="black--text"
												color="success"
												@click="saveNewRecord()"
											>
												<v-icon small>mdi-check</v-icon>
											</v-btn>
										</template>
										<span>Save changes</span>
									</v-tooltip>
									<v-tooltip bottom>
										<template v-slot:activator="{ on, attrs }">
											<v-btn
												v-bind="attrs"
												v-on="on"
												icon
												class="black--text"
												@click="cancelItem()"
											>
												<v-icon small>mdi-close</v-icon>
											</v-btn>
										</template>
										<span>Cancel</span>
									</v-tooltip>
								</td>
							</tr>
						</template>
						<template v-slot:item.historyText="{ item, index }">
							<div v-if="editTable == index">
								<v-textarea v-model="historicRecordHelper"></v-textarea>
							</div>
							<div v-else>{{ item.historyText }}</div>
						</template>
						<template v-slot:item.reference="{ item, index }">
							<div v-if="editTable == index">
								<v-textarea v-model="referenceHelper"></v-textarea>
							</div>
							<div v-else>{{ item.reference }}</div>
						</template>
						<template v-slot:item.restricted="{ index, item }">
							<v-checkbox
								v-if="editTable == index"
								dense
								outlined
								v-model="restrictedHelper"
								:disabled="mode != 'edit' || editTable != index"
								label=""
								:true-value="1"
								:false-value="0"
							></v-checkbox>
							<v-checkbox
								v-else
								dense
								outlined
								v-model="item.restricted"
								:disabled="mode != 'edit' || editTable != index"
								label=""
								:true-value="1"
								:false-value="0"
							></v-checkbox>
						</template>
						<template
							v-if="mode == 'edit'"
							v-slot:item.actions="{ index, item }"
						>
							<v-tooltip
								bottom
								v-if="editTable != index && !addingItem"
							>
								<template v-slot:activator="{ on, attrs }">
									<v-btn
										v-bind="attrs"
										v-on="on"
										icon
										class="black--text"
										@click="changeEditTable(index, item)"
									>
										<v-icon small> mdi-pencil</v-icon>
									</v-btn>
								</template>
								<span>Edit</span>
							</v-tooltip>
							<v-tooltip
								bottom
								v-if="editTable == index"
							>
								<template v-slot:activator="{ on, attrs }">
									<v-btn
										v-if="placeId"
										v-bind="attrs"
										v-on="on"
										:disabled="
											referenceHelper === '' || historicRecordHelper === ''
										"
										icon
										class="black--text"
										color="success"
										@click="saveRecord(index)"
									>
										<v-icon small>mdi-check</v-icon>
									</v-btn>
								</template>
								<span>Save changes</span>
							</v-tooltip>
							<v-tooltip
								bottom
								v-if="editTable == index"
							>
								<template v-slot:activator="{ on, attrs }">
									<v-btn
										v-bind="attrs"
										v-on="on"
										icon
										class="black--text"
										@click="closeEditTable(index)"
									>
										<v-icon small>mdi-close</v-icon>
									</v-btn>
								</template>
								<span>Cancel</span>
							</v-tooltip>
						</template>
					</v-data-table>
				</v-card>
			</v-col>
		</v-row>
	</div>
</template>

<script>
import { YTPLACEHISTORY_URL } from '../../../urls';
import axios from 'axios';
export default {
	name: 'historicRecord',
	props: ['historicRecords', 'mode', 'placeId'],
	data: () => ({
		search: '',
		headers: [
			{ text: 'Historic Record', value: 'historyText' },
			{ text: 'Reference', value: 'reference' },
			{ text: 'Restricted', value: 'restricted' },
			{ text: '', value: 'actions', sortable: false },
		],
		editTable: -1,
		data: [],
		//helper vars for when v-model is not an option (inside the datatable)
		historicRecordHelper: '',
		referenceHelper: '',
		restrictedHelper: '',
		addingItem: false,
	}),
	created() {
		this.data = this.historicRecords;
	},
	methods: {
		//functions for editing the table values
		changeEditTable(index, item) {
			this.editTable = index;
			this.historicRecordHelper = item.historyText;
			this.referenceHelper = item.reference;
			this.restrictedHelper = item.restricted;
		},
		closeEditTable() {
			this.editTable = -1;
			//this.data.shift();
		},
		async saveRecord(index) {
			let body = {
				historyText: this.historicRecordHelper,
				reference: this.referenceHelper,
				restricted: this.restrictedHelper,
				placeId: this.placeId,
			};

			axios
				.put(`${YTPLACEHISTORY_URL}/${this.data[index].id}`, body)
				.then(() => {
					this.$store.commit('alerts/setText', 'Record saved');
					this.$store.commit('alerts/setType', 'success');
					this.$store.commit('alerts/setTimeout', 5000);
					this.$store.commit('alerts/setAlert', true);
					this.data[index].reference = this.referenceHelper;
					this.data[index].historyText = this.historicRecordHelper;
					this.data[index].restricted = this.restrictedHelper;
					this.editTable = -1;
				})
				.catch((err) => {
					this.$store.commit('alerts/setText', err);
					this.$store.commit('alerts/setType', 'warning');
					this.$store.commit('alerts/setTimeout', 5000);
					this.$store.commit('alerts/setAlert', true);
				});
		},
		addRecord() {
			//this.$emit('addRecord')
			this.historicRecordHelper = null;
			this.referenceHelper = null;
			this.restrictedHelper = null;
			this.addingItem = true;
		},
		//for adding a new item
		async saveNewRecord() {
			let body = {
				historyText: this.historicRecordHelper,
				reference: this.referenceHelper,
				restricted: this.restrictedHelper,
				placeId: this.placeId,
			};
			axios
				.post(`${YTPLACEHISTORY_URL}/`, body)
				.then((resp) => {
					this.$store.commit('alerts/setText', 'Record added');
					this.$store.commit('alerts/setType', 'success');
					this.$store.commit('alerts/setTimeout', 5000);
					this.$store.commit('alerts/setAlert', true);
					// Add the placeHistory record that was just created to data
					if (resp.data[0].HistoryText);
					let respData = {};
					respData.historyText = resp.data[0].HistoryText;
					respData.reference = resp.data[0].Reference;
					respData.restricted = resp.data[0].Restricted;
					respData.placeId = resp.data[0].PlaceId;
					respData.id = resp.data[0].Id;
					this.data.push(respData);
					this.historicRecordHelper = null;
					this.referenceHelper = null;
					this.restrictedHelper = null;
					this.addingItem = false;
					this.editTable = -1;
				})
				.catch((err) => {
					this.$store.commit('alerts/setText', err);
					this.$store.commit('alerts/setType', 'warning');
					this.$store.commit('alerts/setTimeout', 5000);
					this.$store.commit('alerts/setAlert', true);
				});
		},
		cancelItem() {
			this.addingItem = false;
		},
	},
	computed: {
		disableAddRecord() {
			if (this.addingItem) {
				return true;
			}
			if (this.editTable >= 0) {
				return true;
			}
			return false;
		},
	},
	watch: {
		data: {
			/* eslint-disable */
			handler() {
				this.$emit('historic-record-change');
			} /* eslint-enable */,
			deep: true,
		},
	},
};
</script>
