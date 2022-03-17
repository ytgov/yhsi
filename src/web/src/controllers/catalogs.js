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
        console.error(error);
      });
  },
  async postCommunity(data) {
    return await api.post(`catalogs/community`, data)
      .then(res => {
        return res.data;
      }).catch(error => {
        // handle error
        console.error(error);
      });
  },
  async putCommunity(id, data) {
    return await api.put(`catalogs/community/${id}`, data)
      .then(res => {
        return res.data;
      }).catch(error => {
        // handle error
        console.error(error);
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
        console.error(error);
      });
  },
  async getCauses() {
    return await api.get(`catalogs/cause`)
      .then(res => {
        return res.data;
      }).catch(error => {
        // handle error
        console.error(error);
      });
  },
  async getReligions() {
    return await api.get(`catalogs/religion`)
      .then(res => {
        return res.data;
      }).catch(error => {
        // handle error
        console.error(error);
      });
  },
  async getCemetaries() {
    return await api.get(`catalogs/cemetary`)
      .then(res => {
        return res.data;
      }).catch(error => {
        // handle error
        console.error(error);
      });
  },
  async getOccupations() {
    return await api.get(`catalogs/occupation`)
      .then(res => {
        return res.data;
      }).catch(error => {
        // handle error
        console.error(error);
      });
  },
  async getMemberships() {
    return await api.get(`catalogs/membership`)
      .then(res => {
        return res.data;
      }).catch(error => {
        // handle error
        console.error(error);
      });
  },
  async getRelationships() {
    return await api.get(`catalogs/relationship`)
      .then(res => {
        return res.data;
      }).catch(error => {
        // handle error
        console.error(error);
      });
  },
  async getOriginalMedia() {
    return await api.get(`catalogs/originalmedia`)
      .then(res => {
        return res.data;
      }).catch(error => {
        // handle error
        console.error(error);
      });
  },
  async getVesselTypes(page, limit, textToMatch, sortBy, sort) {
    return await api.get(`catalogs/vesseltype`,{
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
      console.error(error);
    });
  },
  async postVesselType(data) {
    return await api.post(`catalogs/vesseltype`, data)
      .then(res => {
        return res.data;
      }).catch(error => {
        // handle error
        console.error(error);
      });
  },
  async postPlaceType(data) {
    return await api.post(`catalogs/placetype`, data)
      .then(res => {
        return res.data;
      }).catch(error => {
        // handle error
        console.error(error);
      });
  },
  async putVesselType(id, data) {
    return await api.put(`catalogs/vesseltype/${id}`, data)
      .then(res => {
        return res.data;
      }).catch(error => {
        // handle error
        console.error(error);
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
        console.error(error);
      });
  },

  async putPlaceType(id, data) {
    return await api.put(`catalogs/placetype/${id}`, data)
      .then(res => {
        return res.data;
      }).catch(error => {
        // handle error
        console.error(error);
      });
  }

} 
