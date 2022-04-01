<template>
	<div class="home">
	</div>
</template>

<script>
import store from '../store';

export default {
	name: 'Home',
	data: () => ({
	}),
	async created() {
		await store.dispatch('checkAuthentication');
		var isAuthenticated = store.getters.isAuthenticated;

		if (isAuthenticated) {
			this.$router.push('/dashboard');
		} else this.$router.push('/sign-in');
	},
};
</script>
