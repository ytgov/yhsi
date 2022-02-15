import store from '../store/index'
import axios from 'axios';
import { apiBaseUrl } from "../config";

// const BASE_URL =  'https://api.gov.yk.ca/heritage/api/';
const BASE_URL = `${apiBaseUrl}/api`;
// const BASE_URL = `http://localhost:3000/api/`;
const TEST_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ5Zy1jbGFpbXMiOnsicGVybWlzc2lvbnMiOlsidmlldyIsImNyZWF0ZSIsImVkaXQiXX0sInN1YiI6IjEyMzQ1Njc4OTAiLCJuYW1lIjoiSm9obiBEb2UiLCJpYXQiOjE1MTYyMzkwMjJ9.BDa7etuFx-QoqTHxEwOpBaWdsbupbrL4YszziI_W7to'
axios.defaults.headers.common['Authorization'] = `Bearer ${TEST_TOKEN}`;
axios.defaults.headers.common['Ocp-Apim-Subscription-Key'] = '5d23d587d6674b88b29349f12da7a406';

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 240000,
  withCredentials: true,
});
//axios.defaults.withCredentials = true;

const apiP = axios.create({
  baseURL: BASE_URL, 
  timeout: 24000,
  headers: {
    'Content-Type': 'multipart/form-data',
  }
});

function createInterceptor(instance) {
  instance.interceptors.response.use((response) => {
    let { config } = response;
    if (config.method != "get") {
      store.commit('alerts/setText', "Done!");
      store.commit('alerts/setType', "success");
      store.commit('alerts/setTimeout', 2000);
      store.commit('alerts/setAlert', true);
    }
    return response;
  }, (error) => {
    let { response } = error;
    if (response.status != 409) {
      console.log("test", error);
      store.commit('alerts/setText', "A problem has ocurred, please check your internet connection!");
      store.commit('alerts/setType', "warning");
      store.commit('alerts/setTimeout', 5000);
      store.commit('alerts/setAlert', true);
    }

    return Promise.reject(error);
  });
}

createInterceptor(api);
createInterceptor(apiP);
export { api, apiP };
