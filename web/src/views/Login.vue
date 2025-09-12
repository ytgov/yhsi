<template>
	<div class="home">
		<h1>{{ title }}</h1>
		<p>
			The authentication for this application is managed by an authentication
			partner. When you click the button below, you will be redirected to their
			site and once authenticated, back here. If you have already authenticated
			and your session is still active, it may skip the sign in process and
			return you here immediately.
		</p>
		<h3>
			If you have YNET credentials <em>or</em> you already have an account,
			click the button below.
		</h3>

		<a class="v-btn primary v-size--default mr-5" :href="loginLink">
			Click here to sign in
		</a>

		If you don't have YNET credentials <em>and</em> have never used this
		application before, you need to
		<router-link to="/sign-up">sign up</router-link>.
	</div>
</template>

<script>
import { applicationName, apiBaseUrl } from '../config';
import store from '../store';

export default {
	name: 'Login',
	data: () => ({
		loginLink: `${apiBaseUrl}/api/auth/login`,
		title: `Welcome to ${applicationName}`,
		applicationName: applicationName,
	}),
	async created() {
		await store.dispatch('checkAuthentication');
		var isAuthenticated = store.getters.isAuthenticated;

		if (isAuthenticated) {
			this.$router.push('/dashboard');
		}
	},
};
</script>
