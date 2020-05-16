import { restUtils } from '../utils/index';

// Constants
import config from '../configs';
import { ssStorage } from '../utils/sessionStorage';

const BASE_URL = config.BASE_URL;

function getHeaders() {
  return {
    'Content-Type': 'application/json',
    Authorization: 'Bearer ' + ssStorage.get('access_token'),
  };
}

function parseParams(params = {}) {
  const paramArray = [];

  for (let i in params) {
    paramArray.push(`${i}=${params[i]}`);
  }

  return paramArray.join('&');
}

export const httpRequest = {
  /**
   * Fetch video search results from the Youtube API
   * @param uri
   * @param params
   * @returns {Promise.<TResult>}
   */

  post: (uri, params = {}) => {
    const options = {
      headers: getHeaders(),
      method: 'POST',
      body: JSON.stringify(params),
    };

    return fetch(`${BASE_URL}${uri}`, options)
      .then(restUtils.handleRestResponse)
      .then((response) => response);
  },

  /**
   * Fetch video search results from the Youtube API
   * @param uri
   * @param params
   * @returns {Promise.<TResult>}
   */

  put: (uri, params) => {
    const options = {
      headers: getHeaders(),
      method: 'PUT',
      body: JSON.stringify(params),
    };

    return fetch(`${BASE_URL}${uri}`, options)
      .then(restUtils.handleRestResponse)
      .then((response) => response);
  },

  /**
   * Fetch video search results from the Youtube API
   * @param uri
   * @param params
   * @returns {Promise.<TResult>}
   */

  get: (uri, params = {}) => {
    const options = {
      headers: getHeaders(),
      method: 'GET',
    };

    delete options.headers['Content-Type'];

    return fetch(`${BASE_URL}${uri}?${parseParams(params)}`, options)
      .then(restUtils.handleRestResponse)
      .then((response) => response);
  },

  /**
   * Fetch video search results from the Youtube API
   * @param uri
   * @param params
   * @returns {Promise.<TResult>}
   */

  delete: (uri) => {
    const options = {
      headers: getHeaders(),
      method: 'DELETE',
    };

    delete options.headers['Content-Type'];

    return fetch(`${BASE_URL}${uri}`, options)
      .then(restUtils.handleRestResponse)
      .then((response) => response);
  },
};
