<template>
	<v-form>
		<v-card class="default">
			<v-card-title>
				<h3>Advanced Search</h3>
			</v-card-title>
			<v-card-text>
				<CommunitiesFilter @input="updateCommunitiesFilter" />
				<CommunitiesFilter @input="updateCommunitiesFilter" />
				<div class="d-flex justify-end">
				<v-btn
					class="my-0"
					color="primary"
					@click="$emit('search', advancedSearchFilter)"
				>
					Search
				</v-btn>
			</div>
			</v-card-text>
		</v-card>
	</v-form>
</template>

<script>
import CommunitiesFilter from '@/components/Sites/sites-table/CommunitiesFilter';

export default {
	name: 'AdvancedSearchForm',
	components: { CommunitiesFilter },
	data: () => ({
		communitiesFilter: {},
	}),
	computed: {
		advancedSearchFilter() {
			return [this.communitiesFilter];
		},
	},
	methods: {
		updateCommunitiesFilter(value) {
			this.communitiesFilter = value;
		},
	},
};
</script>
