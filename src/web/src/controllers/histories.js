import { api } from './config';

export default {
  async post(data) {
    return await api.post(`histories`, data)
      .then(res => {
        return res.data;
      }).catch(error => {
        // handle error
        console.error(error);
      });
  },
  async put(historyId, data) {
    return await api.put(`histories/${historyId}`, data)
      .then(res => {
        return res.data;
      }).catch(error => {
        // handle error
        console.error(error);
      });
  },
  async postOwner(data) {
    return await api.post(`histories/owner`, data)
      .then(res => {
        return res.data;
      }).catch(error => {
        // handle error
        console.error(error);
      });
  },
  async putOwner(historyId, data) {
    return await api.put(`histories/owner/${historyId}`, data)
      .then(res => {
        return res.data;
      }).catch(error => {
        // handle error
        console.error(error);
      });
  }


}

