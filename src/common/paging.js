export default {
  name: 'paging',
  props: {
    paging: { type: Boolean, default: false, description: 'Использовать ли постраничную загрузку данных' },
    pageSize: {
      type: Number,
      description: 'Размер "страницы"',
      validator: (value) => {
        if (+(value) > 0) return true
        console.error('[CDJS] PageSize set as 0. Are you sure?')
        return false
      }
    },
    page: { type: Number, description: 'Текущая страница' },
    total: { type: Number, description: 'Всего записей' },
    payload: { type: Object },
    get: { type: Object },
    resolveurl: { type: Function, default: (url) => (url) },
    pagesvisible: { type: Number, default: 5, description: 'Диапазон страниц, видимый без разрывов в компоненте постраничной загрузки' },
    resolvepageparams: { type: Function, default: (page, pageSize) => ({ Page: page, PageSize: pageSize }) }
  },
  watch: {
    // page: {
    //   handler (newvalue) {
    //     const paging = this
    //     const payload = Object.assign({}, paging.payload, paging.resolvepageparams(newvalue, paging.pageSize))
    //     const url = paging.resolveurl(paging.get.url, newvalue, paging.pageSize)
    //     paging.loaddata(url, payload)
    //   }
    // }
  }
}
