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
    return await api.post(`people/new`, data)
    .then(res => {
      return res.data;
    }).catch(error =>{
      return error;
    });
  },
}

