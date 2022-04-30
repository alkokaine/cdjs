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
      description: 'Возвращает изменённый объект payload, подходящий для отправки с запросом. По умолчанию возвращается неизменённый объект',
      default: (payload) => (payload)
    },
    /**
     * функция, которая из ответа сервера вернёт непосредственно коллекцию
     */
    resolveresult: {
      type: Function,
      returns: Array,
      description: 'возвращает ту часть ответа сервера, которую мы собирались поместить в коллекцию'
    },
    onerror: {
      type: Function
    },
    /**
     * собственно, коллекция
     */
    collection: {
      type: Array,
      default: () => ([]),
      description: 'непосредственно коллекция, массив объектов'
    },
    /**
    * payload: объект, по которому клиенту возвращается набор записей
    */
    payload: {
      type: Object,
      description: 'нужно смириться с тем, что почти всегда сервер от нас что-то ожидает, и это что-то должно передаваться в это свойство'
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
    // crud: { type: [Object, Function], description: '!!!!! кандидат на пересмотр !!!!! Пусть это будет объект с четырьма свойствами: get, update, delete, add { method: String, url: String }, для получения коллекции, добавления, удаления и редактирования объектов коллекци. В свойстве method будем указывать метод http запроса (post, get...) в свойстве url адрес метода ' },
    get: { type: Object, description: 'Объект, содержащий урл, наименование хттп-метода, и возможно заголовки запроса' },
    /**
     * нужна ли постраничная загрузка
     */
    paging: { type: Boolean, default: false, description: 'Нужна ли постраничная загрузка' }
  },
  watch: {
    /**
     * собственно, реактивность
     * изменение свойств параметров загрузки данных (фильтра)
     * обработается функцией handler
     */
    payload: {
      deep: true,
      /**
       *
       * @param {Object} newvalue новое значение объекта payload
       */
      handler (newvalue) {
        const local = this

        if ((newvalue && typeof newvalue !== 'function') && (local.$http) && (local.get && local.get.url !== '')) {
          local.loaddata(local.get.url, newvalue)
        }
      }
    }
  },
  computed: {
    rowkey () {
      const local = this
      return (row) => row[local.keyfield]
    }
  },
  data (col) {
    return {
      error: false
    }
  },
  methods: {
    loaddata (url, payload) {
      const local = this
      local.$http({ method: local.get.method, url: url, data: local.resolvepayload(payload), headers: local.get.headers })
        .then((response) => {
          local.resolveresult(response)
          local.error = false
        })
        .catch((reason) => {
          local.error = reason
          if (local.onerror !== undefined && typeof local.onerror === 'function') local.onerror(reason)
        })
    }
  }
}
