import { api } from './config';

export default {
  async get(page, limit, textToMatch, sortBy, sort) {
    return await api.get(`photo-owners`, {
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
}
