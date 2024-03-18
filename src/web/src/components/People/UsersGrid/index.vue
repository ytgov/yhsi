<template>
	<v-container fluid>
		<div>
			<h1>People</h1>
			<Breadcrumbs />
			<v-row class="my-4">
				<v-col
					cols="12"
					md="6"
				>
					<v-text-field
						v-model="search"
						append-icon="mdi-magnify"
						label="Search"
						single-line
						hide-details
						@input="searchChange"
					></v-text-field>
				</v-col>
				<v-col
					cols="12"
					md="6"
					class="d-flex justify-space-between"
				>
					<v-btn
						text
						color="black"
						@click="addNewPerson"
					>
						<v-icon left>mdi-plus-circle-outline</v-icon>
						Add Person
					</v-btn>
					<JsonCSV :data="peopleData">
						<v-btn
							text
							color="black"
							:disabled="!peopleData.length"
							@click="downloadPdf"
							:loading="loadingPdf"
						>
							<v-icon left>mdi-download</v-icon>
							Export
						</v-btn>
					</JsonCSV>
					<v-btn
						text
						color="black"
						@click="downloadPdf"
						:loading="loadingPdf"
					>
						<v-icon left>mdi-printer</v-icon>
						Print
					</v-btn>
				</v-col>
			</v-row>
			<v-card>
				<v-card-title>
					<div>{{ filteredData.length }} results out of {{ totalLength }}</div>
				</v-card-title>
				<v-divider></v-divider>
				<v-card-text>
					<v-data-table
						:headers="headers"
						:items="filteredData"
						:loading="loading"
						:items-per-page="10"
						:footer-props="{ 'items-per-page-options': [10, 30, 50, 100] }"
						@click:row="handleClick"
					></v-data-table>
				</v-card-text>
			</v-card>
		</div>
	</v-container>
</template>

<script>
import people from '../../../controllers/people';
import Breadcrumbs from '../../Breadcrumbs';
import JsonCSV from 'vue-json-csv';
import _ from 'lodash';
export default {
	name: 'usersgrid',
	components: { Breadcrumbs, JsonCSV },
	data: () => ({
		loading: false,
		people: [],
		search: '',
		options: { page: 0, itemsPerPage: 10 },
		totalLength: 0,
		headers: [
			{ text: 'Given Name', value: 'GivenName' },
			{ text: 'Surname', value: 'Surname' },
			{ text: 'Birth Year', value: 'BirthYear' },
			{ text: 'Death Year', value: 'DeathYear' },
		],
		peopleData: [],
		loadingPdf: false,
	}),
	mounted() {
		this.getDataFromApi();
	},
	methods: {
		searchChange: _.debounce(function () {
			this.getDataFromApi();
		}, 400),
		handleClick(value) {
			this.$router.push({
				name: 'personView',
				params: {
					name: `${value.GivenName}-${value.Surname}`,
					id: value.PersonID,
				},
			});
		},
		async getDataFromApi() {
			this.loading = true;
			try {
				const { page, itemsPerPage } = this.options;
				const { data, total } = await people.get(
					page,
					itemsPerPage,
					this.search
				);
				this.people = data;
				this.totalLength = total;
				this.peopleData = this.peopleData = await people.getExport(
					textToMatch,
					sortBy[0] ? sortBy[0] : 'GivenName',
					sortDesc[0] ? 'desc' : 'asc'
				);
			} catch (error) {
				console.error(error);
			} finally {
				this.loading = false;
			}
		},
		async downloadPdf() {
			this.loadingPdf = true;
			// PDF generation logic
			this.loadingPdf = false;
		},
		addNewPerson() {
			this.$router.push({ name: 'personAddView' });
		},
	},
	computed: {
		filteredData() {
			// Filter logic
			return this.people.filter((person) => {
				// Example filter condition
				return person.GivenName.includes(this.search);
			});
		},
	},
	watch: {
		search() {
			this.getDataFromApi();
		},
		options: {
			handler() {
				this.getDataFromApi();
			},
			deep: true,
		},
	},
};
</script>

<style scoped>
.hoverclicklink:hover {
	color: #0097a9;
	text-decoration: underline;
	cursor: pointer;
}
</style>
