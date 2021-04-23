import { api } from './config';

export default {
  async get(page, limit, textToMatch){
      return await api.get(`boats`,{
        params: {
          page,
          limit,
          textToMatch
        }
      })
      .then(res => {
        return res.data;
      }).catch(error =>{
        // handle error
        console.log(error);
      });
  },
  async getById(id){
    return await api.get(`boats/${id}`)
    .then(res => {
      return res.data;
    }).catch(error =>{
      // handle error
      console.log(error);
    });
  },
  async put(id, data){
    return await api.put(`boats/${id}`,data)
    .then(res => {
      return res.data;
    }).catch(error =>{
      // handle error
      console.log(error);
    });
  },
  async post(data){
    return await api.post(`boats/new`,data)
    .then(res => {
      return res.data;
    }).catch(error =>{
      // handle error
      console.log(error);
    });
  }
}