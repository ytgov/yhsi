<template>
	<div>
		<v-breadcrumbs :items="[
			{ text: 'Home', to: '/', exact: true },
			{ text: 'Photo Batches' },
		]"></v-breadcrumbs>

		<h1>Photo Batches</h1>

		<div class="mt-2">
			<v-card class="default">
				<v-card-text>
					<div class="d-flex mb-6">
						<v-text-field
							prepend-inner-icon="mdi-magnify"
							background-color="white"
							outlined
							dense
							hide-details
							label="Search"
							v-model="search"
							class="mr-5"
							v-on:input="searchChange()"
						></v-text-field>

						<v-menu transition="slide-y-transition" bottom :close-on-content-click="false">
							<template v-slot:activator="{ on, attrs }">
								<v-btn color="transparent" class="black--text my-0 mr-2" style="height: 40px"
									v-bind="attrs" v-on="on">
									<v-icon class="black--text mr-1">mdi-filter</v-icon>
									Filter
									<v-icon class="black--text">mdi-chevron-right</v-icon>
								</v-btn>
							</template>
							<v-list>
								<v-list-item v-for="(item, i) in filterOptions" :key="i" link>
									<v-text-field clearable v-model="item.value" :label="item.name"></v-text-field>
								</v-list-item>
							</v-list>
						</v-menu>

						<v-btn color="primary" class="my-0 mr-2" style="height: 40px" @click="openDialog">
							Add Batch
						</v-btn>
						<PhotoBatchCreateDialog ref="photoBatchCreateDialog" @created="handleCreatedPhotoBatch" />
					</div>

					<v-data-table
						:items="filteredData"
						:headers="headers"
						:loading="loading"
						:search="search"
						:options.sync="options"
						:server-items-length="totalLength"
						@click:row="handleClick"
						:footer-props="{ 'items-per-page-options': [50, 100] }"
						class="clickable-row"
					></v-data-table>
				</v-card-text>
			</v-card>
		</div>
	</div>
</template>

<script>
import _ from 'lodash';

import axios from "axios";
import { PHOTO_BATCH_URL } from "../../../urls";
import PhotoBatchCreateDialog from "./PhotoBatchCreateDialog";

import { mapGetters, mapActions } from 'vuex';

export default {
	name: "photobatchgrid",
	components: { PhotoBatchCreateDialog },
	data: () => ({
		route: "",
		loading: false,
		batches: [],
		search: "",
		headers: [
			{ text: "Batch Name", value: "name" },
			{ text: "User", value: "userName" },
			{ text: "Uploaded", value: "dateCreated" },
			{ text: "PhotoCount", value: "photoCount" },
		],
		//table options
		page: 0,
		pageCount: 6,
		totalLength: 0,
		options: {},
		filterOptions: [
			{ name: 'User', value: "" },
		],
	}),
	mounted() {
		this.loadProfile();
		this.getDataFromApi();
	},
	methods: {
		searchChange: _.debounce(function () {
			this.getDataFromApi();
		}, 400),
		async handleClick(value) {
			await this.$store.commit("photos/setBatchId", value.batchId);
			this.$router.push(`/photobatches/attributes`);
		},
		async handleCreatedPhotoBatch(batchId) {
			this.$store.commit("photos/setBatchId", batchId);
			await this.getDataFromApi();
			this.$refs.photoBatchCreateDialog.closeDialog();
		},
		async getDataFromApi() {
			this.loading = true;

			let body = _.clone(this.options);
			body.query = [
				{ field: "name", operator: "contains", value: this.search },
				{ field: "photobatch.userid", operator: "contains", value: this.search },
			];

			axios
				.post(`${PHOTO_BATCH_URL}/search`, body)
				.then((resp) => {
					this.batches = resp.data.data;
					this.batches = this.batches.map((x) => {
						x.dateCreated = this.formatDate(x.dateCreated);
						return x;
					});
					this.totalLength = resp.data.meta.item_count;
				})
				.catch((err) => console.error('Error in getDataFromApi: ' + err))
				.finally(() => {
					this.loading = false;
				});
		},
		openDialog() {
			this.$refs.photoBatchCreateDialog.openDialog();
		},
		formatDate(date) {
			if (!date) return null;
			return date.substr(0, 10);
		},
		saveDialog(batchName) {
			let body = { name: batchName, userId: this.currentUserId }
			axios
				.post(`${PHOTO_BATCH_URL}`, body)
				.then((resp) => {
					this.$store.commit("photos/setBatchId", resp.data.data[0].id);
					this.$router.push(`/photobatches/attributes`);
					this.$store.commit("alerts/setText", 'Batch added');
					this.$store.commit("alerts/setType", "success");
					this.$store.commit("alerts/setTimeout", 5000);
					this.$store.commit("alerts/setAlert", true);
				})
				.catch((err) => {
					this.$store.commit("alerts/setText", err);
					this.$store.commit("alerts/setType", "warning");
					this.$store.commit("alerts/setTimeout", 5000);
					this.$store.commit("alerts/setAlert", true);
				});
		},
		...mapActions({
			loadProfile: 'profile/loadProfile',
		}),
	},
	computed: {
		filteredData() {
			if (this.filterOptions) {
				let filters = JSON.parse(JSON.stringify(this.filterOptions));
				let data = JSON.parse(JSON.stringify(this.batches));

				data =
					filters[0].value == null || filters[0].value == ""
						? data
						: data.filter((x) =>
							x.userName
								? x.userName.toLowerCase().includes(
									filters[0].value.toLowerCase()
								)
								: false
						);
				return data;
			}
			else {
				return this.batches;
			}
		},
		...mapGetters({
			currentUserId: 'profile/id',
		}),
	},
	watch: {/* eslint-disable */
		options: {
			handler() {
				this.getDataFromApi()
			},
			deep: true,
		},
	}
};
</script>
