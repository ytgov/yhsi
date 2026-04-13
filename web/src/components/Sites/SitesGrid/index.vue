<template>
	<div class="books">
		<h1>YHSI Sites</h1>

		<v-row
			align="center"
			class="mb-2"
		>
			<v-col>
				<v-text-field
					v-model="search"
					label="Search"
					dense
					outlined
					hide-details
					append-icon="mdi-magnify"
					@click:append="doSearch"
					hint="Enter criteria and press enter"
					@keyup="keyUp"
				></v-text-field>
			</v-col>
			<v-col cols="auto">
				<v-btn
					color="success"
					:loading="exportLoading"
					@click="exportToCsv"
				>
					<v-icon left>mdi-file-delimited</v-icon>
					Export to CSV
				</v-btn>
			</v-col>
		</v-row>

		<v-data-table
			dense
			:items="items"
			:headers="headers"
			:options.sync="options"
			:loading="loading"
			:server-items-length="totalLength"
			@click:row="handleClick"
			:footer-props="{ 'items-per-page-options': items_per_page }"
		></v-data-table>
	</div>
</template>

<script>
import axios from 'axios';
import store from '../../../store';
import { PLACE_URL } from '../../../urls';
import _ from 'lodash';

export default {
	name: 'Grid',
	data: () => ({
		items_per_page: [20, 50, 100],
		loading: false,
		exportLoading: false,
		items: [],
		search: '',
		options: {},
		totalLength: 0,
		headers: [
			{ text: 'YHSI ID', value: 'yHSIId' },
			{ text: 'Primary name', value: 'primaryName' },
			{ text: 'Community', value: 'community.name' },
			{ text: 'Category', value: 'category.text' },
			{ text: 'Record Status', value: 'recordStatusText' },
			{ text: 'Status', value: 'status.text' },
		],
		page: 1,
		pageCount: 0,
		iteamsPerPage: 10,
	}),
	created() {
		this.search = store.getters.search;
	},
	watch: {
		options: {
			handler() {
				this.doSearch();
			},
			deep: true,
		},
		search: function (val) {
			store.dispatch('setSearch', val);
		},
		/*  search: {
      handler() {
        this.getDataFromApi();
      },
      deep: true,
    }, */
	},
	methods: {
		handleClick(value) {
			//Redirects the user to the site form
			//store.dispatch("addSiteHistory", value);
			this.$router.push(`/sites/${value.id}/summary`);
		},

		keyUp(event) {
			if (event.key == 'Enter') this.doSearch();
		},

		doSearch() {
			this.getDataFromApi();
		},

		getDataFromApi() {
			this.loading = true;

			let body = _.clone(this.options);
			body.query = [
				{ field: 'primaryName', operator: 'contains', value: this.search },
				{ field: 'yhsiid', operator: 'contains', value: this.search },
				{ field: 'includingRecordStatusIds', value: [1] },
			];

			axios
				.post(`${PLACE_URL}/search`, body)
				.then((resp) => {
					this.items = resp.data.data;
					this.totalLength = resp.data.meta.item_count;
					this.loading = false;
				})
				.catch((err) => console.error(err))
				.finally(() => {
					this.loading = false;
				});
		},

		async exportToCsv() {
			this.exportLoading = true;

			const body = {
				page: 1,
				itemsPerPage: 99999,
				query: [
					{ field: 'primaryName', operator: 'contains', value: this.search },
					{ field: 'yhsiid', operator: 'contains', value: this.search },
					{ field: 'includingRecordStatusIds', value: [1] },
				],
			};

			try {
				const resp = await axios.post(`${PLACE_URL}/search`, body);
				const rows = resp.data.data || [];

				const headers = [
					'YHSI ID',
					'Name',
					'NTS Map Sheet',
					'Community',
					'Category',
					'Record Status',
					'Site Status',
					'Latitude',
					'Longitude',
				];

				const csvRows = rows.map((r) => [
					r.yHSIId ?? '',
					r.primaryName ?? '',
					r.nTSMapSheet ?? '',
					r.community?.name ?? '',
					r.category?.text ?? '',
					r.recordStatusText ?? '',
					r.status?.text ?? '',
					r.latitude ?? '',
					r.longitude ?? '',
				]);

				const escape = (val) => {
					const str = String(val);
					return str.includes(',') || str.includes('"') || str.includes('\n')
						? `"${str.replace(/"/g, '""')}"`
						: str;
				};

				const csvContent =
					headers.map(escape).join(',') +
					'\n' +
					csvRows.map((row) => row.map(escape).join(',')).join('\n');

				const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
				const url = URL.createObjectURL(blob);
				const a = document.createElement('a');
				a.href = url;
				a.download = `yhsi-sites-${new Date().toISOString().slice(0, 10)}.csv`;
				document.body.appendChild(a);
				a.click();
				document.body.removeChild(a);
				URL.revokeObjectURL(url);
			} catch (err) {
				console.error('CSV export failed', err);
			} finally {
				this.exportLoading = false;
			}
		},
	},
};
</script>
