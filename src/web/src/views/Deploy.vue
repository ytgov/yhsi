<template>
	<div>DEPLOY</div>
</template>

<script>
import { apiBaseUrl } from '../config';
import axios from 'axios';

export default {
	name: 'Login',
	data: () => ({
		loginLink: `${apiBaseUrl}/api/deploy`,
	}),
	async created() {
		axios.get(this.loginLink);
	},
};
</script>
