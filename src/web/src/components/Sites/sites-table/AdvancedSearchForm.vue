<template>
	<v-form>
		<v-card class="default">
			<v-card-title>
				<h3>Advanced Search</h3>
			</v-card-title>
			<v-card-text>
				<CommunitiesFilter @input="updateCommunitiesFilter" />
				<NtsMapSheetsFilter @input="updateNtsMapSheetsFilter" />
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
import { isEmpty } from 'lodash';

import CommunitiesFilter from '@/components/Sites/sites-table/CommunitiesFilter';
import NtsMapSheetsFilter from '@/components/Sites/sites-table/NtsMapSheetsFilter';

export default {
	name: 'AdvancedSearchForm',
	components: { CommunitiesFilter, NtsMapSheetsFilter },
	data: () => ({
		communitiesFilter: {},
		ntsMapSheetsFilter: {},
	}),
	computed: {
		advancedSearchFilter() {
			return [this.communitiesFilter, this.ntsMapSheetsFilter].filter(
				(v) => !isEmpty(v)
			);
		},
	},
	methods: {
		updateCommunitiesFilter(value) {
			this.communitiesFilter = value;
		},
		updateNtsMapSheetsFilter(value) {
			this.ntsMapSheetsFilter = value;
		},
	},
};
</script>
