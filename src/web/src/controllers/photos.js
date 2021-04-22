import api from './config';

  export default {
    async get(){
        return await api.get(`photos`)
        .then(res => {

            console.log(res.data);
          return res.data;
        }).catch(error =>{
          // handle error
          console.log(error);
        });
    },
    async getByPhotoId(id){//doesnt work rn
      return await api.get(`photos/${id}`)
      .then(res => {
        return res.data;
      }).catch(error =>{
        // handle error
        console.log(error);
      });
  },
  }