<template>
	<div class="home">
		<h1>Dashboard</h1>
		<v-row>
			<v-col
				cols="12"
				sm="6"
				md="4"
				lg="3"
				v-for="tile in tiles"
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

export default {
	name: 'Home',
	data: () => ({
		tiles: [
			{ title: 'Sites', icon: 'mdi-web', route: '/sites' },
			{ title: 'Places', icon: 'mdi-map-marker', route: '/places' },

			{ title: 'People', icon: 'mdi-account-multiple', route: '/people' },
			{ title: 'Boats', icon: 'mdi-ferry', route: '/boats' },
			{ title: 'Burials', icon: 'mdi-crosshairs-gps', route: '/burials' },
			{
				title: 'Interpretive Sites',
				icon: 'mdi-information',
				route: '/interpretive-sites',
			},
			{ title: 'Photos', icon: 'mdi-image', route: '/photos' },
			{
				title: 'Site Change Requests',
				icon: 'mdi-file-document-edit',
				route: '/sites-change-requests',
			},
		],
	}),
	computed: {
		...mapGetters(['user']),
	},
	methods: {
		navigateTo(route) {
			this.$router.push(route);
		},
	},
};
</script>
