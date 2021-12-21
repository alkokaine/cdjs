export default {
  name: 'collection',
  props: {
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
      description: 'Прежде чем читать дальше, нужно смириться с тем, что почти всегда сервер от нас что-то ожидает, и это что-то должно передаваться в это свойство'
    },
    /**
      * keyfield: имя свойства с ключевым значением
      *
      */
    keyfield: { type: String, required: true, description: 'Прежде чем читать дальше, нужно смириться с тем, что у элементов в коллекции есть неповторяющееся свойство, его идентификатор, он передаётся сюда' },
    /**
     * объект или функция, возвращающая объект, содержащий
     * свойства строковые get, remove, add, update
     * как правило, ссылки получались постоянные, но чем чёрт не шутит,
     * пусть это будет функцией от параметров загрузки данных, см. watch.payload
     */
    crud: { type: [Object, Function], description: 'Пусть это будет объект с четырьма свойствами: get, update, delete, add { method: String, url: String }, для получения коллекции, добавления, удаления и редактирования объектов коллекци. В свойстве method будем указывать метод http запроса (post, get...) в свойстве url адрес метода ' },
    /**
     * функция, возвращающая новый объект коллекции
     * параметрами её будут payload и resolve
     */
    createnew: { type: Function, returns: Object, description: 'Функция, возвращающая объект, который будет добавлен в коллекцию' },
    /**
     * функция, выполняющаяся при редактировании элемента коллекции,
     * в том числе нового
     * обычно открывается диалог, в нём что-то делается, нажимается кнопка и уходит запрос
     */
    onedit: { type: Function },
    /**
     * строчка, которая будет написана на кнопке добавления новой строки
     */
    addnewheader: { type: String, default: 'Добавить новую строку', description: 'Строчка, что будет на кнопке добавления строки' },
    /**
     * нужна ли постраничная загрузка
     */
    paging: { type: Boolean, default: false, description: 'Нужна ли постраничная загрузка' },
    /**
     * свойство-признак того, что эта коллекция вложена в другую
     */
    inner: { type: Boolean, default: false, description: 'Признак того, что коллекция вложенная' }
  },
  watch: {
    /**
     * собственно, реактивность
     * изменение свойств параметров загрузки данных (фильтра)
     * обработается функцией handler
     */
    payload: {
      deep: true,
      immediate: true,
      /**
       *
       * @param {Object} newvalue новое значение объекта payload
       */
      handler (newvalue) {
        const local = this

        if ((newvalue && typeof newvalue !== 'function') && (local.$http)) {
          local.loaddata(newvalue)
        }
      }
    }
  },
  computed: {
    urls () {
      if (typeof this.crud === 'function') return this.crud(this.payload)
      return this.crud
    },
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
    loaddata (payload) {
      const local = this
      const localcrud = local.urls
      if (localcrud && localcrud.get) {
        const request = Object.prototype.hasOwnProperty.call(localcrud.get, 'method')
          ? { url: localcrud.get.url, exec: local.$http[localcrud.get.method] }
          : { url: localcrud.get, exec: local.$http.post }
        try {
          request.exec(request.url, local.resolvepayload(payload))
            .then((response) => {
              local.resolveresult(response)
              local.error = false
            }).catch((reason) => {
              local.error = reason
            })
        } catch (error) {
          // local.list = local.collection
          // по-хорошему, такой ситуации быть не может
          // либо к нам приходит коллекция, либо мы получаем её
          local.error = false
        }
      }
    },
    delete (row) {
      console.log('Deleting ', this.urls.remove, row)
    },
    update (row) {
      console.log('Updating ', this.urls.update, row)
    },
    callcreate () {
      const local = this
      const create = new Promise((resolve) => {
        local.createnew(local.payload, resolve)
      }).then((newvalue) => {
        local.onedit(newvalue, (payload) => {
          local.$http(local.urls.add, payload)
            .then((response) => {
              if (Object.prototype.hasOwnProperty.call(response, 'success')) {
                if (response.success) {
                  local.collection.push(response.data)
                } else if (Object.prototype.hasOwnProperty.call(response, 'message')) {
                  console.error(response.message)
                } else {
                  console.error('something goes wrong')
                }
              } else {
                console.info(response)
              }
            })
            .catch((reason) => {
              console.error(reason)
            })
        })
      })
      return create
    }
  }
}
