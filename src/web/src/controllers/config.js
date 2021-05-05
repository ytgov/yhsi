
import axios from 'axios';

const BASE_URL =  'https://api.gov.yk.ca/heritage/api/';
const TEST_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ5Zy1jbGFpbXMiOnsicGVybWlzc2lvbnMiOlsidmlldyIsImNyZWF0ZSIsImVkaXQiXX0sInN1YiI6IjEyMzQ1Njc4OTAiLCJuYW1lIjoiSm9obiBEb2UiLCJpYXQiOjE1MTYyMzkwMjJ9.BDa7etuFx-QoqTHxEwOpBaWdsbupbrL4YszziI_W7to'

const api =  axios.create({
  baseURL: BASE_URL,//this url is going to be replaced 
  timeout: 24000,
  headers : {
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${TEST_TOKEN}`,
    'Ocp-Apim-Subscription-Key': '5d23d587d6674b88b29349f12da7a406'
  }
});

const apiP  =  axios.create({
  baseURL: BASE_URL,//this url is going to be replaced 
  timeout: 24000,
  headers : {
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'multipart/form-data',
    'Authorization': `Bearer ${TEST_TOKEN}`,
    'Ocp-Apim-Subscription-Key': '5d23d587d6674b88b29349f12da7a406'
  }
});

export {api, apiP}; 

  