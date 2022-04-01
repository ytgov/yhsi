import { api } from './config';

export default {
  async get(page, limit, textToMatch, sortBy, sort){
      return await api.get(`boats/`, {
        crossdomain: true,
        params: {
          page,
          limit,
          textToMatch,
          sortBy,
          sort
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
    return await api.get(`boats/${id}`)
      .then(res => {
        return res.data;
      }).catch(error => {
        // handle error
        console.error(error);
      });
  },
  async put(id, data){
    return await api.put(`boats/${id}`, data)
    .then(res => {
      return res.data;
    }).catch(error =>{
      return error;
    });
  },
  async post(data){
    return await api.post(`boats/new`, data)
    .then(res => {
      return res.data;
    }).catch(error =>{
      return error;
    });
  },
  async getAvailableRegNumber(data){
    return await api.get(`boats/available_number/${data}`)
    .then(res => {
      return res.data;
    }).catch(error =>{
      return error;
    });
  },
  async getExport(){
    return await api.post('boats/export')
    .then( res => {
      return res.data;
    }).catch( err => {
      return err;
    })
  },
  async getGridPdf(){
    return await api({
      url: 'boats/pdf',
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
      url: `boats/pdf/${id}`,
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

