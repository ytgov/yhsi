<template>
	<div class="">
		<!-- <v-btn color="secondary" class="float-right mb-0 mt-2 pl-2" to="/admin" exact style="height: auto; font-size: .8rem; padding: 6px 10px;"
      ><v-icon class="mr-2" small>mdi-arrow-left</v-icon> Back to Administration</v-btn
    > -->
		<v-breadcrumbs
			:items="[
				{ text: 'Adminstration', to: '/admin', exact: true },
				{ text: 'User Management' },
			]"
		></v-breadcrumbs>

		<h1>User Management</h1>

		<div class="mt-2">
			<v-card class="default px-3 py-3">
				<v-card-text>
					<v-row>
						<v-col cols="8" class="d-flex">
							<v-text-field
								prepend-inner-icon="mdi-magnify"
								background-color="white"
								outlined
								dense
								label="Search"
								v-model="search"
								hide-details
							></v-text-field>
						</v-col>
						<v-col cols="4" class="d-flex">
							<v-select
								small-chips
								multiple
								:items="filterOptions"
								v-model="selectedFilter"
								label="Status filter"
								dense
								outlined
								background-color="white"
								hide-details
							></v-select>
						</v-col>
						<v-spacer></v-spacer>
						<v-col cols="auto"> </v-col>
					</v-row>

					<v-data-table
						:items="filteredData"
						:headers="headers"
						:loading="loading"
						:search="search"
						@click:row="handleClick"
						:footer-props="{ 'items-per-page-options': [10, 30, 100] }"
						class="clickable-row"
					>
					</v-data-table
				></v-card-text>
			</v-card>
		</div>
		<notifications ref="notifier"></notifications>
	</div>
</template>

<script>
import { mapActions } from 'vuex';
import Notifications from '../../../Notifications.vue';
export default {
	components: { Notifications },
	name: 'usersgrid',
	data: () => ({
		loading: false,
		users: [],
		search: '',
		options: {},
		totalLength: 0,
		headers: [
			{ text: 'Email', value: 'email' },
			{ text: 'First Name', value: 'first_name' },
			{ text: 'Last Name', value: 'last_name' },
			{ text: 'Status', value: 'status' },
			{ text: 'Last Login', value: 'last_login_date_display' },
		],
		page: 1,
		pageCount: 0,
		iteamsPerPage: 10,
		selectedFilter: ['Active'],
		filterOptions: ['Active', 'Expired', 'Inactive', 'Pending'],
	}),
	async mounted() {
		this.loading = true;
		this.loadUsers()
			.then((resp) => {
				if (resp.error) {
					//console.log('Response Error:', resp.error.message);
					this.$router.push('/admin');
				} else {
					this.users = resp.data;
				}
			})
			.catch((err) => {
				console.log('ERROR', err);
				this.users = [];
			})
			.finally(() => {
				this.loading = false;
			});
	},
	methods: {
		...mapActions('users', ['loadUsers']),

		handleClick(value) {
			//Redirects the user to the edit user form
			this.$router.push(`/admin/users/${value.id}`);
		},
	},
	computed: {
		filteredData() {
			if (this.selectedFilter.length == 0) return this.users;

			let data = [];

			for (let usr of this.users) {
				if (this.selectedFilter.indexOf(usr.status) >= 0) {
					data.push(usr);
				}
			}

			return data;
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