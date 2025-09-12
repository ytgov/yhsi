

const state = {
    selectedFilters: [],
    ownerSearch: "",
    boatSearch: "",
    boatTableOptions: { sortBy: ["Name"], sortDesc: [false]},
    ownerTableOptions: { sortBy: ["OwnerName"], sortDesc: [false]},
    boats: [],
    owners: [],
};
const getters = {
    selectedFilters: state => state.selectedFilters,
    ownerSearch: state => state.ownerSearch,
    boatSearch: state => state.boatSearch,
    boats: state => state.boats,
    owners: state => state.owners,
    boatTableOptions: state => state.boatTableOptions,
    ownerTableOptions: state => state.ownerTableOptions
};
const mutations = {
    setBoatSearch(state, search) {
        state.boatSearch = search;
    },
    setOwnerSearch(state, search) {
        state.ownerSearch = search;
    },
    setSelectedFilters(state, arr) {
        state.selectedFilters = arr;
    },
    setBoats(state, arr){
        state.boats = arr;
    },
    setOwners(state, arr){
        state.owners = arr;
    },
    setBoatTableOptions(state, obj){
        state.boatTableOptions = obj;
    },
    setOwnerTableOptions(state, obj){
        state.ownerTableOptions = obj;
    }
};

export default {
    namespaced: true,
    state,
    getters,
    mutations
};