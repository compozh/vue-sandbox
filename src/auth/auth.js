import axios from 'axios'
//import router from '@/router'

const currentUserKey = 'currentUser'

/**
 * Класс для работы с аутентификацией
 */
export default  class Authentication {

  static Init() {
    // Конфигурируем axios
    this._setUpAxios()
    this._setCurrentUserInfo()
  }

  /**
   * Логин
   * @param {string} login Логин
   * @param {string} password Пароль
   * @param {bool} rememberMe Запомнить меня
   */
  static async logIn(login, password, rememberMe) {

    try {
      // Логинемся
      let response = await axios.post(`http://localhost:5002/api/authentication/login`, {
        login: login,
        password: password,
        RememberMe: rememberMe
      }, {
        withCredentials: true
      })

      response = response.data

      var token = response.access_token
      // сохранение токена
      if (token) {
        this._setCurrentUser(response)

        await this._setCurrentUserInfo()
        return this.getCurrentUser()
      }
      // если токен не пришел
      throw new Error(`Ошибка входа. \r\b ${response}`)
    } catch (res) {
      throw new Error(`Ошибка входа. \r\n ${res}`)
    }
  }

  /**
   * Логин по QR коду
   * @param {string} id Логин
   */
  static async loginByQr(id) {
    try {

      let response = await axios.post(`http://localhost:5002/api/authentication/alternativelogin`, {code: id, type: 2}, {
        withCredentials: true
      })
      response = response.data
      var token = response.access_token
      // сохранение токена

      if (token) {
        this._setCurrentUser(response)
        this._setCurrentUserInfo()
        return this.getCurrentUser()
      }
      // если токен не пришел
      throw new Error(`Ошибка входа. \r\b ${response}`)
    } catch (res) {
      throw new Error(`Ошибка входа. \r\n ${res}`)
    }
  }

  /**
   * Выход - разлогиниться на веб сервере
   */
  static async logOff() {
    try {
      if (this.getCurrentUser()) {
        await axios.post(`http://localhost:5002/api/authentication/logout`, undefined, {
          withCredentials: true
        })
        this._resetCurrentUser()
      }
    } catch (res) {
      throw new Error(`Ошибка при попытке выйти из системы. \r\n ${res}`)
    }
  }

  /**
   * Использовать делегированные права
   */
  static async applyDelegatedRights(userId) {
    let result =  await  axios({
      method: 'POST',
      url: `http://localhost:5002/api/authentication/delegated`,
      withCredentials: true,
      data: userId
    })

    if (!result.data) {
      throw new Error('Ошибка смены делегированных прав!')
    }
    await this._setCurrentUser()
  }

  /**
   * Делегировать свои права
   */
  static async setDelegationRights({userId, dateFrom, dateTo}) {
    return axios({
      method: 'POST',
      url: `http://localhost:5002/api/authentication/delegation`,
      withCredentials: true,
      data: {userId, dateFrom, dateTo}
    })
  }

  /**
   * Получить токен для авторизации на веб сервере
   */
  static getAuthHeader() {
    if (!this.getCurrentUser()) {
      return
    }
    let token = this.getCurrentUser().access_token
    return {'Authorization': `Bearer ${token}`}
  }

  /**
   * Проверка что пользователь вошел в систему
   */
  static isAuthenticated() {
    return !!localStorage.getItem(currentUserKey)
  }

  /**
   * Получить текущего пользователя
   */
  static getCurrentUser() {
    try {
      return JSON.parse(localStorage.getItem(currentUserKey))
    } catch (error) {
      this._resetCurrentUser()
    }
  }

  static _setCurrentUser(val) {
    localStorage.setItem(currentUserKey, JSON.stringify(val))
    return val
  }

  static _resetCurrentUser() {
    localStorage.removeItem(currentUserKey)
  }

  static async _setCurrentUserInfo() {
    const user = this.getCurrentUser()
    if (!user) {
      return
    }
    user.UserData = await this._getCurrentUserInfo()
    this._setCurrentUser(user)
  }

  static async _getCurrentUserInfo() {
    try {
      const result = await axios
        .post(`http://localhost:5002/api/authentication/user`, undefined, {
          withCredentials: true
        })
      return result.data
    } catch (e) {
      if (e.response.status === 401) {
        this.logOff()
        router.push('/login')
      }
    }
  }

  /**
   * Добавляем в axios стандартный заголовок авторизации
   */
  static _setUpAxios() {
    axios.interceptors.request.use(
      (config) => {
        // Если нет текущего пользователя - ничего не делаем
        if (!this.getCurrentUser()) {
          return config
        }

        // Получаем токен и добавляем его в заголовки
        let token = this.getCurrentUser().access_token
        if (token) {
          config.headers['Authorization'] = `Bearer ${ token }`
        }
        return config
      },

      (error) => {
        return Promise.reject(error)
      }
    )
  }
}
