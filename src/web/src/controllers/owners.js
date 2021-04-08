import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8888/api/',//this url is going to be replaced 
    timeout: 5000,
    headers : {
      'Content-Type': 'application/json',
      'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ5Zy1jbGFpbXMiOnsicGVybWlzc2lvbnMiOlsidmlldyIsImNyZWF0ZSIsImVkaXQiXX0sInN1YiI6IjEyMzQ1Njc4OTAiLCJuYW1lIjoiSm9obiBEb2UiLCJpYXQiOjE1MTYyMzkwMjJ9.BDa7etuFx-QoqTHxEwOpBaWdsbupbrL4YszziI_W7to`
    }
  });

  export default {
    async get(page, limit){
      return await api.get(`owners`,{
        params: {
          page,
          limit
        }
      })
      .then(res => {
        return res.data;
      }).catch(error =>{
        // handle error
        console.log(error);
      });
  },
    async getById(id){
        return await api.get(`owners/${id}`)
        .then(res => {
          return res.data;
        }).catch(error =>{
          // handle error
          console.log(error);
        });
    }
  }