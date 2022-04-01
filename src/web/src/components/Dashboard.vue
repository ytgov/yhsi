<template>
	<div class="home">
		<h1>Dashboard</h1>
		<v-banner icon="mdi-account-clock" v-if="user.status == 'Pending'">
			Your account is currently in a 'Pending' state awaiting approval from an
			administrator.<br />
			Once activated, you will have access to the application.
		</v-banner>

		<div v-if="user.status == 'Active'">
			<v-card class="mt-5" color="#fff2d5">
				<v-card-title>Card with info</v-card-title>
				<v-card-text>This is the body of the text</v-card-text>
			</v-card>

			<div class="row">
				<div class="col-md-6">
					<v-card class="mt-5" color="#fff2d5">
						<v-card-title>Another card</v-card-title>
						<v-card-text>This is the body of the text</v-card-text>
					</v-card>
				</div>
				<div class="col-md-6">
					<v-card class="mt-5" color="#fff2d5">
						<v-card-title>Yet another</v-card-title>
						<v-card-text>This is the body of the text</v-card-text>
					</v-card>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
	name: 'Home',
	data: () => ({}),
	computed: {
		...mapGetters(['user']),
	},
};
</script>
