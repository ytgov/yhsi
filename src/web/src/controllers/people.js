import { api } from './config';

export default {
  async get(page, limit, textToMatch, sortBy, sort){
      return await api.get(`people/`, {
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
      }).catch(error =>{
        // handle error
        console.log(error);
      });
  },
  async getById(id) {
    return await api.get(`people/${id}`)
      .then(res => {
        return res.data;
      }).catch(error => {
        // handle error
        console.log(error);
      });
  },
  async put(id, data){
    return await api.put(`people/${id}`, data)
    .then(res => {
      return res.data;
    }).catch(error =>{
      return error;
    });
  },
  async post(data){
    return await api.post(`people/`, data)
    .then(res => {
      return res.data;
    }).catch(error =>{
      return error;
    });
  },

  //history

  async postHistory(id,data){
    return await api.post(`people/${id}/history`, data)
    .then(res => {
      return res.data;
    }).catch(error =>{
      return error;
    });
  },
  async putHistory(id,data){
    return await api.put(`people/history/${id}`, data)
    .then(res => {
      return res.data;
    }).catch(error =>{
      return error;
    });
  },
  async getHistories(id){
    return await api.get(`people/${id}/histories`)
    .then(res => {
      console.log(res);
      return res.data;
    }).catch(error =>{
      return error;
    });
  },
}

