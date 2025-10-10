
import axios from "axios";
import { MAPS_URL, PLACE_URL } from "@/urls";

const state = {
};
const getters = {
};
const mutations = {
};
const actions = {
    loadToken() {
        return axios.get(`${MAPS_URL}`)
            .then(resp => resp.data)
            .catch((err) => { return { error: err.response.data } })
    },
    searchByYHSIId(store, id) {
        return axios.post(`${PLACE_URL}/search`, { query: { search: id }, sortBy: [], page: 1, itemsPerPage: 20, groupBy: [], groupDesc: [] }).then(resp => resp.data.data);
    }
};

export default {
    namespaced: true,
    state,
    getters,
    mutations,
    actions
};
