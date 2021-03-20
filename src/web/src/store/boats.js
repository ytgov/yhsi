

const state = {
    selectedFilters: [],
    search: ""
};
const getters = {
    selectedFilters: state => state.selectedFilters,
    search: state => state.search
};
const mutations = {
    setSearch(state, search) {
        state.search = search;
    },
    setSelectedFilters(state, arr) {
        state.selectedFilters = arr;
    },
};


export default {
    namespaced: true,
    state,
    getters,
    mutations
};