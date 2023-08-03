import axios from 'axios'
export default {
  name: 'collection',
  props: {
    /**
     * без неё никуда
     * но шутка в том, что объект параметры-запроса может отличаться для разных
     * запросов
     * да и resolveresult в общем-то тоже
     */
    resolvepayload: {
      type: Function,
      returns: Object,
      description: 'Возвращает изменённый объект payload, подходящий для отправки с запросом. По умолчанию возвращается неизменённый объект'
    },
    /**
     * функция, которая из ответа сервера вернёт непосредственно коллекцию
     */
    resolveresult: {
      type: Function,
      returns: Array,
      description: 'возвращает ту часть ответа сервера, которую мы собирались поместить в коллекцию'
    },
    /**
     * собственно, коллекция
     */
    collection: {
      type: Array,
      default: () => ([]),
      description: 'непосредственно коллекция, массив объектов'
    },
    payload: {
      type: Object,
      description: 'на случай, если что-то надо передать вместе с запросом'
    },
    /**
      * keyfield: имя свойства с ключевым значением
      *
      */
    keyfield: { type: String, required: true, description: 'нужно смириться с тем, что у элементов в коллекции есть неповторяющееся свойство, его идентификатор, он передаётся сюда' },
    /**
     * объект или функция, возвращающая объект, содержащий
     * свойства строковые get, remove, add, update
     * как правило, ссылки получались постоянные, но чем чёрт не шутит,
     * пусть это будет функцией от параметров загрузки данных, см. watch.payload
     */
    get: { type: Object, description: 'Объект, содержащий урл, наименование хттп-метода, и возможно заголовки запроса' },
    headers: { type: Object, description: 'Заголовки запроса' },
    beforeRequest: { type: Function, description: 'Функция выполнится перед отправкой запроса' },
    errorRequest: { type: Function, description: 'Функция выполнится при ошибке' },
    /**
     * строка или функция, возвращающая css-класс для строки коллекции
     */
    rowclass: { type: [String, Array, Function], default: '', description: 'Строка или функция, возвращающая строку с классом для элемента списка, ' }
  },
  data () {
    return {
      state: {
        isLoading: false,
        error: false
      }
    }
  },
  computed: {
    $axios ({ errorRequest, beforeRequest, resolveresult }) {
      const state = this.state
      const axiosInstance = axios.create()
      axiosInstance.interceptors.request.use(config => {
        state.isLoading = true
        if (beforeRequest !== undefined) {
          const returned = beforeRequest(config)
          return returned === undefined ? config : returned
        } else {
          return config
        }
      }, error => {
        if (errorRequest !== undefined) errorRequest(() => Promise.reject(error))
        setTimeout(() => { state.isLoading = false }, 100)
        return error
      })
      axiosInstance.interceptors.response.use(response => {
        setTimeout(() => {
          state.isLoading = false
        }, 100)
        return response
      }, error => {
        setTimeout(() => {
          state.isloading = false
          state.error = error
        }, 100)
      })
      return (params) => {
        if (params.url === undefined) return Promise.resolve()
        return axiosInstance(params).then(response => resolveresult(response)).catch(error => errorRequest(error))
      }
    },
    error ({ state }) {
      return state.error
    },
    payloadResolved ({ payload, resolvepayload }) {
      return resolvepayload === undefined ? payload : resolvepayload(payload)
    },
    rowkey ({ keyfield }) {
      return (row) => row[keyfield]
    },
    rowClassResolved ({ rowclass }) {
      return (row) => {
        if (typeof rowclass === 'function') return rowclass(row)
        return rowclass
      }
    },
    url ({ get }) {
      return (get || {}).url
    },
    method ({ get }) {
      return (get || {}).method
    },
    dataRetriever ({ axiosConfig, $axios }) {
      return $axios(axiosConfig)
    },
    axiosConfig ({ method, url, payloadResolved, headers }) {
      return {
        method: method,
        url: url,
        params: payloadResolved,
        headers: headers
      }
    },
    isloading ({ state }) {
      return state.isLoading
    }
  },
  watch: {
    dataRetriever: {
      handler (newvalue) {
        return newvalue.then(() => console.log('data loaded')).catch(error => console.error(error))
      }
    }
  },
  methods: {
    loaddata (url, payload) {
      const local = this
      const onbefore = function (config) {
        if (local.beforeRequest !== undefined) return local.beforeRequest(config)
        local.isloading = true
        return config
      }
      const onerror = function (error) {
        if (local.errorRequest !== undefined) local.errorRequest(() => Promise.reject(error))
        setTimeout(() => { local.isloading = false }, 100)
        return error
      }
      const onafter = function (response) {
        setTimeout(() => { local.isloading = false }, 100)
        return response
      }
      const axios = local.$http.create()
      axios.interceptors.request.use(onbefore, onerror)
      axios.interceptors.response.use(onafter, onerror)
      axios({
        method: local.get.method,
        url: url,
        params: local.resolvepayload(payload),
        headers: local.headers
      }).then((response) => {
        local.resolveresult(response)
        local.error = false
      }).catch((reason) => {
        local.error = reason
      })
    }
  }
}
