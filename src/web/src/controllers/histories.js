import { api } from './config';

export default {
  async post(data) {
    return await api.post(`histories/new`, data)
      .then(res => {
        return res.data;
      }).catch(error => {
        // handle error
        console.log(error);
      });
  },
  async put(historyId, data) {
    return await api.put(`histories/${historyId}`, data)
      .then(res => {
        return res.data;
      }).catch(error => {
        // handle error
        console.log(error);
      });
  },
  async postOwner(data) {
    return await api.post(`histories/owner/new`, data)
      .then(res => {
        return res.data;
      }).catch(error => {
        // handle error
        console.log(error);
      });
  },
  async putOwner(historyId, data) {
    return await api.put(`histories/owner/${historyId}`, data)
      .then(res => {
        return res.data;
      }).catch(error => {
        // handle error
        console.log(error);
      });
  }


}

