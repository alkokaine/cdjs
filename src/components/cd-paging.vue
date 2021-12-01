<template>
  <cd-list class="cd-pagination--container" listclass="cd-pagination pagination" rowclass="page-item" keyfield="pageNum" :collection="pages" :listitemclicked="onpagechange">
    <div slot-scope="scope">
      <a class="page-link" :class="{ 'active': scope.row.pageNum == page}" href="#">{{ scope.row.pageNum }}</a>
    </div>
  </cd-list>
</template>

<script>
import CDList from './cd-list.vue'

export default {
  components: {
    'cd-list': CDList
  },
  props: {
    /**
     * что произойдёт по смене страницы
     */
    onpagechange: { type: Function, required: true },
    /**
     * всего строк, обычно приходит с ответом
     */
    total: { type: Number, required: true },
    /**
     * текущая страница
     */
    page: { type: Number, required: true },
    /**
     * размер страницы
     */
    pageSize: { type: Number, required: true }
  },
  data (paging) {
    return {
    }
  },
  computed: {
    pagesCount () {
      return this.pages.length
    },
    pages () {
      const paging = this
      const pagesCount = Math.ceil(paging.total / paging.pageSize)
      const range = Array.from(Array(pagesCount).keys())
      const half = Math.floor(pagesCount / 2)
      const pagearray = range.map((page, index) => {
        if (index <= 3 || index === half || index >= (range.length - 3)) {
          return { pageNum: (page + 1), offset: this.pageSize * page }
        }
        return false
      }).filter(m => m !== false)
      return pagearray
    }
  }
}
</script>

<style>
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
  }
</style>>
