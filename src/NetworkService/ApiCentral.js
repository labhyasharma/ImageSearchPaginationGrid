import axios from 'axios';
import {BASE_URL} from '../utils/ApiConstants';

/**
 * Request Wrapper with default success/error actions
 * @author Labhya Sharma
 */

const request = async function(options) {
  const client = axios.create({
    baseURL: BASE_URL,
  });

  client.interceptors.request.use(request => {
    console.log('Starting Request', request);
    return request;
  });

  client.interceptors.response.use(response => {
    console.log('Response:', response);
    return response;
  });

  const onSuccess = function(response) {
    console.log('response message', response);
    return response;
  };

  const onError = function(error) {
    console.log('error message', error.message);
    console.log('error response', error.response);

    return Promise.reject(error.response || error.message);
  };

  return client(options)
    .then(onSuccess)
    .catch(onError);
};

export default request;
