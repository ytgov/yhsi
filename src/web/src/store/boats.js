

const state = {
    selectedFilters: [],
    search: "",
    boats: [],
    owners: [],
};
const getters = {
    selectedFilters: state => state.selectedFilters,
    search: state => state.search,
    boats: state => state.boats,
    owners: state => state.owners
};
const mutations = {
    setSearch(state, search) {
        state.search = search;
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