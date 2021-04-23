import { api } from './config';

export default {
    async post(data){
      return await api.post(`histories/new`,data)
      .then(res => {
        return res.data;
      }).catch(error =>{
        // handle error
        console.log(error);
      });
    },
    async put(historyId, data){
      return await api.post(`histories/${historyId}`,data)
      .then(res => {
        return res.data;
      }).catch(error =>{
        // handle error
        console.log(error);
      });
    }
  }
  
  