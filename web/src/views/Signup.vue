<template>
	<div class="home">
		<h1>{{ title }}</h1>
		<h3>
			If you have an account already, please
			<router-link to="/sign-in">sign in</router-link>.
		</h3>
		<p>
			Use the form below <em>only</em> if you never signed up for this
			application and don't have YNET credentials.
		</p>

		<v-row>
			<v-col
				cols="12"
				sm="6"
				v-if="!showSuccess"
			>
				<v-card class="default">
					<v-card-title>Create an account</v-card-title>
					<v-card-text>
						<v-form :disabled="loading">
							<v-text-field
								label="Email"
								dense
								outlined
								required
								type="email"
								v-model="user.email"
								background-color="white"
							></v-text-field>
							<v-text-field
								label="Password"
								dense
								outlined
								type="password"
								v-model="user.password"
								background-color="white"
							></v-text-field>
							<v-text-field
								label="First name"
								dense
								outlined
								v-model="user.first_name"
								background-color="white"
							></v-text-field>
							<v-text-field
								label="Last name"
								dense
								outlined
								v-model="user.last_name"
								background-color="white"
							></v-text-field>
							<v-btn
								color="primary"
								class="mr-4"
								:disabled="!isValid"
								@click="doCreate"
							>
								Sign up
							</v-btn>
							<span
								class="text-error"
								v-if="errorMessage"
								>* {{ errorMessage }}</span
							>
						</v-form>
					</v-card-text>
				</v-card>
			</v-col>
			<v-col v-if="showSuccess">
				<v-banner icon="mdi-account-check">
					Your account was successfully created, you must now
					<a :href="loginLink">sign in</a>.
				</v-banner>
			</v-col>
		</v-row>
	</div>
</template>

<script>
import { mapActions } from 'vuex';
import * as config from '../config';
import router from '../router';
import store from '../store';

export default {
	name: 'Login',
	data: () => ({
		loginLink: `${config.apiBaseUrl}/api/auth/login`,
		title: `Sign up : ${config.applicationName}`,
		user: { email: '', first_name: '', last_name: '', password: '' },
		loading: false,
		errorMessage: '',
		showSuccess: false,
	}),
	async mounted() {
		await store.dispatch('checkAuthentication');
		var isAuthenticated = store.getters.isAuthenticated;

		if (isAuthenticated) {
			router.push('/dashboard');
		}
	},
	computed: {
		isValid: function () {
			if (this.loading) return false;

			if (this.user.email.trim().length == 0) return false;
			if (this.user.first_name.trim().length == 0) return false;
			if (this.user.last_name.trim().length == 0) return false;
			if (this.user.password.trim().length == 0) return false;

			return true;
		},
	},
	methods: {
		...mapActions('users', ['createAccount']),
		doCreate() {
			this.loading = true;
			this.errorMessage = '';
			this.createAccount(this.user)
				.then((resp) => {
					if (resp.error) {
						console.log('Response Error:', resp.error.errors[0]);
						this.errorMessage = resp.error.errors[0].msg;
					} else {
						console.log(resp.data);
						//let message = resp.data.messages[0];

						this.showSuccess = true;
					}
				})
				.catch((err) => {
					console.log('SIGN UP ERRO', err);
				})
				.finally(() => {
					this.loading = false;
				});
		},
	},
};
</script>
