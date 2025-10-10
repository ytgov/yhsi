import axios from "axios";
import { PROFILE_URL } from "../urls";

const state = {
    firstName: "",
    lastName: "",
    email: "",
    id: "",
    expire_date_display: "",
    roles: "",
    role_list: [],
    site_access: [],
};
const getters = {
    firstName: state => state.first_name,
    lastName: state => state.lastName,
    email: state => state.email,
    id: state => state.id,
    expire_date_display: state => state.expire_date_display,
    roles: state => state.roles,
    role_list: state => state.role_list,
    site_access: state => state.access
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
        state.expire_date_display = profile.expire_date_display;
        state.roles = profile.roles;
        state.role_list = profile.role_list;
        state.site_access = profile.site_access;
    },
};

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
};