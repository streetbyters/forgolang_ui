import Vue from 'vue'
import axios from 'axios'
import { Cookies } from 'quasar'

class Request {
  constructor (params = false) {
    const self = this
    self.version = 'v1'
    self.apiUrl = (process.env.NODE_ENV === 'production') ? `https://api.forgolang.com/${self.version}` : `http://localhost:3001/api/${self.version}`
    self.tokenUri = '/auth/token'
    self.cdnUrl = 'https://d2j8igqof11zz3.cloudfront.net'
    self.response = null
    self.retrieve = false
    self.token = null
    self.storage = params.cookies
    self.timeInformation = {}
    self.cookieOpts = {
      path: '/',
      domain: (process.env.NODE_ENV === 'production' ? 'forgolang.com' : 'localhost')
    }
    if (params) {
      self.app = params.app
      self.params = params
      self.store = params.store
      self.cookies = params.cookies
    }
    if (typeof self.cookies.get('token') === 'undefined' || self.cookies.get('token') === null) {
      self.req = axios.create({
        baseUrl: self.apiUrl,
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json'
        },
        responseType: 'json',
        xsrfCookieName: null,
        xsrfHeaderName: null
      })
      self.heartbeat()
    } else {
      self.token = self.cookies.get('token')
      self.req = axios.create({
        baseUrl: self.apiUrl,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${self.token}`,
          Accept: 'application/json'
        },
        responseType: 'json',
        xsrfCookieName: null,
        xsrfHeaderName: null
      })
      self.heartbeat()
    }
    self.req.interceptors.response.use(response => response, (error) => {
      if (error.response) {
        const originalRequest = error.config
        if (self.cookies.has('passphrase') && self.cookies.has('token') && !originalRequest._retry) {
          if (error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true
            self.retrieve = true
            const tokenRequest = axios.create({
              headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json'
              },
              responseType: 'json',
              xsrfCookieName: null,
              xsrfHeaderName: null
            })

            return tokenRequest.post(self.apiUrl + self.tokenUri, {
              passphrase: atob(self.cookies.get('passphrase'))
            }).then((response) => {
              const token = response.data.data.jwt
              self.token = token
              self.setCookie('token', token)
              axios.defaults.headers.common.Authorization = `Bearer ${token}`
              originalRequest.headers.Authorization = `Bearer ${token}`
              self.genAuthReq()
              self.retrieve = false
              return axios(originalRequest)
            }).catch((error) => {
              if (error.response.status === 404 && !originalRequest._retry) {
                self.cookies.remove('userId')
                self.cookies.remove('type')
                self.cookies.remove('passphraseId')
                self.cookies.remove('passphrase')
                self.cookies.remove('token')
                self.app.router.push('/')
                return Promise.reject(error)
              }
            })
          } else {
            return Promise.reject(error)
          }
        } else {
          self.retrieve = false
          return Promise.reject({ error: error, response: error.response })
        }
      } else if (error.message === 'Network Error') {
        return Promise.reject(error)
      }
      self.retrieve = false
      return Promise.reject(error)
    })
  }
  get (uri) {
    return this.req.get(this.apiUrl + uri)
  }
  post (uri, data, isFile = false) {
    if (isFile) {
      this.req.headers = {
        'Content-Type': 'multipart/form-data'
      }
    }
    return this.req.post(this.apiUrl + uri, data)
  }
  put (uri, data) {
    return this.req.put(this.apiUrl + uri, data)
  }
  patch (uri, data) {
    return this.req.patch(this.apiUrl + uri, data)
  }
  delete (uri, data = false) {
    if (!data) {
      return this.req.delete(this.apiUrl + uri)
    }
    return this.req.delete(this.apiUrl + uri, data)
  }
  genAuthReq (cb = false) {
    const self = this
    self.token = self.cookies.get('token')
    self.req = axios.create({
      baseUrl: self.apiUrl,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${self.token}`,
        Accept: 'application/json'
      },
      responseType: 'json',
      xsrfCookieName: null,
      xsrfHeaderName: null
    })

    if (cb) {
      cb()
    }

    return self
  }
  genNewToken () {
    const self = this
    const tokenRequest = axios.create({
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      responseType: 'json',
      xsrfCookieName: null,
      xsrfHeaderName: null
    })

    return tokenRequest.post(self.apiUrl + self.tokenUri, {
      passphrase: self.storage.get('passphrase')
    }).then((response) => {
      self.token = response.data.data.jwt
      self.genAuthReq()
    }).catch((e) => {
      location.reload()
    })
  }
  async heartbeat () {
    this.get('/heartbeat').then(r => {
      this.timeInformation = r.data.time_information
    })
  }
  generateRoute (uri) {
    return `${this.apiUrl}/${uri}`
  }
  errorHandler (err, cb = false) {
    if (err.response.status === 422) {
      if (cb) {
        return cb()
      } else {
        return {
          error: err,
          errors: err.response.data.errors
        }
      }
    } else {
      return err
    }
  }
  sleep (milliseconds) {
    let start = new Date().getTime()
    for (let i = 0; i < 1e7; i++) {
      if ((new Date().getTime() - start) > milliseconds) {
        break
      }
    }
  }
  setCookie (key, value) {
    if (this.cookies.has(key)) {
      this.cookies.remove(key, this.cookieOpts)
      this.cookies.set(key, value, this.cookieOpts)
    } else {
      this.cookies.set(key, value, this.cookieOpts)
    }
  }
  getCookie (key) {
    return this.cookies.get(key)
  }
  removeCookie (key) {
    this.cookies.remove(key, this.cookieOpts)
  }
}

export default ({ app, ssrContext, store }) => {
  const cookies = process.env.SERVER
    ? Cookies.parseSSR(ssrContext)
    : Cookies

  const request = new Request({
    app: app,
    cookies: cookies,
    store: store
  })
  app.$axios = request
  Vue.prototype.$axios = request
}
