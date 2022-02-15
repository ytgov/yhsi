

const state = {
    selectedFilters: [],
    ownerSearch: "",
    boatSearch: "",
    boats: [],
    owners: [],
};
const getters = {
    selectedFilters: state => state.selectedFilters,
    ownerSearch: state => state.ownerSearch,
    boatSearch: state => state.boatSearch,
    boats: state => state.boats,
    owners: state => state.owners
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
    }
};

export default {
    namespaced: true,
    state,
    getters,
    mutations
};