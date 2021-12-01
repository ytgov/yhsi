import { api } from './config';

export default {
  async get(page, limit, textToMatch, sortBy, sort) {
    return await api.get(`aircrash`, {
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
  async getById(aircrashId){
    return await api.get(`aircrash/${aircrashId}`)
      .then(res => {
        return res.data;
      }).catch(error => {
        // handle error
        console.log(error);
      });
  },
  async put(aircrashId, data){
    return await api.put(`aircrash/${aircrashId}`, data)
      .then(res => {
        return res.data;
      }).catch(error => {
        // handle error
        console.log(error);
      });
  },
  async post(data){
    return await api.post(`aircrash/new`, data)
      .then(res => {
        return res.data;
      }).catch(error => {
        // handle error
        console.log(error.response);
        return error;
      });
  },
  async getAvailableYACSI(data){
    return await api.get(`aircrash/available_yacsi/${data}`)
    .then(res => {
      return res.data;
    }).catch(error =>{
      return error;
    });
  }
}

