import axios from "axios";
import { COMMUNITY_URL, FIRST_NATION_URL, USER_URL } from "../urls";


const state = {
    roles: [],
    communities: [],
    firstNations: [],

    //Authorize Access to: Map Sheet Number, Community Name, First Nation Name
    // Map Sheet is free text the other two are dropdowns

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
            .then(resp => resp.data.data)
    },
    loadUser(state, id) {
        return axios.get(`${USER_URL}/${id}`)
            .then(resp => resp.data.data)
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
        let body = { FirstName: user.FirstName, LastName: user.LastName, Email: user.Email, ExpirationDate: user.ExpirationDate, Roles: user.Roles };

        return axios.put(`${USER_URL}/${user.UserId}`, body)
            .then(resp => resp.data)
    },
    saveUserAccess(state, item) {
        //let body = { FirstName: user.FirstName, LastName: user.LastName, Email: user.Email, ExpirationDate: user.ExpirationDate, Roles: user.Roles };

        console.log("SAVE", item);

        if (item.Id) {
            return axios.put(`${USER_URL}/${item.UserId}/access/${item.Id}`, item)
                .then(resp => resp.data)
        }
        else {
            return axios.post(`${USER_URL}/${item.UserId}/access`, item)
                .then(resp => resp.data)
        }
    },
    removeUserAccess(state, item) {
        return axios.delete(`${USER_URL}/${item.UserId}/access/${item.Id}`)
            .then(resp => resp.data)
    }
};

export default {
    namespaced: true,
    state,
    getters,
    mutations,
    actions
};