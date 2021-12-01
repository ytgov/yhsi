


const state = {
    alert: false,
    text: null,
    type: null,
    timeout: 0
};
const getters = {
    alert: state => state.alert,
    text: state => state.text,
    type: state => state.type,
    timeout: state => state.timeout
};
const mutations = {
    setAlert(state, alert) {
        state.alert = alert;
    },
    setText(state, text){
        state.text = text;
    },
    setType(state, type){
        state.type = type;
    },
    setTimeout(state, timeout){
        state.timeout = timeout;
    }
};

export default {
    namespaced: true,
    state,
    getters,
    mutations
};