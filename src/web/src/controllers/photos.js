import { api, apiP } from './config';

  export default {
    async getByBoatId(id){
      return await api.get(`photos/${id}`)
      .then(res => {
        return res.data;
      }).catch(error =>{
        // handle error
        console.log(error);
      });
  },
  async post(data){
    return await apiP.post(`photos/new`,data)
    .then(res => {
      return res.data;
    }).catch(error =>{
      // handle error
      console.log(error);
    });
  }, 
}