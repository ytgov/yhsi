
import axios from "axios";
import { MAPS_URL } from "@/urls";

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
};

export default {
    namespaced: true,
    state,
    getters,
    mutations,
    actions
};
