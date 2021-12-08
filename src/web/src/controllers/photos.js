import { api, apiP } from './config';

export default {
  async getAll(page, textToMatch) {
    return await api.get(`extras/photos`, {
      crossdomain: true,
      params: {
        page: page,
        limit: 6,
        textToMatch
      }
    })
      .then(res => {
        return res.data;
      }).catch(error => {
        // handle error
        console.log(error);
      });
  },
  // Boats
  async getByBoatId(id) {
    return await api.get(`photos/boat/${id}`)
      .then(res => {
        return res.data;
      }).catch(error => {
        // handle error
        console.log(error);
      });
  },
  async postBoatPhoto(data) {
    return await apiP.post(`photos/boat/new`, data)
      .then(res => {
        return res.data;
      }).catch(error => {
        // handle error
        console.log(error);
      });
  },
  async linkBoatPhotos(id, data) {
    return await api.post(`photos/boat/link/${id}`, data)
      .then(res => {
        return res.data;
      }).catch(error => {
        // handle error
        console.log(error);
      });
  },
  // Aircrashes
  async getByYACSINumber(yacsinumber) {
    return await api.get(`photos/aircrash/${yacsinumber}`)
      .then(res => {
        return res.data;
      }).catch(error => {
        // handle error
        console.log(error);
      });
  },
  async postAirCrashPhoto(data) {
    return await apiP.post(`photos/aircrash/new`, data)
      .then(res => {
        return res.data;
      }).catch(error => {
        // handle error
        console.log(error);
      });
  },
  async linkAirCrashPhotos(yacsinumber, data) {
    return await api.post(`photos/aircrash/link/${yacsinumber}`, data)
      .then(res => {
        return res.data;
      }).catch(error => {
        // handle error
        console.log(error);
      });
  },
  // Yt Places
  async getByPlaceId(id) {
    return await api.get(`extras/photos/ytplace/${id}`)
      .then(res => {
        return res.data;
      }).catch(error => {
        // handle error
        console.log(error);
      });
  },
  async postPlacePhoto(data) {
    return await apiP.post(`extras/photos/ytplace`, data)
      .then(res => {
        return res.data;
      }).catch(error => {
        // handle error
        console.log(error);
      });
  },
  async linkPlacePhotos(id, data) {
    return await api.post(`extras/photos/ytplace/link/${id}`, data)
      .then(res => {
        return res.data;
      }).catch(error => {
        // handle error
        console.log(error);
      });
  },

}