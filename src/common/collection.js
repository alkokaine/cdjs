export default {
  props: {
    /**
     * функция, которая из ответа сервера вернёт непосредственно коллекцию
     */
    resolvedata: {
      type: Function,
      default: function (response) {
        return response.data
      }
    },
    /**
     * собственно, коллекция
     */
    collection: { type: Array, default: () => ([]) },
    /**
    * payload: объект, по которому клиенту возвращается набор записей
    */
    payload: { type: Object },
    /**
      * keyfield: имя свойства с ключевым значением
      *
      */
    keyfield: { type: String, required: true },
    /**
     * объект или функция, возвращающая объект, содержащий
     * свойства строковые get, remove, add, update
     * как правило, ссылки получались постоянные, но чем чёрт не шутит,
     * пусть это будет функцией от параметров загрузки данных, см. watch.payload
     */
    crud: { type: [Object, Function] },
    /**
     * функция, возвращающая новый объект коллекции
     * параметрами её будут payload и resolve
     */
    createnew: { type: Function },
    /**
     * функция, выполняющаяся при редактировании элемента коллекции,
     * в том числе нового
     * обычно открывается диалог, в нём что-то делается, нажимается кнопка и уходит запрос
     */
    onedit: { type: Function },
    /**
     * строчка, которая будет написана на кнопке добавления новой строки
     */
    addnewheader: { type: String, default: 'Добавить новую строку' },
    /**
     * нужна ли постраничная загрузка
     */
    paging: { type: Boolean, default: false },
    /**
     * свойство-признак того, что эта коллекция вложена в другую
     */
    inner: { type: Boolean, default: false }
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
    },
    hasdata () {
      return this.list.length
    }
  },
  data (col) {
    return {
      list: col.collection,
      error: Object
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
        request.exec(request.url, { params: payload })
          .then((response) => {
            local.list = local.resolvedata(response)
            local.error = false
          }).catch((reason) => {
            local.error = reason
          })
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
                  local.list.push(response.data)
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
