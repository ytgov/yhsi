<template>
	<v-form>
		<v-card class="default">
			<v-card-title>
				<h3>Advanced Search</h3>
			</v-card-title>
			<v-card-text>
				<CommunitiesFilter
					:value="value"
					@input="updateCommunitiesFilter"
				/>
				<NtsMapSheetsFilter
					:value="value"
					@input="updateNtsMapSheetsFilter"
				/>
				<ConstructionPeriodsFilter
					:value="value"
					@input="updateConstructionPeriodsFilter"
				/>
				<SiteStatusesFilter
					:value="value"
					@input="updateSiteStatusesFilter"
				/>
				<FirstNationsFilter
					:value="value"
					@input="updateFirstNationsFilter"
				/>
				<FirstNationAssociationTypesFilter
					:value="value"
					@input="updateFirstNationAssociationTypesFilter"
				/>
				<RevisionTypesFilter
					:value="value"
					@input="updateRevisionTypesFilter"
				/>
				<RevisedByContainsFilter
					:value="value"
					@input="updateRevisedByContainsFilter"
				/>
				<RevisedDateContainsFilter
					:value="value"
					@input="updateRevisedDateContainsFilter"
				/>
				<AddressContainsFilter
					:value="value"
					@input="updateAddressContainsFilter"
				/>
				<ConstructionStyleContainsFilter
					:value="value"
					@input="updateConstructionStyleContainsFilter"
				/>
				<CulturalHistoryContainsFilter
					:value="value"
					@input="updateCulturalHistoryContainsFilter"
				/>
				<OwnershipTypesFilter
					:value="value"
					@input="updateOwnershipTypesFilter"
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
import AddressContainsFilter from '@/components/Sites/sites-table/AddressContainsFilter';
import CommunitiesFilter from '@/components/Sites/sites-table/CommunitiesFilter';
import ConstructionPeriodsFilter from '@/components/Sites/sites-table/ConstructionPeriodsFilter';
import ConstructionStyleContainsFilter from '@/components/Sites/sites-table/ConstructionStyleContainsFilter';
import CulturalHistoryContainsFilter from '@/components/Sites/sites-table/CulturalHistoryContainsFilter';
import FirstNationAssociationTypesFilter from '@/components/Sites/sites-table/FirstNationAssociationTypesFilter';
import FirstNationsFilter from '@/components/Sites/sites-table/FirstNationsFilter';
import NtsMapSheetsFilter from '@/components/Sites/sites-table/NtsMapSheetsFilter';
import OwnershipTypesFilter from '@/components/Sites/sites-table/OwnershipTypesFilter';
import RevisedByContainsFilter from '@/components/Sites/sites-table/RevisedByContainsFilter';
import RevisedDateContainsFilter from '@/components/Sites/sites-table/RevisedDateContainsFilter';
import RevisionTypesFilter from '@/components/Sites/sites-table/RevisionTypesFilter';
import SiteStatusesFilter from '@/components/Sites/sites-table/SiteStatusesFilter';

export default {
	name: 'AdvancedSearchForm',
	props: {
		// Previously applied filters, used to restore the form's state.
		value: {
			type: Object,
			default: () => ({}),
		},
	},
	components: {
		AddressContainsFilter,
		CommunitiesFilter,
		ConstructionPeriodsFilter,
		ConstructionStyleContainsFilter,
		CulturalHistoryContainsFilter,
		FirstNationAssociationTypesFilter,
		FirstNationsFilter,
		NtsMapSheetsFilter,
		OwnershipTypesFilter,
		RevisedByContainsFilter,
		RevisedDateContainsFilter,
		RevisionTypesFilter,
		SiteStatusesFilter,
	},
	data: () => ({
		addressContainsFilter: {},
		communitiesFilter: {},
		constructionPeriodsFilter: {},
		constructionStyleContainsFilter: {},
		cultureHistoryContainsFilter: {},
		firstNationAssociationTypesFilter: {},
		firstNationsFilter: {},
		ntsMapSheetsFilter: {},
		ownershipTypesFilter: {},
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
				...this.constructionStyleContainsFilter,
				...this.cultureHistoryContainsFilter,
				...this.firstNationAssociationTypesFilter,
				...this.firstNationsFilter,
				...this.ntsMapSheetsFilter,
				...this.ownershipTypesFilter,
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
		updateConstructionStyleContainsFilter(value) {
			this.constructionStyleContainsFilter = value;
		},
		updateCulturalHistoryContainsFilter(value) {
			this.cultureHistoryContainsFilter = value;
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
		updateOwnershipTypesFilter(value) {
			this.ownershipTypesFilter = value;
		},
		updateRevisedByContainsFilter(value) {
			this.revisedByContainsFilter = value;
		},
		updateRevisedDateContainsFilter(value) {
			this.revisedDateContainsFilter = value;
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
