import axios from 'axios';

const api = axios.create({
    baseURL: 'https://jsonplaceholder.typicode.com/',//this url is going to be replaced
    timeout: 5000,
    headers: {}
  });

  export default {
    async get(){
        await api.get(`users`)
        .then(res => {
          //handle data response
          console.log("data from jsonpaceholder using an external file");
          console.log(res.data);
        }).catch(error =>{
          // handle error
          console.log(error);
        });
    },
    async post(data){
      api.post('users', data)
      .then( res => {
        console.log(res);
      }).catch(error =>{
          // handle error
          console.log(error);
        });
    },
    async put(id,data){
      api.put(`users/${id}`, data)
      .then( res => {
        console.log(res);
      }).catch(error =>{
        // handle error
        console.log(error);
      });
    }
  }