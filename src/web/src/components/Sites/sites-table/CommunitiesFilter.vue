<template>
	<v-autocomplete
		v-model="communityIds"
		:items="communities"
		:loading="loading"
		label="Communities"
		item-text="name"
		item-value="id"
		clearable
		dense
		outlined
		small-chips
		multiple
		background-color="white"
	/>
</template>

<script>
import api from '@/apis/communities-api';

export default {
	name: 'CommunitiesFilter',
	data: () => ({
		communities: [],
		communityIds: [],
		loading: false,
	}),
	mounted() {
		this.loading = true;
		api
			.getAll()
			.then(({ data }) => {
				this.communities = data;
			})
			.finally(() => {
				this.loading = false;
			});
	},
};
</script>
