import { api } from './config';

export default {
  async get(page, limit, textToMatch, sortBy, sort) {
    return await api.get(`users`, {
      crossdomain: true,
      params: {
        page,
        limit,
        textToMatch,
        sortBy,
        sort
      }
    })
      .then(res => {
        return res.data;
      }).catch(error => {
        // handle error
        console.log(error);
      });
  },
  async getById(aircrashId) {
    return await api.get(`users/${aircrashId}`)
      .then(res => {
        return res.data;
      }).catch(error => {
        // handle error
        console.log(error);
      });
  },
  async put(aircrashId, data) {
    return await api.put(`users/${aircrashId}`, data)
      .then(res => {
        return res.data;
      }).catch(error => {
        // handle error
        console.log(error);
      });
  },
  async putAccess(userID, data) {
    return await api.put(`users/access/${userID}`, data)
      .then(res => {
        return res.data;
      }).catch(error => {
        // handle error
        console.log(error);
      });
  },
  async getAccess(userID) {
    return await api.get(`users/access/${userID}`)
      .then(res => {
        return res.data;
      }).catch(error => {
        // handle error
        console.log(error);
      });
  },
  async getSections() {
    return await api.get(`users/access/sections`)
      .then(res => {
        return res.data;
      }).catch(error => {
        // handle error
        console.log(error);
      });
  },
}

