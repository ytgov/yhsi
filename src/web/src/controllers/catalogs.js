import { api } from './config';

  export default {
  async getCommunities(){
    return await api.get(`catalogs/community`)
    .then(res => {
      return res.data;
    }).catch(error =>{
      // handle error
      console.log(error);
    });
  },
  async getOriginalMedia(){
    return await api.get(`catalogs/originalmedia`)
    .then(res => {
      return res.data;
    }).catch(error =>{
      // handle error
      console.log(error);
    });
  },
}