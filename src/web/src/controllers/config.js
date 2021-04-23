
import axios from 'axios';

const BASE_URL =  'http://localhost:8888/api/';
const TEST_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ5Zy1jbGFpbXMiOnsicGVybWlzc2lvbnMiOlsidmlldyIsImNyZWF0ZSIsImVkaXQiXX0sInN1YiI6IjEyMzQ1Njc4OTAiLCJuYW1lIjoiSm9obiBEb2UiLCJpYXQiOjE1MTYyMzkwMjJ9.BDa7etuFx-QoqTHxEwOpBaWdsbupbrL4YszziI_W7to'

const api =  axios.create({
  baseURL: BASE_URL,//this url is going to be replaced 
  timeout: 24000,
  headers : {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${TEST_TOKEN}`
  }
});

const apiP  =  axios.create({
  baseURL: BASE_URL,//this url is going to be replaced 
  timeout: 24000,
  headers : {
    'Content-Type': 'multipart/form-data',
    'Authorization': `Bearer ${TEST_TOKEN}`
  }
});

export {api, apiP}; 

  