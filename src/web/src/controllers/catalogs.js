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
<<<<<<< HEAD
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
  },
//CAUSES
=======
>>>>>>> 0cdf0c39d93068ce691cb9c87d8d8dd0e9875eaf
  async getCauses() {
    return await api.get(`catalogs/cause`)
      .then(res => {
        return res.data;
      }).catch(error => {
        // handle error
        console.error(error);
      });
  },
<<<<<<< HEAD
  async putCauses(id, data) {
    return await api.put(`catalogs/cause/${id}`, data)
      .then(res => {
        return res.data;
      }).catch(error => {
        // handle error
        console.error(error);
      });
  },
  async postCauses(data) {
    return await api.post(`catalogs/cause`, data)
      .then(res => {
        return res.data;
      }).catch(error => {
        // handle error
        console.error(error);
      });
  },
  async searchCauses(page, limit, textToMatch, sortBy, sort) {
    return await api.get(`catalogs/cause/search`,{
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
  //RELIGIONS
=======
>>>>>>> 0cdf0c39d93068ce691cb9c87d8d8dd0e9875eaf
  async getReligions() {
    return await api.get(`catalogs/religion`)
      .then(res => {
        return res.data;
      }).catch(error => {
        // handle error
        console.error(error);
      });
  },
<<<<<<< HEAD
  async putReligion(id, data) {
    return await api.put(`catalogs/religion/${id}`, data)
      .then(res => {
        return res.data;
      }).catch(error => {
        // handle error
        console.error(error);
      });
  },
  async postReligion( data) {
    return await api.post(`catalogs/religion`, data)
      .then(res => {
        return res.data;
      }).catch(error => {
        // handle error
        console.error(error);
      });
  },
  async searchReligions(page, limit, textToMatch, sortBy, sort) {
    return await api.get(`catalogs/religion/search`,{
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
  //CEMETARIES
=======
>>>>>>> 0cdf0c39d93068ce691cb9c87d8d8dd0e9875eaf
  async getCemetaries() {
    return await api.get(`catalogs/cemetary`)
      .then(res => {
        return res.data;
      }).catch(error => {
        // handle error
        console.error(error);
      });
  },
<<<<<<< HEAD
  async putCemetary(id, data) {
    return await api.put(`catalogs/cemetary/${id}`, data)
      .then(res => {
        return res.data;
      }).catch(error => {
        // handle error
        console.error(error);
      });
  },
  async postCemetary( data) {
    return await api.post(`catalogs/cemetary`, data)
=======
  async getOccupations() {
    return await api.get(`catalogs/occupation`)
>>>>>>> 0cdf0c39d93068ce691cb9c87d8d8dd0e9875eaf
      .then(res => {
        return res.data;
      }).catch(error => {
        // handle error
        console.error(error);
      });
  },
<<<<<<< HEAD
  async searchCemetaries(page, limit, textToMatch, sortBy, sort) {
    return await api.get(`catalogs/cemetary/search`,{
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
  //OCCUPATIONS
  async getOccupations() {
    return await api.get(`catalogs/occupation`)
=======
  async getMemberships() {
    return await api.get(`catalogs/membership`)
>>>>>>> 0cdf0c39d93068ce691cb9c87d8d8dd0e9875eaf
      .then(res => {
        return res.data;
      }).catch(error => {
        // handle error
        console.error(error);
      });
  },
<<<<<<< HEAD
  async putOccupation(id, data) {
    return await api.put(`catalogs/occupation/${id}`, data)
=======
  async getRelationships() {
    return await api.get(`catalogs/relationship`)
>>>>>>> 0cdf0c39d93068ce691cb9c87d8d8dd0e9875eaf
      .then(res => {
        return res.data;
      }).catch(error => {
        // handle error
        console.error(error);
      });
  },
<<<<<<< HEAD
  async postOccupation(data) {
    return await api.post(`catalogs/occupation`, data)
=======
  async getOriginalMedia() {
    return await api.get(`catalogs/originalmedia`)
>>>>>>> 0cdf0c39d93068ce691cb9c87d8d8dd0e9875eaf
      .then(res => {
        return res.data;
      }).catch(error => {
        // handle error
        console.error(error);
      });
  },
<<<<<<< HEAD
  async searchOccupations(page, limit, textToMatch, sortBy, sort) {
    return await api.get(`catalogs/occupation/search`,{
=======
  async getVesselTypes(page, limit, textToMatch, sortBy, sort) {
    return await api.get(`catalogs/vesseltype`,{
      crossdomain: true,
>>>>>>> 0cdf0c39d93068ce691cb9c87d8d8dd0e9875eaf
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
<<<<<<< HEAD
//MEMBERSHIPS
  async getMemberships() {
    return await api.get(`catalogs/membership`)
=======
  async postVesselType(data) {
    return await api.post(`catalogs/vesseltype`, data)
>>>>>>> 0cdf0c39d93068ce691cb9c87d8d8dd0e9875eaf
      .then(res => {
        return res.data;
      }).catch(error => {
        // handle error
        console.error(error);
      });
  },
<<<<<<< HEAD
  async putMembership(id, data) {
    return await api.put(`catalogs/membership/${id}`, data)
=======
  async postPlaceType(data) {
    return await api.post(`catalogs/placetype`, data)
>>>>>>> 0cdf0c39d93068ce691cb9c87d8d8dd0e9875eaf
      .then(res => {
        return res.data;
      }).catch(error => {
        // handle error
        console.error(error);
      });
  },
<<<<<<< HEAD
  async postMembership(data) {
    return await api.post(`catalogs/membership`, data)
=======
  async putVesselType(id, data) {
    return await api.put(`catalogs/vesseltype/${id}`, data)
>>>>>>> 0cdf0c39d93068ce691cb9c87d8d8dd0e9875eaf
      .then(res => {
        return res.data;
      }).catch(error => {
        // handle error
        console.error(error);
      });
  },
<<<<<<< HEAD
  async searchMemberships(page, limit, textToMatch, sortBy, sort) {
    return await api.get(`catalogs/membership/search`,{
=======
  async getPlaceTypes(page, limit, textToMatch, sortBy, sort) {
    return await api.get(`catalogs/placetype`, {
      crossdomain: true,
>>>>>>> 0cdf0c39d93068ce691cb9c87d8d8dd0e9875eaf
      params: {
        page,
        limit,
        textToMatch,
        sortBy,
        sort
      }
    })
<<<<<<< HEAD
    .then(res => {
      return res.data;
    }).catch(error => {
      // handle error
      console.error(error);
    });
  },
  //RELATIONSHIPS
  async getRelationships() {
    return await api.get(`catalogs/relationship`)
      .then(res => {
        return res.data;
      }).catch(error => {
        // handle error
        console.error(error);
      });
  },
  async putRelationship(id, data) {
    return await api.put(`catalogs/relationship/${id}`, data)
=======
>>>>>>> 0cdf0c39d93068ce691cb9c87d8d8dd0e9875eaf
      .then(res => {
        return res.data;
      }).catch(error => {
        // handle error
        console.error(error);
      });
  },
<<<<<<< HEAD
  async postRelationship(data) {
    return await api.post(`catalogs/relationship`, data)
=======

  async putPlaceType(id, data) {
    return await api.put(`catalogs/placetype/${id}`, data)
>>>>>>> 0cdf0c39d93068ce691cb9c87d8d8dd0e9875eaf
      .then(res => {
        return res.data;
      }).catch(error => {
        // handle error
        console.error(error);
      });
<<<<<<< HEAD
  },
  async searchRelationships(page, limit, textToMatch, sortBy, sort) {
    return await api.get(`catalogs/relationship/search`,{
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
=======
>>>>>>> 0cdf0c39d93068ce691cb9c87d8d8dd0e9875eaf
  }

} 
