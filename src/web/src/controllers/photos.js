import api from './config';

  export default {
    async getByBoatId(id){//doesnt work rn
      return await api.get(`photos/${id}`)
      .then(res => {
        return res.data;
      }).catch(error =>{
        // handle error
        console.log(error);
      });
  },
  }