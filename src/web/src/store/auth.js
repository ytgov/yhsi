import axios from "axios";
import { LOGOUT_URL, PROFILE_URL } from "../urls";

const state = {
    user: null,
};
const getters = {
    isAuthenticated: state => { return !!state.user },
    fullName: state => { return state.user.display_name },
    user: state => { return state.user },
    roles: state => { return state.user.role_list },

    userInRole: state => {
        return (roles) => {
            if (typeof roles === 'string') roles = [roles];
            if (roles.length == 0) return true;

            if (state.user.role_list.indexOf('Administrator') > -1) return true;

            return state.user.role_list.filter(f => roles.indexOf(f) !== -1).length > 0;
        }
    },
};
const actions = {
    async checkAuthentication({ commit }) {
        await axios.get(PROFILE_URL)
            .then(resp => {
                commit("setUser", resp.data.data);
            }).catch(() => {
                commit("clearUser");
            });
    },
    async signOut({ commit }) {
        await axios.get(LOGOUT_URL)
            .then(() => {
                commit("clearUser");
            }).catch(err => {
                console.error(err);
            });
    },
};
const mutations = {
    setUser(state, user) {
        state.user = user;
    },
    clearUser(state) {
        state.user = null;
    }
};

export default {
    state,
    getters,
    actions,
    mutations
};
