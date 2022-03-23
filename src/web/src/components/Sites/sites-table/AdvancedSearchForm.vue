<template>
	<v-form>
		<v-card class="default">
			<v-card-title>
				<h3>Advanced Search</h3>
			</v-card-title>
			<v-card-text>
				<CommunitiesFilter @input="updateCommunitiesFilter" />
				<NtsMapSheetsFilter @input="updateNtsMapSheetsFilter" />
				<ConstructionPeriodsFilter @input="updateConstructionPeriodsFilter" />
				<SiteStatusesFilter @input="updateSiteStatusesFilter" />
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
import ConstructionPeriodsFilter from '@/components/Sites/sites-table/ConstructionPeriodsFilter';
import NtsMapSheetsFilter from '@/components/Sites/sites-table/NtsMapSheetsFilter';
import SiteStatusesFilter from '@/components/Sites/sites-table/SiteStatusesFilter';

export default {
	name: 'AdvancedSearchForm',
	components: {
		CommunitiesFilter,
		ConstructionPeriodsFilter,
		NtsMapSheetsFilter,
		SiteStatusesFilter,
	},
	data: () => ({
		communitiesFilter: {},
		constructionPeriodsFilter: {},
		ntsMapSheetsFilter: {},
		siteStatusesFilter: {},
	}),
	computed: {
		advancedSearchFilter() {
			return {
				...this.communitiesFilter,
				...this.ntsMapSheetsFilter,
				...this.constructionPeriodsFilter,
				...this.siteStatusesFilter,
			};
		},
	},
	methods: {
		updateCommunitiesFilter(value) {
			this.communitiesFilter = value;
		},
		updateNtsMapSheetsFilter(value) {
			this.ntsMapSheetsFilter = value;
		},
		updateConstructionPeriodsFilter(value) {
			this.constructionPeriodsFilter = value;
		},
		updateSiteStatusesFilter(value) {
			this.siteStatusesFilter = value
		}
	},
};
</script>
