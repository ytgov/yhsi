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
        console.error(error);
      });
  },
  async getById(id) {
    return await api.get(`burials/${id}`)
      .then(res => {
        return res.data;
      }).catch(error => {
        // handle error
        console.error(error);
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
  },
  async getExport(){
    return await api.post('burials/export')
    .then( res => {
      return res.data;
    }).catch( err => {
      return err;
    })
  },
  async getGridPdf(){
    return await api({
      url: 'burials/pdf',
      method: 'POST',
      responseType: 'blob',
    })
    .then( res => {
      return res.data;
    }).catch( err => {
      return err;
    })
  },
  async getPdf(id){
    return await api({
      url: `burials/pdf/${id}`,
      method: 'POST',
      responseType: 'blob',
    })
    .then( res => {
      return res.data;
    }).catch( err => {
      return err;
    })
  },
}

