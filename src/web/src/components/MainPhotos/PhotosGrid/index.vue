<template>
	<div>
		<!-- <v-row>
      <v-col cols="6" class="d-flex">
        <h1>Photos {{this.filterText}} {{this.photoCountText}}</h1>
        <v-menu transition="slide-y-transition" bottom>
        <template v-slot:activator="{ on, attrs }">
          <v-btn class="black--text ml-4" v-bind="attrs" v-on="on">
            <v-icon>mdi-swap-vertical</v-icon>
            Sort
          </v-btn>
        </template>
        <v-list>
          <v-list-item-group v-model="selectedSorter" color="primary">
            <v-list-item v-for="(item, i) in sortOptions" :key="i" link>
              <v-list-item-title>{{ item.name }}</v-list-item-title>
            </v-list-item>
          </v-list-item-group>
        </v-list>
      </v-menu>
      </v-col>
      <v-spacer></v-spacer>
      <v-col cols="auto" class="d-flex">
        <v-btn class="black--text mx-1" @click="handleClick('add')">
          <v-icon class="mr-1">mdi-plus</v-icon>
          Add Photo
        </v-btn>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <Breadcrumbs />
      </v-col>
      
    </v-row> -->

		<v-app-bar
			color="white"
			flat
			dark
		>
			<v-toolbar-title class="black--text mr-2">
				Photos {{ this.filterText }} {{ this.photoCountText }}</v-toolbar-title
			>
			<v-menu
				transition="slide-y-transition"
				bottom
			>
				<template v-slot:activator="{ on, attrs }">
					<v-btn
						class="black--text"
						light
						v-bind="attrs"
						v-on="on"
					>
						<v-icon>mdi-swap-vertical</v-icon>
						Sort
					</v-btn>
				</template>
				<v-list>
					<v-list-item-group
						v-model="selectedSorter"
						color="primary"
					>
						<v-list-item
							v-for="(item, i) in sortOptions"
							:key="i"
							link
						>
							<v-list-item-title>{{ item.name }}</v-list-item-title>
						</v-list-item>
					</v-list-item-group>
				</v-list>
			</v-menu>
			<v-spacer />
			<!--<Search :data="photos" />-->
			<v-btn
				class="black--text"
				light
				@click="handleClick('add')"
			>
				<v-icon>mdi-plus</v-icon>
				<div>Add Photo</div>
			</v-btn>
		</v-app-bar>

		<v-container>
			<v-card
				class="mt-5"
				color="#fff2d5"
			>
				<v-card-text style="font-size: 15px">
					<a @click="showHideFilters()"
						><span>{{ showFiltersText }} </span></a
					>
					<span>to refine results or choose from </span>
					<v-menu
						transition="slide-y-transition"
						offset-y
						class="ml-0"
					>
						<template v-slot:activator="{ on, attrs }">
							<a
								v-bind="attrs"
								v-on="on"
							>
								My Saved Filters <v-icon>mdi-menu-down</v-icon>
							</a>
						</template>
						<v-list>
							<v-list-item-group color="primary">
								<div class="ml-3">My Saved Filters</div>
								<v-list-item
									link
									v-for="(item, i) in savedFilters"
									:title="item.name"
									:key="i"
									@click="handleFilterClick('load', item.id)"
								>
									<v-list-item-title>{{ item.name }}</v-list-item-title>
								</v-list-item>
								<v-divider />
								<div class="mt-2 ml-3">Remove a Filter</div>
								<v-list-item
									link
									v-for="(item, i) in savedFilters"
									:title="item.name"
									:key="`delete-${i}`"
									@click="handleFilterClick('delete', item.id)"
								>
									<v-list-item-title>{{ item.name }} </v-list-item-title>
									<v-icon class="ml-1">mdi-close</v-icon>
								</v-list-item>
							</v-list-item-group>
						</v-list>
					</v-menu>
				</v-card-text>
				<div v-if="showFilterSection">
					<VueQueryBuilder
						:rules="queryRules"
						:maxDepth="1"
						:labels="queryLabels"
						v-model="queryBuilder"
					/>
					<v-row class="ml-4 mb-3">
						<v-btn
							color="primary"
							class="mr-2"
							@click="runQuery()"
						>
							<v-icon>mdi-magnify</v-icon>
							<div class="ml-2">View Results</div>
						</v-btn>
						<v-btn
							color="secondary"
							class="mr-2"
							@click="clearFilters()"
						>
							<v-icon>mdi-refresh</v-icon>
							<div class="ml-2">Clear Filters</div>
						</v-btn>
						<SaveDialog
							@saveDialog="saveDialog"
							:isDisabled="queryBuilderEmpty"
							:itemType="`filter`"
						/>
					</v-row>
				</div>
			</v-card>
		</v-container>

		<v-container grid-list-xs>
			<v-row>
				<v-col class="d-flex">
					<v-text-field
						v-model="search"
						@keyup.enter="getDataFromApi"
						label="Search"
					/>
					<v-btn
						@click="getDataFromApi"
						icon
						class="mt-auto mb-auto"
					>
						<v-icon>mdi-magnify</v-icon>
					</v-btn>
				</v-col>
			</v-row>
			<v-row v-if="!loading">
				<v-col
					v-for="(item, i) in sortedData"
					:key="`photo-${i}`"
					class="d-flex child-flex"
					cols="2"
				>
					<v-hover>
						<template v-slot:default="{ hover }">
							<v-card
								class="mx-auto"
								@click="sortData()"
							>
								<v-img
									:src="item.thumbFile.base64"
									:lazy-src="item.thumbFile.base64"
									class="white--text align-end"
									aspect-ratio="1"
								/>

								<v-card-actions>
									<v-card-subtitle
										v-if="selectedSorter == 0"
										v-text="item.featureName"
									/>
									<v-card-subtitle
										v-else-if="selectedSorter == 1"
										v-text="`Rating: ${item.rating}`"
									/>
									<v-card-subtitle v-else>
										v-text="`Photo taken, ${new
										Date(item.datePhotoTaken).toLocaleDateString()}`"
										></v-card-subtitle
									>
								</v-card-actions>

								<v-fade-transition>
									<v-overlay
										v-if="hover"
										absolute
										color="#036358"
									>
										<v-btn @click="handleClick('view', item.rowId)"
											>View Photo</v-btn
										>
									</v-overlay>
								</v-fade-transition>
							</v-card>
						</template>
					</v-hover>
				</v-col>
			</v-row>
			<v-row v-if="loading">
				<div class="loading">Loading...</div>
			</v-row>
			<v-row
				class="mb-2"
				v-if="!loading"
			>
				<v-col>
					<div class="text-center">
						<v-pagination
							v-model="page"
							:length="numberOfPages"
							:total-visible="5"
						/>
					</div>
				</v-col>
			</v-row>
		</v-container>
	</div>
</template>

<script>
// import Breadcrumbs from "../../Breadcrumbs.vue";
import axios from 'axios';
//import Search from "../PhotosComponents/Search";
import QueryMultiSelect from './QueryMultiSelect';
import SaveDialog from '../SaveDialog';
import { PHOTO_URL, STATIC_URL } from '../../../urls';
import VueQueryBuilder from 'vue-query-builder';
import Vue from 'vue';
import { mapGetters, mapActions } from 'vuex';

export default {
	name: 'Grid',
	components: { VueQueryBuilder, SaveDialog },
	data: () => ({
		search: '',
		selectedSorter: 0,
		sortOptions: [
			{ name: 'Feature name' },
			{ name: 'Rating' },
			{ name: 'Age' },
		],
		photos: [],
		sortedData: [],
		numberOfPages: 10,
		page: 1,
		totalLength: 0,
		page_size: 12,
		loading: true,
		queryRules: [],
		queryBuilder: { children: [] },
		queryLabels: {
			matchType: null,
			matchTypes: [{}],
			addRule: 'Add Filter',
			removeRule: '&times;',
			textInputPlaceholder: '',
		},
		queryBody: {},
		filterText: null,
		showFilterSection: false,
		savedFilters: [],
	}),
	watch: {
		selectedSorter: {
			handler() {
				this.sortData();
			},
			deep: true,
		},
		page() {
			this.getDataFromApi();
		},
	},
	mounted() {
		// Get search text when searching from view screen
		if (this.$store.getters['photos/searchText']) {
			this.search = this.$store.getters['photos/searchText'];
		}

		this.loadProfile();
		this.setQueryFilters();
		this.getDataFromApi();
	},
	methods: {
		handleClick(pageState, rowId) {
			//Redirects the user to the site form
			this.$store.commit('photos/setRowId', rowId);
			this.$router.push(`/photos/${pageState}`);
		},
		getDataFromApi() {
			this.loading = true;
			this.buildQueryBody();
			this.getSavedFilters();

			axios
				.post(`${PHOTO_URL}/search`, this.queryBody)
				.then((resp) => {
					this.photos = resp.data.data.map((x) => {
						console.log(x);
						//check if thumbFile is null
						if (!x.thumbFile) {
							x.thumbFile = {};
							x.thumbFile.base64 = null;
						} else {
							x.thumbFile.base64 = `data:image/png;base64,${this.toBase64(
								x.thumbFile.data
							)}`;
						}
						return x;
					});
					this.totalLength = resp.data.meta.item_count;
					this.numberOfPages = resp.data.meta.page_count;
					this.page_size = resp.data.meta.page_size;
					this.sortData();
				})
				.catch((err) => {
					console.error('Error in getDataFromApi: ' + err);
				})
				.finally(() => {
					this.loading = false;
				});
		},

		sortData() {
			//this function handles the logic for the data sorter
			switch (this.selectedSorter) {
				case 0:
					this.sortedData = this.sortByName;
					break;
				case 1:
					this.sortedData = this.sortByRating;
					break;
				case 2:
					this.sortedData = this.sortByAge;
					break;
			}
		},
		toBase64(arr) {
			return btoa(
				arr.reduce((data, byte) => data + String.fromCharCode(byte), '')
			);
		},

		runQuery() {
			this.getDataFromApi();
		},

		buildQueryBody() {
			this.queryBody = { query: [] };
			if (this.search) {
				this.queryBody.query.push({
					field: 'featureName',
					operator: 'contains',
					value: this.search,
				});
			}
			if (this.queryBuilder.children) {
				this.queryBuilder.children.forEach((x) => {
					let rule = {};
					rule.field = x.query.rule;
					if (rule.field == 'legacyBatchInfo') {
						rule.operator =
							x.query.operator == 'includes' ? 'contains' : 'notcontains';
						rule.value = x.query.value;
					} else {
						rule.operator = x.query.operator == 'includes' ? 'in' : 'notin';
						rule.value = x.query.value.join(',');
					}
					this.queryBody.query.push(rule);
				});
			}
			this.queryBody.page = this.page;
		},

		setQueryFilters() {
			this.queryRules.push({
				type: 'custom-component',
				id: 'communityId',
				label: 'Community',
				operators: ['includes', 'excludes'],
				component: (() => {
					return Vue.extend(QueryMultiSelect).extend({
						methods: {
							getData() {
								return axios.get(`${STATIC_URL}/community`).then((resp) => {
									let options = resp.data.data
										.slice()
										.sort((a, b) =>
											a.name.toLowerCase() > b.name.toLowerCase()
												? 1
												: b.name.toLowerCase() > a.name.toLowerCase()
												? -1
												: 0
										);
									return options.map((x) => {
										return { label: x.name, value: x.id };
									});
								});
							},
						},
					});
				})(),
			});

			this.queryRules.push({
				type: 'custom-component',
				id: 'subjects',
				label: 'Subject',
				operators: ['includes', 'excludes'],
				component: (() => {
					return Vue.extend(QueryMultiSelect).extend({
						methods: {
							getData() {
								return axios.get(`${STATIC_URL}/photo-subject`).then((resp) => {
									let options = resp.data.data
										.slice()
										.sort((a, b) =>
											a.name.toLowerCase() > b.name.toLowerCase()
												? 1
												: b.name.toLowerCase() > a.name.toLowerCase()
												? -1
												: 0
										);
									return options.map((x) => {
										return { label: x.name, value: x.name };
									});
								});
							},
						},
					});
				})(),
			});

			this.queryRules.push({
				type: 'custom-component',
				id: 'photoSize',
				label: 'Size',
				operators: ['includes', 'excludes'],
				component: (() => {
					return Vue.extend(QueryMultiSelect).extend({
						methods: {
							getData() {
								return [
									{ label: 'Small ( < 2 MP )', value: 'small' },
									{ label: 'Medium ( < 6 MP )', value: 'medium' },
									{ label: 'Large ( > 6 MP )', value: 'large' },
								];
							},
						},
					});
				})(),
			});

			this.queryRules.push({
				type: 'custom-component',
				id: 'photoProjectId',
				label: 'Project',
				operators: ['includes', 'excludes'],
				component: (() => {
					return Vue.extend(QueryMultiSelect).extend({
						methods: {
							getData() {
								return axios.get(`${STATIC_URL}/photo-project`).then((resp) => {
									let options = resp.data.data
										.slice()
										.sort((a, b) =>
											a.name.toLowerCase() > b.name.toLowerCase()
												? 1
												: b.name.toLowerCase() > a.name.toLowerCase()
												? -1
												: 0
										);
									return options.map((x) => {
										return { label: x.name, value: x.id };
									});
								});
							},
						},
					});
				})(),
			});

			this.queryRules.push({
				type: 'custom-component',
				id: 'rating',
				label: 'Rating',
				operators: ['includes', 'excludes'],
				component: (() => {
					return Vue.extend(QueryMultiSelect).extend({
						methods: {
							getData() {
								return axios.get(`${STATIC_URL}/photo-rating`).then((resp) => {
									return resp.data.data.map((x) => {
										return { label: x.text, value: x.value };
									});
								});
							},
						},
					});
				})(),
			});

			this.queryRules.push({
				type: 'custom-component',
				id: 'usageRights',
				label: 'Usage',
				operators: ['includes', 'excludes'],
				component: (() => {
					return Vue.extend(QueryMultiSelect).extend({
						methods: {
							getData() {
								return axios.get(`${STATIC_URL}/usage-right`).then((resp) => {
									return resp.data.data.map((x) => {
										return { label: x.text, value: x.value };
									});
								});
							},
						},
					});
				})(),
			});

			this.queryRules.push({
				type: 'custom-component',
				id: 'ownerId',
				label: 'Owner',
				operators: ['includes', 'excludes'],
				component: (() => {
					return Vue.extend(QueryMultiSelect).extend({
						methods: {
							getData() {
								return axios.get(`${STATIC_URL}/photo-owner`).then((resp) => {
									let options = resp.data.data
										.slice()
										.sort((a, b) =>
											a.name.toLowerCase() > b.name.toLowerCase()
												? 1
												: b.name.toLowerCase() > a.name.toLowerCase()
												? -1
												: 0
										);
									return options.map((x) => {
										return { label: x.name, value: x.id };
									});
								});
							},
						},
					});
				})(),
			});

			this.queryRules.push({
				type: 'custom-component',
				id: 'program',
				label: 'Program Type',
				operators: ['includes', 'excludes'],
				component: (() => {
					return Vue.extend(QueryMultiSelect).extend({
						methods: {
							getData() {
								return axios.get(`${STATIC_URL}/photo-program`).then((resp) => {
									let options = resp.data.data.map((x) => {
										return { label: x.text, value: x.value };
									});
									return options;
								});
							},
						},
					});
				})(),
			});

			this.queryRules.push({
				type: 'text',
				id: 'legacyBatchInfo',
				label: 'Legacy Batch',
				operators: ['includes', 'excludes'],
			});
		},

		loadSavedFilter(filters) {
			this.queryBuilder.children = [];
			filters = JSON.parse(filters);
			filters.forEach((x) => {
				this.queryBuilder.children.push(x);
			});
		},

		saveDialog(filterName) {
			let query = JSON.stringify(this.queryBuilder.children);
			let body = {
				userId: this.currentUserId,
				name: filterName,
				resultType: 'Photo',
				value: query,
			};
			axios
				.post(`${PHOTO_URL}/saved-filter`, body)
				.then(() => {
					this.filterText = ' - ' + filterName;
					this.getDataFromApi();
					this.$store.commit('alerts/setText', 'Filter saved');
					this.$store.commit('alerts/setType', 'success');
					this.$store.commit('alerts/setTimeout', 5000);
					this.$store.commit('alerts/setAlert', true);
				})
				.catch((err) => {
					this.$store.commit('alerts/setText', err);
					this.$store.commit('alerts/setType', 'warning');
					this.$store.commit('alerts/setTimeout', 5000);
					this.$store.commit('alerts/setAlert', true);
				});
		},

		deleteFilter(filterId) {
			axios
				.delete(`${PHOTO_URL}/saved-filter/${filterId}`)
				.then(() => {
					this.filterText = null;
					this.$router.go();
					this.$store.commit('alerts/setText', 'Filter removed');
					this.$store.commit('alerts/setType', 'success');
					this.$store.commit('alerts/setTimeout', 5000);
					this.$store.commit('alerts/setAlert', true);
				})
				.catch((err) => {
					this.$store.commit('alerts/setText', err);
					this.$store.commit('alerts/setType', 'warning');
					this.$store.commit('alerts/setTimeout', 5000);
					this.$store.commit('alerts/setAlert', true);
				});
		},

		showHideFilters() {
			this.showFilterSection = !this.showFilterSection;
		},

		getSavedFilters() {
			this.savedFilters = [];
			let userId = this.currentUserId;
			axios.get(`${PHOTO_URL}/saved-filter/user/${userId}`).then((resp) => {
				this.savedFilters = resp.data.data
					.slice()
					.sort((a, b) =>
						a.name.toLowerCase() > b.name.toLowerCase()
							? 1
							: b.name.toLowerCase() > a.name.toLowerCase()
							? -1
							: 0
					);
			});
		},

		handleFilterClick(action, filterId) {
			if (action == 'load') {
				let filter = this.savedFilters.find((x) => x.id == filterId);
				this.filterText = ' - ' + filter.name;
				this.loadSavedFilter(filter.value);
				this.getDataFromApi();
				this.showFilterSection = true;
			} else {
				this.deleteFilter(filterId);
			}
		},

		clearFilters() {
			this.queryBuilder.children = [];
			this.getDataFromApi();
		},

		...mapActions({
			loadProfile: 'profile/loadProfile',
		}),
	},
	computed: {
		sortByName: function () {
			return (
				this.photos
					.slice()
					//.filter((a) => a.featureName.toLowerCase().includes(this.search.toLowerCase()))
					.sort((a, b) =>
						!a.featureName || !b.featureName
							? 0
							: a.featureName.toLowerCase() > b.featureName.toLowerCase()
							? 1
							: b.featureName.toLowerCase() > a.featureName.toLowerCase()
							? -1
							: 0
					)
			);
		},
		sortByRating: function () {
			return (
				this.photos
					//.filter((a) => a.featureName.toLowerCase().includes(this.search.toLowerCase()))
					.slice()
					.sort((a, b) =>
						!a.rating || !b.rating
							? 0
							: a.rating > b.rating
							? 1
							: b.rating > a.rating
							? -1
							: 0
					)
			);
		},
		sortByAge: function () {
			//let photos =JSON.parse(JSON.stringify(this.photos));
			return (
				this.photos
					//.filter((a) => a.featureName.toLowerCase().includes(this.search.toLowerCase()))
					.slice()
					.sort((a, b) =>
						!a.dateCreated || !b.dateCreated
							? 0
							: a.dateCreated > b.dateCreated
							? 1
							: b.dateCreated > a.dateCreated
							? -1
							: 0
					)
			);
		},
		queryBuilderEmpty: function () {
			return (
				!this.queryBuilder.children || this.queryBuilder.children.length === 0
			);
		},
		photoCountText: function () {
			return this.totalLength ? '(' + this.totalLength + ')' : '(0)';
		},
		showFiltersText: function () {
			return this.showFilterSection ? 'Hide Filters' : 'Show Filters';
		},
		...mapGetters({
			currentUserId: 'profile/id',
		}),
	},
};
</script>

<style scoped>
.loading {
	font-size: 18px;
	color: #979797 !important;
	margin: auto;
	margin-top: 5%;
}
</style>

<style>
/* Custom CSS for the query builder */
.vqb-group-heading {
	display: none;
}
.vqb-custom-component-wrap {
	display: inline-block;
}
.vue-query-builder .vqb-group-body.card-body {
	padding-top: 0;
	padding-right: 1.25rem;
	padding-left: 1.25rem;
	padding-bottom: 1.25rem;
}
.vue-query-builder select.form-control {
	padding: 9px 8px;
	border: 1px solid grey;
	background-color: white;
	color: rgba(0, 0, 0, 0.87);
	border-radius: 4px;
	cursor: pointer;
	appearance: button;
}
.vue-query-builder select.form-control:hover {
	border: 1px solid black;
}
.vue-query-builder input.form-control {
	padding: 9px 8px;
	border: 1px solid grey;
	background-color: white;
	color: rgba(0, 0, 0, 0.87);
	border-radius: 4px;
	line-height: 19px;
}
.vue-query-builder button.btn {
	height: 36px;
	min-width: 64px;
	padding: 0 16px;
	background-color: #2196f3;
	border: 1px #2196f3 solid;
	border-radius: 4px;
	color: white;
	letter-spacing: 1.42857px;
	margin-right: 5px;
}
.vue-query-builder button.btn:hover {
	background-color: #42a5f3;
	border: 1px #42a5f3 solid;
}
.vqb-rule {
	margin-top: 15px;
	margin-bottom: 15px;
	background-color: #fff9ea;
	border-color: #ddd;
	padding: 9px 18px;
	border: 1px solid #ddd;
	border-radius: 4px;
}
.vue-query-builder .close {
	color: #969696;
	font-size: 1.5rem;
	font-weight: 700;
	padding: 0 13px;
}
.vue-query-builder .close:hover {
	color: #6a6a6a;
}
</style>
