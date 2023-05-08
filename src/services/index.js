import {defaultHeaders, status, json} from '../utils/fetch';
import {API_URLs} from '../consts';

export const Load = query => {
  let url = query ? `${API_URLs.dev}/${query}` : `${API_URLs.dev}`;

  const options = {
    headers: defaultHeaders(),
  };

  return fetch(url, options)
    .then(status)
    .then(json)
    .then(response => {
      return response;
    })
    .catch(error => {
      return error;
    });
};
