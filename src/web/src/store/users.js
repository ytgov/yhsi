

const state = {
    roles: [],
};
const getters = {
    roles: state => state.roles,
};
const mutations = {
    setRoles(state, value){
        state.roles = value;
    }
};

export default {
    namespaced: true,
    state,
    getters,
    mutations,
};