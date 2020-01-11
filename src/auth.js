import * as Fingerprint2 from 'fingerprintjs2'
import jwtDecode from "jwt-decode"
import axios from 'axios'

export default class Authentication {

  static async login (login, password, rememberMe) {
    const fingerprint = await this._getFingerprint()
    console.log('', fingerprint)
    try {
      const response = await axios.post(`http://localhost:5000/api/Account/Login`, {
        login, password, rememberMe, fingerprint
      })
      const token = response.data.accessToken
      if (token) {
        console.log(token)
      } else {
        console.error('No token received')
      }
    } catch (e) {
      throw new Error('Login error', e.message)
    }
  }

  static async getAccessToken() {

  }

  static parseJwt(token) {
    const decoded = jwtDecode(token)
    console.log(decoded)
  }

  static validateAccessToken(exp) {
    return Date.now() < exp * 1000
  }

  static _getFingerprint() {
    return new Promise((resolve, reject) => {
      async function getHash() {
        try {
          const components = await Fingerprint2.getPromise()
          const values = components.map(component => component.value)
          console.log('fingerprint hash components', components)

          return String(Fingerprint2.x64hash128(values.join(''), 31))
        } catch (e) {
          reject(e)
        }
      }

      if (window.requestIdleCallback) {
        console.log('requestIdleCallback')
        requestIdleCallback(async () => resolve(await getHash()))
      } else {
        console.log('setTimeout')
        setTimeout(async () => resolve(await getHash()), 500)
      }
    })
  }
}

// TESTING

const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6ItCf0ZTQstGH0LXQsiDQhtCz0L7RgCDQkNC90LDRgtC-0LvRl9C-0LLQuNGHIiwiaWF0IjoxNTE2MjM5MDIyfQ.0SHU6vCunRSnAfnG0QcSTR9A4aaxkO-pGhy9N3E97eo'

Authentication.parseJwt(token)
Authentication.login(1,2,3).then(result => result)
