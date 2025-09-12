const state = {
    rowId: null,
    searchText: null,
    batchId: null,
};
const getters = {
    rowId: state => state.rowId,
    searchText: state => state.searchText,
    batchId: state => state.batchId,
};
const mutations = {
    setRowId(state, val) {
        state.rowId = val;
    },
    setSearchText(state, val) {
        state.searchText = val;
    },
    setBatchId(state, val) {
        state.batchId = val;
    },
};

export default {
    namespaced: true,
    state,
    getters,
    mutations
};