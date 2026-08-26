import { isEmpty, isNil, omitBy } from 'lodash';

const STORAGE_KEY = 'yhsi.sites-search-context';

// Converts the sites table state into a plain route query object.
// Advanced search filters are JSON encoded so that value types
// (numbers, arrays, booleans) survive the round trip through the URL.
export function serializeSitesSearchQuery({
	searchTerm,
	options = {},
	filters = {},
	showAdvanced = false,
} = {}) {
	const { page, itemsPerPage, sortBy, sortDesc } = options;

	return omitBy(
		{
			search: searchTerm || undefined,
			page: page > 1 ? String(page) : undefined,
			itemsPerPage: itemsPerPage ? String(itemsPerPage) : undefined,
			sortBy: isEmpty(sortBy) ? undefined : sortBy[0],
			sortDesc: isEmpty(sortBy) ? undefined : String(Boolean(sortDesc && sortDesc[0])),
			filters: isEmpty(filters) ? undefined : JSON.stringify(filters),
			advanced: showAdvanced ? 'true' : undefined,
		},
		isNil
	);
}

export function parseSitesSearchQuery(query = {}) {
	let filters = {};
	if (query.filters) {
		try {
			filters = JSON.parse(query.filters);
		} catch (error) {
			console.error('Could not parse sites search filters.', error);
		}
	}

	const options = {};
	if (query.page) options.page = parseInt(query.page, 10) || 1;
	if (query.itemsPerPage) options.itemsPerPage = parseInt(query.itemsPerPage, 10) || 20;
	if (query.sortBy) {
		options.sortBy = [query.sortBy];
		options.sortDesc = [query.sortDesc === 'true'];
	}

	return {
		searchTerm: query.search || '',
		filters,
		options,
		showAdvanced: query.advanced === 'true' || !isEmpty(filters),
	};
}

// Remembered so that leaving the table (e.g. to view a site) and coming
// back via "Back to Sites" returns to the same search, filters and page.
export function rememberSitesSearchQuery(query) {
	try {
		window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(query || {}));
	} catch (error) {
		console.error('Could not store sites search context.', error);
	}
}

export function recallSitesSearchQuery() {
	try {
		return JSON.parse(window.sessionStorage.getItem(STORAGE_KEY)) || {};
	} catch (error) {
		return {};
	}
}

export function sitesTableRoute() {
	return { name: 'SitesTable', query: recallSitesSearchQuery() };
}
