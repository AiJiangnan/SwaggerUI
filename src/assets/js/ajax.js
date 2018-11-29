import axios from 'axios';
import qs from 'qs';

/**
 * axios请求工具
 *
 * @returns {Ajax}
 * @constructor
 */
function Ajax() {
  this.getData = function (data, type) {
    if (type === 'getData') {
      var gData = '';
      for (const i in data) {
        gData += i + '=' + data[i] + '&';
      }
      gData = gData.substring(0, gData.length - 1);
      return gData;
    } else {
      throw new Error('The method is private,you connot use it!')
    }
  };
  return this;
}

/**
 * POST请求
 *
 * @param url
 * @param data
 * @param callBack
 * @param failer
 */
Ajax.prototype.post = function (url, data, callBack, failer) {
  if (typeof arguments[1] === 'object') {
    data = arguments[1];
  } else if (typeof arguments[1] === 'function') {
    data = {};
    callBack = arguments[1];
  }
  url = url || '';
  data = data || {};
  axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
  axios.post(url, qs.stringify(data))
      .then(function (response) {
        if (response.status === 200) {
          callBack(response.data);
        } else {
          failer && failer(response);
        }
      })
      .catch(function (error) {
        console.error(error);
      });
};

/**
 * GET请求
 *
 * @param url
 * @param data
 * @param callBack
 * @param failer
 */
Ajax.prototype.get = function (url, data, callBack, failer) {
  if (typeof arguments[1] === 'object') {
    data = arguments[1];
  } else if (typeof arguments[1] === 'function') {
    data = {};
    callBack = arguments[1];
  }
  url = url || '';
  data = data || {};
  data = this.getData(data, 'getData');
  url += data ? ('?' + data) : '';
  axios.get(url, data)
      .then(function (response) {
        if (response.status === 200) {
          callBack(response.data);
        } else {
          failer && failer(response)
        }
      })
      .catch(function (error) {
        console.error(error);
      });
};

const ajax = new Ajax();
export default ajax;