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
				<FirstNationsFilter @input="updateFirstNationsFilter" />
				<FirstNationAssociationTypesFilter
					@input="updateFirstNationAssociationTypesFilter"
				/>
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
import FirstNationAssociationTypesFilter from '@/components/Sites/sites-table/FirstNationAssociationTypesFilter';
import FirstNationsFilter from '@/components/Sites/sites-table/FirstNationsFilter';
import NtsMapSheetsFilter from '@/components/Sites/sites-table/NtsMapSheetsFilter';
import SiteStatusesFilter from '@/components/Sites/sites-table/SiteStatusesFilter';

export default {
	name: 'AdvancedSearchForm',
	components: {
		CommunitiesFilter,
		ConstructionPeriodsFilter,
		FirstNationAssociationTypesFilter,
		FirstNationsFilter,
		NtsMapSheetsFilter,
		SiteStatusesFilter,
	},
	data: () => ({
		communitiesFilter: {},
		constructionPeriodsFilter: {},
		firstNationAssociationTypesFilter: {},
		firstNationsFilter: {},
		ntsMapSheetsFilter: {},
		siteStatusesFilter: {},
	}),
	computed: {
		advancedSearchFilter() {
			return {
				...this.communitiesFilter,
				...this.constructionPeriodsFilter,
				...this.firstNationAssociationTypesFilter,
				...this.firstNationsFilter,
				...this.ntsMapSheetsFilter,
				...this.siteStatusesFilter,
			};
		},
	},
	methods: {
		updateCommunitiesFilter(value) {
			this.communitiesFilter = value;
		},
		updateConstructionPeriodsFilter(value) {
			this.constructionPeriodsFilter = value;
		},
		updateFirstNationAssociationTypesFilter(value) {
			this.firstNationAssociationTypesFilter = value;
		},
		updateFirstNationsFilter(value) {
			this.firstNationsFilter = value;
		},
		updateNtsMapSheetsFilter(value) {
			this.ntsMapSheetsFilter = value;
		},
		updateSiteStatusesFilter(value) {
			this.siteStatusesFilter = value;
		},
	},
};
</script>
