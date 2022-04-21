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
      return await api.get(`interpretive-sites/`, {
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
    return await api.get(`interpretive-sites/${id}`)
      .then(res => {
        return res.data;
      }).catch(error => {
        // handle error
        console.error(error);
      });
  },
  async put(id, data){
    return await api.put(`interpretive-sites/${id}`, data)
    .then(res => {
      return res.data;
    }).catch(error =>{
      return error;
    });
  },
  async post(data){
    return await api.post(`interpretive-sites`, data)
    .then(res => {
      return res.data;
    }).catch(error =>{
      return error;
    });
  },
  async getAvailableRegNumber(data){
    return await api.get(`interpretive-sites/available_number/${data}`)
    .then(res => {
      return res.data;
    }).catch(error =>{
      return error;
    });
  },
  async getExport(
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
  ){
    return await api.post('interpretive-sites/export', {
      page: 0,
      limit: 0,
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
    })
    .then( res => {
      return res.data;
    }).catch( err => {
      return err;
    })
  },
  async getGridPdf(
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
  ){
    return await api({
      url: 'interpretive-sites/pdf',
      method: 'POST',
      responseType: 'blob',
      data: {
        page: 0,
        limit: 0,
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
    .then( res => {
      return res.data;
    }).catch( err => {
      return err;
    })
  },
  async getPdf(id){
    return await api({
      url: `interpretive-sites/pdf/${id}`,
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

