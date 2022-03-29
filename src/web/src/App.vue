<template>
	<v-app>
		<v-app-bar
			app
			color="#fff"
			flat
			height="70"
			style="left: 0; border-bottom: 3px #f3b228 solid"
		>
			<!-- <v-icon color="#f3b228" class="mr-5">{{ applicationIcon }}</v-icon> -->
			<img src="/yukon.svg" style="margin: -8px 85px 0 0" height="44" />
			<v-toolbar-title tag="h1" class="mb-0">
				<span style="font-weight: 700">{{ applicationName }}</span>

				<v-progress-circular
					:class="loadingClass"
					indeterminate
					color="#f3b228"
					size="20"
					width="2"
					class="ml-4"
				></v-progress-circular>
			</v-toolbar-title>
			<v-spacer></v-spacer>

			<div v-if="isAuthenticated">
				<v-menu offset-y class="ml-0">
					<template v-slot:activator="{ on, attrs }">
						<v-btn text color="primary" v-bind="attrs" v-on="on">
							Navigation <v-icon>mdi-menu-down</v-icon>
						</v-btn>
					</template>

					<v-list dense style="min-width: 200px">
						<v-list-item to="/dashboard">
							<v-list-item-title>Dashboard</v-list-item-title>
						</v-list-item>
						<v-list-item
							to="/sites"
							v-if="
								userInRole([
									'Site Admin',
									'Site Editor',
									'Site Viewer',
									'Site Viewer Limited',
								])
							"
						>
							<v-list-item-title>Sites</v-list-item-title>
						</v-list-item>
						<v-list-item
							v-if="userInRole(['Site Admin'])"
							to="/sites-change-requests"
						>
							<v-list-item-title>
								Site Change Requests
							</v-list-item-title>
						</v-list-item>
						<v-list-item
							to="/photos"
							v-if="
								userInRole(['Photo Admin', 'Photo Editor', 'Photo Viewer'])
							"
						>
							<v-list-item-title>Photos</v-list-item-title>
						</v-list-item>
						<v-list-item
							to="/photobatches"
							v-if="userInRole(['Photo Editor', 'Photo Admin'])"
						>
							<v-list-item-title>Photo Batches</v-list-item-title>
						</v-list-item>
						<v-list-item to="/maps">
							<v-list-item-title>Maps</v-list-item-title>
						</v-list-item>
						<v-list-item
							to="/airplane"
							v-if="userInRole(['Airplane Crash Editor'])"
						>
							<v-list-item-title>Airplane Crash Sites</v-list-item-title>
						</v-list-item>
						<v-list-item to="/boats" v-if="userInRole(['Boats Editor'])">
							<v-list-item-title>Boats & Owners</v-list-item-title>
						</v-list-item>
						<v-list-item to="/burials" v-if="userInRole(['Burials Editor'])">
							<v-list-item-title>Burials</v-list-item-title>
						</v-list-item>
						<v-list-item
							to="/places"
							v-if="userInRole(UserRoles.PLACE_EDITOR)"
						>
							<v-list-item-title>Places</v-list-item-title>
						</v-list-item>
						<v-list-item
							to="/people"
							v-if="userInRole([UserRoles.ADMINISTRATOR])"
						>
							<v-list-item-title>People</v-list-item-title>
						</v-list-item>
					</v-list>
				</v-menu>

				<v-btn
					icon
					color="primary"
					class="mr-2"
					title="Recently visited"
					@click="showHistory()"
				>
					<v-icon>mdi-history</v-icon>
				</v-btn>

				<span>{{ username }}</span>
				<v-menu bottom left class="ml-0">
					<template v-slot:activator="{ on, attrs }">
						<v-btn icon color="primary" v-bind="attrs" v-on="on">
							<v-icon>mdi-dots-vertical</v-icon>
						</v-btn>
					</template>

					<v-list dense style="min-width: 200px">
						<v-list-item to="/profile">
							<v-list-item-icon>
								<v-icon>mdi-account</v-icon>
							</v-list-item-icon>
							<v-list-item-title>My profile</v-list-item-title>
						</v-list-item>
						<v-list-item
							to="/admin"
							v-if="userInRole([UserRoles.ADMINISTRATOR])"
						>
							<v-list-item-icon>
								<v-icon>mdi-cogs</v-icon>
							</v-list-item-icon>
							<v-list-item-title>Administration</v-list-item-title>
						</v-list-item>

						<v-divider />
						<v-list-item @click="signOut">
							<v-list-item-icon>
								<v-icon>mdi-exit-run</v-icon>
							</v-list-item-icon>
							<v-list-item-title>Sign out</v-list-item-title>
						</v-list-item>
					</v-list>
				</v-menu>
			</div>
			<div v-else>
				<router-link to="/sign-in">Sign in</router-link>
			</div>
		</v-app-bar>

		<v-main>
			<v-container fluid :class="`${isSites($route.path, true)}`">
				<v-row>
					<v-col :class="`${isSites($route.path, false)}`">
						<!-- 
              <router-view
                v-on:showError="showError"
                v-on:showSuccess="showSuccess"
                v-on:showAPIMessages="showAPIMessages"
              ></router-view>
              <notifier ref="notifier"></notifier>
            -->
						<router-view></router-view>
						<RequestAlert />
					</v-col>
				</v-row>
			</v-container>
		</v-main>

		<history-sidebar ref="historySidebar"></history-sidebar>
	</v-app>
</template>

<script>
import { mapGetters } from 'vuex';
import { UserRoles } from './authorization';

import store from './store';
import * as config from './config';
import { LOGOUT_URL } from './urls';

import RequestAlert from './components/RequestAlert.vue';

export default {
	name: 'App',
	components: { RequestAlert },
	data: () => ({
		dialog: false,
		drawer: null,
		drawerRight: null,
		headerShow: false,
		menuShow: false,
		loadingClass: 'd-none',
		applicationName: config.applicationName,
		applicationIcon: config.applicationIcon,
		UserRoles: UserRoles,
	}),
	computed: {
		...mapGetters(['isAuthenticated', 'userInRole']),
		...mapGetters({ username: 'fullName' }),
	},
	async mounted() {
		await store.dispatch('checkAuthentication');
	},
	methods: {
		signOut: function () {
			window.location = LOGOUT_URL;
		},
		isSites(route, chooser) {
			if (chooser)
				return route.includes('sites/') || route.includes('photos')
					? 'siteslp'
					: '';
			else
				return route.includes('sites/') || route.includes('photos')
					? 'sitesnp'
					: '';
		},
		async showHistory() {
			this.$refs.historySidebar.show();

			let t = this.userInRole(this.UserRoles.PLACE_EDITOR);

			console.log(t);
		},
		showError: function (msg) {
			this.$refs.notifier.showError(msg);
		},
		showSuccess: function (msg) {
			this.$refs.notifier.showSuccess(msg);
		},
		showAPIMessages: function (msg) {
			this.$refs.notifier.showAPIMessages(msg);
		},
	},
};
</script>
