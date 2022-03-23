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
				<RevisionTypesFilter @input="updateRevisionTypesFilter" />
				<RevisedByContainsFilter @input="updateRevisedByContainsFilter" />
				<RevisedDateContainsFilter @input="updateRevisedDateContainsFilter" />
				<AddressContainsFilter @input="updateAddressContainsFilter" />
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
import AddressContainsFilter from '@/components/Sites/sites-table/AddressContainsFilter';
import CommunitiesFilter from '@/components/Sites/sites-table/CommunitiesFilter';
import ConstructionPeriodsFilter from '@/components/Sites/sites-table/ConstructionPeriodsFilter';
import FirstNationAssociationTypesFilter from '@/components/Sites/sites-table/FirstNationAssociationTypesFilter';
import FirstNationsFilter from '@/components/Sites/sites-table/FirstNationsFilter';
import NtsMapSheetsFilter from '@/components/Sites/sites-table/NtsMapSheetsFilter';
import RevisedByContainsFilter from '@/components/Sites/sites-table/RevisedByContainsFilter';
import RevisedDateContainsFilter from '@/components/Sites/sites-table/RevisedDateContainsFilter';
import RevisionTypesFilter from '@/components/Sites/sites-table/RevisionTypesFilter';
import SiteStatusesFilter from '@/components/Sites/sites-table/SiteStatusesFilter';

export default {
	name: 'AdvancedSearchForm',
	components: {
		AddressContainsFilter,
		CommunitiesFilter,
		ConstructionPeriodsFilter,
		FirstNationAssociationTypesFilter,
		FirstNationsFilter,
		NtsMapSheetsFilter,
		RevisedByContainsFilter,
		RevisedDateContainsFilter,
		RevisionTypesFilter,
		SiteStatusesFilter,
	},
	data: () => ({
		addressContainsFilter: {},
		communitiesFilter: {},
		constructionPeriodsFilter: {},
		firstNationAssociationTypesFilter: {},
		firstNationsFilter: {},
		ntsMapSheetsFilter: {},
		revisedByContainsFilter: {},
		revisedDateContainsFilter: {},
		revisionTypesFilter: {},
		siteStatusesFilter: {},
	}),
	computed: {
		advancedSearchFilter() {
			return {
				...this.addressContainsFilter,
				...this.communitiesFilter,
				...this.constructionPeriodsFilter,
				...this.firstNationAssociationTypesFilter,
				...this.firstNationsFilter,
				...this.ntsMapSheetsFilter,
				...this.revisedByContainsFilter,
				...this.revisedDateContainsFilter,
				...this.revisionTypesFilter,
				...this.siteStatusesFilter,
			};
		},
	},
	methods: {
		updateAddressContainsFilter(value) {
			this.addressContainsFilter = value;
		},
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
		updateRevisedByContainsFilter(value) {
			this.revisedByContainsFilter = value;
		},
		updateRevisedDateContainsFilter(value) {
			this.revisedDateContainsFilter = value
		},
		updateRevisionTypesFilter(value) {
			this.revisionTypesFilter = value;
		},
		updateSiteStatusesFilter(value) {
			this.siteStatusesFilter = value;
		},
	},
};
</script>
