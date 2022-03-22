<template>
	<v-form>
		<v-card class="default">
			<v-card-title>
				<h3>Advanced Search</h3>
			</v-card-title>
			<v-card-text>
				<CommunitiesFilter @input="updateCommunitiesFilter" />
				<CommunitiesFilter @input="updateCommunitiesFilter" />
				<v-btn
					class="mb-0"
					color="primary"
					@click="$emit('search', advancedSearchFilter)"
				>
					Search
				</v-btn>
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
