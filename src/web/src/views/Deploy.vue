<template></template>

<script>
import { apiBaseUrl } from '../config';
import axios from 'axios';

export default {
	name: 'Login',
	data: () => ({
		loginLink: `${apiBaseUrl}/api/deploy`,
	}),
	async created() {
		axios.get(loginLink);
	},
};
</script>
