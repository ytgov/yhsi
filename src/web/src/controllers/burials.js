import { api } from './config';

export default {
  async get(
      page, 
      limit,  
      textToMatch, 
      sortBy, 
      sort,
      BirthYear,
      BirthMonth,
      BirthDay,
      DeathYear,
      DeathMonth,
      DeathDay,
      Gender,
      Cause,
      Manner,
      Cemetary,
      OriginCountry ){
      return await api.get(`burials/`, {
        crossdomain: true,
        params: {
          page,
          limit,
          textToMatch,
          sortBy,
          sort,
          BirthYear,
          BirthMonth,
          BirthDay,
          DeathYear,
          DeathMonth,
          DeathDay,
          Gender,
          Cause,
          Manner,
          Cemetary,
          OriginCountry
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
    return await api.get(`burials/${id}`)
      .then(res => {
        return res.data;
      }).catch(error => {
        // handle error
        console.log(error);
      });
  },
  async put(id, data){
    return await api.put(`burials/${id}`, data)
    .then(res => {
      return res.data;
    }).catch(error =>{
      return error;
    });
  },
  async post(data){
    return await api.post(`burials`, data)
    .then(res => {
      return res.data;
    }).catch(error =>{
      return error;
    });
  },
  async getAvailableRegNumber(data){
    return await api.get(`burials/available_number/${data}`)
    .then(res => {
      return res.data;
    }).catch(error =>{
      return error;
    });
  }
}

