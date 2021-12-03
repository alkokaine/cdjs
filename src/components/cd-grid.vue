<template>
  <div class="cd-grid">
    <div class="grid-tuner">
      <slot name="grid-tuner">
        <cd-filter v-if="usefilter" :payload="payload" :descriptor="filter"></cd-filter>
      </slot>
    </div>
    <div class="cd-grid-buttons--row">
      <button class="cd-grid--createnew" v-on:click="callcreate">
        <span>
          {{ addnewheader }}
        </span>
      </button>
      <slot name="cd-grid-buttons"></slot>
    </div>
    <div class="cd-grid--content">
      <template v-if="hasdata">
        <table class="table cd-grid--table">
          <caption>
            <slot name="table-caption"></slot>
          </caption>
          <thead v-if="!hideheader" class="cd-grid--header">
            <tr v-for="(row, index) in header" :key="index" class="cd-grid--header-row">
              <!-- если можно выбирать строки нарисуем колонку с чекбоксом -->
              <!-- который показывается если index === 0, а rowspan берётся как кол-во строк в header -->
              <th v-if="selectrows && index === 0"
                class="cd-grid--header-cell cd-checkbox--cell"
                :rowspan="header.length">
                <!-- checked когда всё выбрано, по change выполняем onselectchange -->
                <input class="cd-checkbox"
                  type="checkbox"
                  @change="onrowselect($event)"
                  :checked="allselected"
                />
              </th>
              <!-- теперь заголовки столбцов -->
              <!-- проходим в цикле по cols -->
              <!-- ставим colspan и rowspan из свойств col -->
              <th class="cd-grid--header-cell"
                v-for="(col, jindex) in row.cols"
                :key="jindex" :colspan="col.span" :rowspan="col.rowspan" :class="col.headerclass">
                  <div class="cd-grid--header-cell_content">
                    <span>{{ col.text }}</span>
                  </div>
              </th>
              <!-- показывать методы? index === 0? рисуем клетку с rowspan -->
              <th v-if="showmethods && index === 0" :rowspan="header.length"></th>
            </tr>
          </thead>
          <tbody class="cd-grid--table-content">
            <!-- проходим в цикле по list -->
            <tr class="cd-grid--row" v-for="(row, rindex) in list" :key="rowkey(row)">
              <!-- можно выбирать строки? -->
              <td v-if="selectrows" class="cd-checkbox--cell">
                  <input :id="cbkey(row, rindex)" class="cd-checkbox"
                      type="checkbox"
                      v-on:change="onrowselect($event, row)"
                      :checked="isrowselected(row)"
                      />
              </td>
              <!-- проходим в цикле по flatten -->
              <!-- на td вешаем oncellclick(prop, row, $event) -->
              <td class="cd-grid--cell" v-for="(prop, pindex) in columns"
                  :key="prop.datafield + pindex">
                  <cd-cell :config="propertyconfig(prop, row)"></cd-cell>
              </td>
              <!-- нарисуем строку с кнопками -->
              <td v-if="showmethods" class="cd-grid--cell method-row">
                  <cd-method-row
                      :key="methodrowkey(row, index)"
                      :methods="rowmethods(row)"
                      :payload="row"/>
              </td>
            </tr>
          </tbody>
        </table>
      </template>
      <template v-else>
        <div class="cd-grid--no-data">
          <slot name="no-data">
            Нет данных
          </slot>
        </div>
      </template>
    </div>
    <div class="cd-grid--footer">
      <template v-if="paging && total">
        <cd-paging :onpagechange="onpagechange" :total="total" :pageSize="pageSize" :page="page"></cd-paging>
      </template>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import collection from '../common/collection'
import selection from '../common/selection'
import props from '../common/property-decorator'
import methods from '../common/methods'
import utils from '../common/utils'
import cell from './cd-cell.vue'
import filter from './cd-grid-filter.vue'
import paging from './cd-paging.vue'

export default {
  mixins: [collection, props, methods, selection],
  components: {
    'cd-cell': cell,
    'cd-filter': filter,
    'cd-paging': paging
  },
  props: {
    hideheader: { type: Boolean, default: false },
    filter: { type: Array, default: () => ([]) },
    usefilter: { type: Boolean, default: false },
    paging: { type: Boolean, default: false },
    total: { type: Number },
    page: { type: Number },
    pageSize: { type: Number }
  },
  data (grid) {
    return {
      header: utils.headerrows(grid.descriptor, grid.payload)
    }
  },
  computed: {
    columns: function () {
      return utils.flatterer(this.descriptor, []).filter((p) => utils.ispropertyvisible(p, this.payload, {}))
    },
    propertyconfig: function () {
      return (property, row) => utils.propertyconfig.call(this, property, row, this.payload)
    }
  },
  name: 'cd-grid',
  methods: {
    onpagechange (event, scope) {
      Vue.set(this.payload, 'offset', scope.row.offset)
    }
  }
}
</script>

<style>
  @import '~bootstrap/dist/css/bootstrap.min.css';
  .cd-grid--cell {
    display: table-cell;
    padding: 5px;
  }
  .cd-grid {
    margin: auto;
  }
  .cd-grid--table {
    margin: auto;
  }
  table {
    width: unset!important;
  }
</style>
