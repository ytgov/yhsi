import { api } from './config';

export default {
  async getCommunities(page, limit, textToMatch, sortBy, sort) {
    return await api.get(`catalogs/community`, {
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
      }).catch(error => {
        // handle error
        console.log(error);
      });
  },
  async postCommunity(data) {
    return await api.post(`catalogs/community`, data)
      .then(res => {
        return res.data;
      }).catch(error => {
        // handle error
        console.log(error);
      });
  },
  async putCommunity(id, data) {
    return await api.put(`catalogs/community/${id}`, data)
      .then(res => {
        return res.data;
      }).catch(error => {
        // handle error
        console.log(error);
      });
  },
  async getPhotoOwners(page, limit, textToMatch, sortBy, sort) {
    return await api.get(`catalogs/photo-owner`, {
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
      }).catch(error => {
        // handle error
        console.log(error);
      });
  },
  async postPhotoOwner(data) { 
    return await api.post(`photo-owner`, data)
      .then(res => {
        return res.data;
      }).catch(error => {
        // handle error
        console.log(error);
      });
  },
  async putPhotoOwner(id, data) {   
    return await api.put(`photo-owner/${id}`, data)
      .then(res => {
        return res.data;
      }).catch(error => {
        // handle error
        console.log(error);
      });
  },
  
  async getPhotoProjects(page, limit, textToMatch, sortBy, sort) {
    return await api.get(`catalogs/photo-project`, {
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
      }).catch(error => {
        // handle error
        console.log(error);
      });
  },
  async postPhotoProject(data) { 
    return await api.post(`photo-project`, data)
      .then(res => {
        return res.data;
      }).catch(error => {
        // handle error
        console.log(error);
      });
  },
  async putPhotoProject(id, data) {   
    return await api.put(`photo-project/${id}`, data)
      .then(res => {
        return res.data;
      }).catch(error => {
        // handle error
        console.log(error);
      });
  },

  async getPhotoSubjects(page, limit, textToMatch, sortBy, sort) {
    return await api.get(`catalogs/photo-subject`, {
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
      }).catch(error => {
        // handle error
        console.log(error);
      });
  },
  async postPhotoSubject(data) { 
    return await api.post(`photo-subject`, data)
      .then(res => {
        return res.data;
      }).catch(error => {
        // handle error
        console.log(error);
      });
  },
  async putPhotoSubject(id, data) {   
    return await api.put(`photo-subject/${id}`, data)
      .then(res => {
        return res.data;
      }).catch(error => {
        // handle error
        console.log(error);
      });
  },

  async getOriginalMedia() {
    return await api.get(`catalogs/originalmedia`)
      .then(res => {
        return res.data;
      }).catch(error => {
        // handle error
        console.log(error);
      });
  },
  async getVesselTypes(page, limit, textToMatch, sortBy, sort) {
    return await api.get(`catalogs/vesseltype`, {
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
      }).catch(error => {
        // handle error
        console.log(error);
      });
  },
  async postVesselType(data) {
    return await api.post(`catalogs/vesseltype`, data)
      .then(res => {
        return res.data;
      }).catch(error => {
        // handle error
        console.log(error);
      });
  },
  async putVesselType(id, data) {
    return await api.put(`catalogs/vesseltype/${id}`, data)
      .then(res => {
        return res.data;
      }).catch(error => {
        // handle error
        console.log(error);
      });
  },
  async getPlaceTypes(page, limit, textToMatch, sortBy, sort) {
    return await api.get(`catalogs/placetype`, {
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
      }).catch(error => {
        // handle error
        console.log(error);
      });
  },
  async postPlaceType(data) {
    return await api.post(`catalogs/placetype`, data)
      .then(res => {
        return res.data;
      }).catch(error => {
        // handle error
        console.log(error);
      });
  },
  async putPlaceType(id, data) {
    return await api.put(`catalogs/placetype/${id}`, data)
      .then(res => {
        return res.data;
      }).catch(error => {
        // handle error
        console.log(error);
      });
  },
}