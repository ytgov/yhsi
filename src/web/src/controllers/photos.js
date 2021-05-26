import { api, apiP } from './config';

  export default {
    async getByBoatId(id){
      return await api.get(`photos/boat/${id}`)
      .then(res => {
        return res.data;
      }).catch(error =>{
        // handle error
        console.log(error);
      });
  },
  async postBoatPhoto(data){
    return await apiP.post(`photos/boat/new`,data)
    .then(res => {
      return res.data;
    }).catch(error =>{
      // handle error
      console.log(error);
    });
  }, 
  //AIRCRASH PHOTOS
  async getByYACSINumber(yacsinumber){
    return await api.get(`photos/aircrash/${yacsinumber}`)
    .then(res => {
      return res.data;
    }).catch(error =>{
      // handle error
      console.log(error);
    });
  },
  async postAirCrashPhoto(data){
    return await apiP.post(`photos/aircrash/new`,data)
    .then(res => {
      return res.data;
    }).catch(error =>{
      // handle error
      console.log(error);
    });
  }, 
}