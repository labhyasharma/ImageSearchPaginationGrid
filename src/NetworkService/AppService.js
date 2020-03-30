/**
 * Central Repository to list all the APIs
 *
 * @author Labhya Sharma
 */

import {API_KEY} from '../utils/ApiConstants';
import request from '../NetworkService/ApiCentral';

function searchImage(searchKey, page) {
  return request({
    url: '/?key=' + API_KEY + '&q=' + searchKey + '&page=' + page + '&per_page=20',
    method: 'GET',
  });
}

const AppService = {
  searchImage,
};

export default AppService;
