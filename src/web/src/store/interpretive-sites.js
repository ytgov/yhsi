const state = {
    selectedSiteFilters: [],
    selectedActionFilters: [],
    selectedAssetFilters: [],
    siteSearch: "",
    actionSearch: "",
    assetSearch: "",
    siteTableOptions: { sortBy: ["SiteName"], sortDesc: [false]},
    actionTableOptions: { sortBy: ["ActionDesc"], sortDesc: [false]},
    assetTableOptions: { sortBy: ["Description"], sortDesc: [false]},
};
const getters = {
    selectedSiteFilters: state => state.selectedSiteFilters,
    selectedAssetFilters: state => state.selectedAssetFilters,
    selectedActionFilters: state => state.selectedActionFilters,
    siteSearch: state => state.siteSearch,
    actionSearch: state => state.actionSearch,
    assetSearch: state => state.assetSearch,
    siteTableOptions: state => state.siteTableOptions,
    actionTableOptions: state => state.actionTableOptions,
    assetTableOptions: state => state.assetTableOptions
};
const mutations = {
    setSiteSearch(state, search) {
        state.siteSearch = search;
    },
    setActionSearch(state, search) {
        state.actionSearch = search;
    },
    setAssetSearch(state, search) {
        state.assetSearch = search;
    },
    setSiteFilters(state, arr) {
        state.selectedSiteFilters = arr;
    },
    setActionFilters(state, arr) {
        state.selectedActionFilters = arr;
    },
    setAssetFilters(state, arr) {
        state.selectedAssetFilters = arr;
    },
    setSiteTableOptions(state, obj){
        state.siteTableOptions = obj;
    },
    setActionTableOptions(state, obj){
        state.actionTableOptions = obj;
    },
    setAssetTableOptions(state, obj){
        state.assetTableOptions = obj;
    }
};

export default {
    namespaced: true,
    state,
    getters,
    mutations
};