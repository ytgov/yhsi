import axios from "axios";
import { PROFILE_URL } from "../urls";

const state = {
    firstName: "",
    lastName: "",
    email: "",
    id: "",
    username: "",
    roles: [],
    access: []
};
const getters = {
    firstName: state => state.first_name,
    lastName: state => state.lastName,
    email: state => state.email,
    id: state => state.id,
    username: state => state.username,
    roles: state => state.roles,
    access: state => state.access
};
const actions = {
    async loadProfile({ commit }) {
        await axios.get(PROFILE_URL)
            .then(resp => {
                commit("setProfile", resp.data.data);
            }).catch(() => {
                commit("auth/clearUser");
            });
    },
};
const mutations = {
    setProfile(state, profile) {
        state.firstName = profile.first_name;
        state.lastName = profile.last_name;
        state.email = profile.email;
        state.id = profile.id;
        state.username = profile.username;
        state.roles = profile.roles;
        state.access = profile.access;
    },
};

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
};