<template>
	<div class="home">
		<h1>Dashboard</h1>
		<v-row>
			<v-col
				cols="12"
				sm="6"
				md="4"
				lg="3"
				v-for="tile in relevantTiles"
				:key="tile.title"
			>
				<v-card
					class="d-flex flex-column align-center justify-center"
					color="#fff2d5"
					elevation="2"
					@click="navigateTo(tile.route)"
				>
					<v-icon large>{{ tile.icon }}</v-icon>
					<span class="mt-2">{{ tile.title }}</span>
				</v-card>
			</v-col>
		</v-row>
	</div>
</template>

<script>
import { mapGetters } from 'vuex';
import { UserRoles } from '../authorization';

export default {
	name: 'Home',
	data: () => ({
		tiles: [
			{
				title: 'Sites',
				icon: 'mdi-web',
				route: '/sites',
				roles: [
					UserRoles.SITE_ADMIN,
					UserRoles.SITE_EDITOR,
					UserRoles.SITE_VIEWER,
					UserRoles.SITE_VIEWER_LIMITED,
				],
			},
			{
				title: 'Places',
				icon: 'mdi-map-marker',
				route: '/places',
				roles: [UserRoles.PLACE_EDITOR],
			},
			{
				title: 'Planes',
				icon: 'mdi-airplane',
				route: '/airplane',
				roles: [
					UserRoles.AIRPLANE_CRASH_EDITOR,
					UserRoles.AIRPLANE_CRASH_VIEWER,
				],
			},
			{
				title: 'People',
				icon: 'mdi-account-multiple',
				route: '/people',
				roles: [UserRoles.PEOPLE_EDITOR],
			},
			{
				title: 'Boats',
				icon: 'mdi-ferry',
				route: '/boats',
				roles: [UserRoles.BOATS_EDITOR, UserRoles.BOATS_VIEWER],
			},
			{
				title: 'Burials',
				icon: 'mdi-crosshairs-gps',
				route: '/burials',
				roles: [UserRoles.BURIALS_EDITOR, UserRoles.BURIALS_VIEWER],
			},
			{
				title: 'Interpretive Sites',
				icon: 'mdi-information',
				route: '/interpretive-sites',
				roles: [
					UserRoles.INTERPRETIVE_SITES_EDITOR,
					UserRoles.INTERPRETIVE_SITES_VIEWER,
				],
			},
			{
				title: 'Photos',
				icon: 'mdi-image',
				route: '/photos',
				roles: [
					UserRoles.PHOTO_ADMIN,
					UserRoles.PHOTO_EDITOR,
					UserRoles.PHOTO_VIEWER,
				],
			},
			{
				title: 'Site Change Requests',
				icon: 'mdi-file-document-edit',
				route: '/sites-change-requests',
				roles: [UserRoles.SITE_ADMIN],
			},
			{
				title: "Maps",
				icon: "mdi-map",
				route: "/maps",
			}
		],
	}),
	computed: {
		...mapGetters(['user', 'userInRole']),
		relevantTiles() {
			return this.tiles.filter((t) => this.canShow(t));
		},
	},
	methods: {
		navigateTo(route) {
			this.$router.push(route);
		},
		canShow(item) {
			if (item.roles) {
				return this.userInRole(item.roles);
			} else return true;
		},
	},
};
</script>
