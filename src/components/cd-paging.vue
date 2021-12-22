<template>
  <cd-list class="cd-pagination--container" listclass="cd-pagination pagination" rowclass="page-item" keyfield="pageNum" :collection="pages" :listitemclicked="onpagechange">
    <div slot-scope="scope">
      <span class="page-link" :class="{ 'active': scope.row.pageNum == page}">{{ scope.row.caption }}</span>
    </div>
  </cd-list>
</template>

<script>
import CDList from './cd-list.vue'
import utils from '../common/utils'
export default {
  components: {
    'cd-list': CDList
  },
  props: {
    /**
     * что произойдёт по смене страницы
     */
    onpagechange: { type: Function, required: true, description: 'Функция, которая выполнится при смене страницы' },
    /**
     * всего строк, обычно приходит с ответом
     */
    total: { type: Number, required: true, description: 'Всего элементов в коллекции' },
    /**
     * текущая страница
     */
    page: { type: Number, required: true, description: 'Текущая страница' },
    /**
     * размер страницы
     */
    pageSize: { type: Number, required: true, description: 'Размер страницы в элементах' },
    /**
     * диапазон страниц, показываемых по порядку
     */
    viewRange: { type: Number, default: 5, description: 'Диапазон страниц, показываемых без разрыва' }
  },
  data (paging) {
    return {
      // nextPages: { caption: '...', pageNum: paging.page + paging.viewRange, offset: paging.viewRange * paging.pageSize }
    }
  },
  computed: {
    pagesCount () {
      return Math.ceil(this.total / this.pageSize)
    },
    pages () {
      const paging = this
      return paging.resolvepages(paging.page).map(m => Number.isInteger(m) ? { caption: m, pageNum: m, offset: paging.pageSize * (m - 1) } : m)
    },
    nextPages () {
      const paging = this
      return {
        caption: '...',
        pageNum: paging.page + paging.viewRange + 1,
        offset: (paging.page + paging.viewRange) * paging.pageSize
      }
    },
    prevPages () {
      const paging = this
      return {
        caption: '...',
        pageNum: paging.page - paging.viewRange - 1,
        offset: (paging.page - paging.viewRange) * paging.pageSize
      }
    }
  },
  methods: {
    resolvepages (currentpage) {
      const paging = this
      if (paging.pagesCount <= paging.viewRange) return Array.from(Array(paging.pagesCount).keys()).map(m => m + 1)
      if (currentpage < paging.viewRange) return utils.range(1, paging.viewRange, 1).concat([paging.nextPages, paging.pagesCount])
      if (currentpage > (paging.pagesCount - paging.viewRange)) return [1, paging.prevPages].concat(utils.range(paging.pagesCount - paging.viewRange, paging.pagesCount, 1))
      return [1, paging.prevPages].concat(utils.range(currentpage - 2, currentpage + 2, 1)).concat([paging.nextPages, paging.pagesCount])
    }
  }
}
</script>

<style>
  @import '~bootstrap/dist/css/bootstrap.css';

  ul.cd-pagination {
    list-style-type: none;
    display: inline-block;
    padding-inline-start: unset;
  }
  .cd-pagination--container {
    text-align: center;
  }
  .page-item {
    float: left;
    cursor: pointer;
  }
  .page-link.active {
    background-color: #0d6efd;
    color: white;
    border: 1px solid #0d6efd;
}
</style>>
