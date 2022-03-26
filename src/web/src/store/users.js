import axios from "axios";
import { COMMUNITY_URL, FIRST_NATION_URL, USER_URL } from "../urls";

const state = {
    roles: [],
    communities: [],
    firstNations: [],
};
const getters = {
    roles: state => state.roles,
    communities: state => state.communities,
    firstNations: state => state.firstNations,
};
const mutations = {
    setRoles(state, value) {
        state.roles = value;
    },
    setCommunities(state, value) {
        state.communities = value;
    },
    setFirstNations(state, value) {
        state.firstNations = value;
    }
};
const actions = {
    loadUsers() {
        return axios.get(`${USER_URL}`)
            .then(resp => resp.data)
            .catch((err) => { return { error: err.response.data } })
    },
    loadUser(state, id) {
        return axios.get(`${USER_URL}/${id}`)
            .then(resp => resp.data)
            .catch((err) => { return { error: err.response.data } })
    },
    loadRoles(state) {
        if (state.state.roles.length == 0) {
            return axios.get(`${USER_URL}/roles`)
                .then(resp => {
                    state.commit("setRoles", resp.data.data)
                    return resp.data.data;
                })
        }
    },
    loadCommunities(state) {
        if (state.state.communities.length == 0) {
            return axios.get(`${COMMUNITY_URL}`)
                .then(resp => {
                    state.commit("setCommunities", resp.data.data)
                })
        }
    },
    loadFirstNations(state) {
        if (state.state.firstNations.length == 0) {
            return axios.get(`${FIRST_NATION_URL}`)
                .then(resp => {
                    state.commit("setFirstNations", resp.data.data)
                })
        }
    },
    updateUser(state, user) {
        let body = { first_name: user.first_name, last_name: user.last_name, expire_date_display: user.expire_date_display, role_list: user.role_list, status: user.status };

        return axios.put(`${USER_URL}/${user.id}`, body)
            .then(resp => resp)
    },
    saveUserAccess(state, item) {
        if (item.id) {
            return axios.put(`${USER_URL}/${item.user_id}/access/${item.id}`, item)
                .then(resp => resp)
        }
        else {
            return axios.post(`${USER_URL}/${item.user_id}/access`, item)
                .then(resp => resp)
        }
    },
    removeUserAccess(state, item) {
        return axios.delete(`${USER_URL}/${item.user_id}/access/${item.id}`)
            .then(resp => resp)
    },
    createAccount(state, item) {
        return axios.post(`${USER_URL}/sign-up-external`, item)
            .then(resp => resp)
            .catch((err) => { return { error: err.response.data } })
    }
};

export default {
    namespaced: true,
    state,
    getters,
    mutations,
    actions
};