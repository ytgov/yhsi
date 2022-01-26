const state = {
    rowId: null,
    searchText: null,
};
const getters = {
    rowId: state => state.rowId,
    searchText: state => state.searchText,
};
const mutations = {
    setRowId(state, val) {
        state.rowId = val;
    },
    setSearchText(state, val) {
        state.searchText = val;
    },
};

export default {
    namespaced: true,
    state,
    getters,
    mutations
};