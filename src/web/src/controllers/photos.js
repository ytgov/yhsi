import { api, apiP } from './config';

export default {
  async getAll(page, textToMatch) {
    return await api.get(`photos`, {
      crossdomain: true,
      params: {
        page: page,
        limit: 6,
        textToMatch
      }
    })
      .then(res => {
        return res.data;
      }).catch(error => {
        // handle error
        console.log(error);
      });
  },
    async getByBoatId(id) {
      return await api.get(`photos/boat/${id}`)
      .then(res => {
        return res.data;
      }).catch(error =>{
        // handle error
        console.log(error);
      });
  },
  async postBoatPhoto(data) {
    return await apiP.post(`photos/boat/new`,data)
    .then(res => {
      return res.data;
    }).catch(error =>{
      // handle error
      console.log(error);
    });
  }, 
  //AIRCRASH PHOTOS
  async getByYACSINumber(yacsinumber) {
    return await api.get(`photos/aircrash/${yacsinumber}`)
    .then(res => {
      return res.data;
    }).catch(error =>{
      // handle error
      console.log(error);
    });
  },
  async postAirCrashPhoto(data) {
    return await apiP.post(`photos/aircrash/new`,data)
    .then(res => {
      return res.data;
    }).catch(error =>{
      // handle error
      console.log(error);
    });
  }, 
  async linkAirCrashPhotos(yacsinumber,data) {
    return await api.post(`photos/aircrash/link/${yacsinumber}`,data)
    .then(res => {
      return res.data;
    }).catch(error =>{
      // handle error
      console.log(error);
    });
  }, 
  async linkBoatPhotos(id,data) {
    return await api.post(`photos/boat/link/${id}`,data)
    .then(res => {
      return res.data;
    }).catch(error =>{
      // handle error
      console.log(error);
    });
  }, 

  //PEOPLE PHOTOS
  async linkPersonPhotos(id, data){
    return await api.post(`photos/people/link/${id}`, data)
    .then(res => {
      return res.data;
    }).catch( err => {
      console.log(err);
    })
  },
  async getByPersonId(id) {
    return await api.get(`photos/people/${id}`)
    .then(res => {
      return res.data;
    }).catch(error =>{
      // handle error
      console.log(error);
    });
  },
  async postPersonPhoto(data) {
    return await apiP.post(`photos/people/new`,data)
    .then(res => {
      return res.data;
    }).catch(error =>{
      // handle error
      console.log(error);
    });
  }, 

}