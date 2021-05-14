import { api } from './config';

export default {
  async get(page, limit, textToMatch){
      return await api.get(`aircrash`, {
        crossdomain: true,
        params: {
          page,
          limit,
          textToMatch
        }
      })
      .then(res => {
        console.log(res);
        return res.data;
      }).catch(error =>{
        // handle error
        console.log(error);
      });
  },
  async getById(id){
    return await api.get(`aircrash/${id}`)
    .then(res => {
      return res.data;
    }).catch(error =>{
      // handle error
      console.log(error);
    });
  },
  async put(id, data){
    return await api.put(`aircrash/${id}`,data)
    .then(res => {
      return res.data;
    }).catch(error =>{
      // handle error
      console.log(error);
    });
  },
  async post(data){
    return await api.post(`aircrash/new`,data)
    .then(res => {
      return res.data;
    }).catch(error =>{
      // handle error
      console.log(error);
    });
  },
}

