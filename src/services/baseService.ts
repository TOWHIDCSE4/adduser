import getConfig from 'next/config'
import UrlPattern from 'url-pattern';
import moment from 'moment-timezone';
const { publicRuntimeConfig } = getConfig()

import auth, { AuthInterface } from '@src/helpers/auth'
class BaseService {
  auth: AuthInterface
  withAuth = (context?: any) => {
    this.auth = auth(context)
    return this
  }

  makeQuery(data = {}) {
    let query = [];
    for (let key in data) {
      if (Array.isArray(data[key])) {
        for (let value of data[key]) {
          if (typeof value == "object") value = JSON.stringify(value)
          query.push({ key: `${key}[]`, value: value })
        }
      }
      else if (typeof data[key] == "object") {
        query.push({ key: key, value: JSON.stringify(data[key]) })
      }
      else {
        query.push({ key: key, value: data[key] })
      }
    }
    return query.map(q => `${q.key}=${q.value}`).join("&")
  }

  buildFormData(formData, data, parentKey?: any) {
    if (data && typeof data === 'object' && !(data instanceof Date) && !(data instanceof File)) {
      Object.keys(data).forEach(key => {
        this.buildFormData(formData, data[key], parentKey ? `${parentKey}[${key}]` : key);
      });
    } else {
      const value = data == null ? '' : data;

      formData.append(parentKey, value);
    }
  }

  beforeRequest({ url, data, options = {} }: { url: string, data: any, options: any }) {
    if (options.allowUpload) {
      const formData = new FormData()
      this.buildFormData(formData, data)
      data = formData
      options = {
        ...options,
        headers: {
          //  'Content-Type': 'multipart/form-data'
        }
      }
    }
    return {
      url, data, options
    }
  }

  request = async ({ url, method, data, options }: { url: string, method: "GET" | "POST" | "PUT" | "DELETE", data?: any, options?: any }) => {
    if (["GET", "POST", "PUT", "DELETE"].includes(method)) {
      let pattern = new UrlPattern(url);
      let asUrl = pattern.stringify(data)
      url = asUrl
    }

    options = {
      headers: {
        'Content-Type': 'application/json',
      },
      ...options,
    }

    let newOption = this.beforeRequest({ url, data, options })

    url = newOption.url;

    if (["GET", "DELETE"].includes(method)) {
      url += "?" + this.makeQuery(data)
    }
    else {
      data = !options.allowUpload ? JSON.stringify(newOption.data) : newOption.data;

      options = {
        ...newOption.options,
        body: data
      }
    }
    let requestOptions = {
      method: method,
      ...options
    };

    if (this.auth && this.auth.token) {
      requestOptions.headers['Authorization'] = `Bearer ${this.auth.token}`;
      requestOptions.headers['TimeZone'] = moment.tz.guess();
    }
    const result = await fetch(publicRuntimeConfig.API_HOST + url, requestOptions)
    return await this.handleResponse(result)
  }

  handleResponse = async (response) => {
    const text = await response.text();
    let data: any = {}
    try {
      data = text && JSON.parse(text);
    }
    catch (e) {
      console.log(e)
    }

    if (!response.ok) {
      if ([401].indexOf(response.status) !== -1) {
        // auto logout if 401 Unauthorized or 403 Forbidden response returned from api
        auth().logout();
        location.href = "/admin/login"
      }
      const error = data || (data && data.message) || response.statusText;
      return Promise.reject(error);
    }

    return data.data || data
  }
}

export default BaseService
