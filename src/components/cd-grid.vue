<template>
  <div class="cd-grid">
    <div class="grid-tuner">
      <slot name="grid-tuner"></slot>
    </div>
    <div class="cd-grid-buttons--row">
      <button v-if="allownew" class="cd-grid--createnew" v-on:click="callcreate">
        <span>
          {{ addnewheader }}
        </span>
      </button>
      <slot name="cd-grid-buttons"></slot>
    </div>
    <div class="cd-grid--content">
      <table class="table cd-grid--table table-responsive table-sm">
        <caption>
          <slot name="table-caption"><div class="no-data--reload" v-if="error" v-on:click="loaddata(get.url, payload)">{{ error }}</div></slot>
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
          <template v-if="collection && collection.length">
            <!-- проходим в цикле по list -->
            <tr class="cd-grid--row" v-for="(row, rindex) in collection" :key="rowkey(row)">
              <!-- можно выбирать строки? -->
              <td v-if="selectrows" class="cd-checkbox--cell">
                  <input :id="cbkey(row, rindex)" class="cd-checkbox"
                      type="checkbox"
                      v-on:change="onrowselect($event, row)"
                      :checked="isrowselected(row)"
                      />
              </td>
              <template v-if="columns.length">
                 <!-- проходим в цикле по flatten -->
              <!-- на td вешаем oncellclick(prop, row, $event) -->
                <td class="cd-grid--cell" v-for="(prop, pindex) in columns"
                    :key="prop.datafield + pindex">
                    <slot :row="row" :prop="prop">
                      <template v-if="prop.icon">
                        <i class="cd-cell--icon" :class="resolveicon(prop, row)"></i>
                      </template>
                      <template v-else>
                        <cd-cell :class="resolvecellclass(prop, row)" :config="propertyconfig(prop, row)"></cd-cell>
                      </template>
                    </slot>
                </td>
              </template>
              <template v-else>
                <td class="cd-grid--cell">{{ row }}</td>
              </template>
              <!-- нарисуем строку с кнопками -->
              <td v-if="showmethods" class="cd-grid--cell method-row">
                  <cd-method-row
                      :key="methodrowkey(row, index)"
                      :methods="rowmethods(row)"
                      :payload="row"/>
              </td>
            </tr>
          </template>
          <template v-else>
            <tr class="cd-grid--no-data">
              <td class="cd-grid--no-data" :colspan="columns.length">
                <slot name="no-data">
                  <div>Нет данных</div>
                </slot>
              </td>
            </tr>
          </template>
        </tbody>
      </table>
    </div>
    <div class="cd-grid--footer">
      <cd-paging v-if="paging" :onpagechange="gridpagechange" :total="total" :pageSize="pageSize" :page="currentpage" :viewRange="pagesvisible"></cd-paging>
    </div>
  </div>
</template>

<script>
import collection from '../common/collection'
import selection from '../common/selection'
import props from '../common/property-decorator'
import methods from '../common/methods'
import utils from '../common/utils'
import cell from './cd-cell.vue'
import watchurl from '../common/get-url-watch'
import paging from './cd-paging.vue'

export default {
  mixins: [collection, watchurl, props, methods, selection],
  components: {
    'cd-cell': cell,
    'cd-paging': paging
  },
  props: {
    allownew: { type: Boolean, description: 'Можно ли добавлять новые строки в грид' },
    hideheader: { type: Boolean, default: false, description: 'Скрывать ли header грида' },
    filter: { type: Array, default: () => ([]), description: 'Коллекция объектов-дескрипторов свойств объекта payload (о нём было выше)' },
    usefilter: { type: Boolean, default: false, description: 'Использовать ли фильтр (показывать ли форму-редактор аргументов запроса получения данных)' },
    paging: { type: Boolean, default: false, description: 'Использовать ли постраничную загрузку' },
    total: { type: Number, description: 'При постраничной загрузке данных, эта штука возвращается контроллером вместе с коллекцией, означает сколько-всего-элементов-в-коллекции' },
    pageSize: { type: Number, default: 20, description: 'При постраничной загрузке данных, размер страницы в элементах' },
    onpagechange: { type: Function, description: 'Что проиозойдёт при смене страницы', default: function (event, pageargs) {} },
    selectrows: { type: Boolean, default: false, description: 'показывать ли колонку с чекбоксами для отметки строк' },
    pagesvisible: { type: Number, default: 5, description: 'Диапазон страниц, видимый без разрывов в компоненте постраничной загрузки' },
    resolveresult: {
      type: Function,
      default: function (response) {
        return response.data
      }
    },
    collection: {
      type: Array,
      required: true,
      description: 'Коллекция для отображения в гриде'
    }
  },
  data (grid) {
    return {
      // header: utils.headerrows(grid.descriptor, grid.payload),
      currentrow: {},
      currentpage: 1
    }
  },
  computed: {
    columns: function () {
      return utils.flatterer(this.descriptor, []).filter((p) => utils.ispropertyvisible(p, this.payload, {}))
    },
    propertyconfig: function () {
      return (property, row) => utils.propertyconfig.call(this, property, row, this.iscurrentrow(row), this.payload)
    },
    header: function () {
      return utils.headerrows(this.descriptor, this.payload)
    },
    resolveicon: function () {
      return (prop, row) => {
        if (typeof prop.icon === 'function') return prop.icon(row)
        return prop.icon
      }
    },
    resolvecellclass: function () {
      return (prop, row) => {
        if (typeof prop.cellclass === 'function') return prop.cellclass(row)
        return prop.cellclass
      }
    }
  },
  name: 'cd-grid',
  methods: {
    iscurrentrow (row) {
      return row[this.keyfield] === this.currentrow[this.keyfield] && this.currentrow[this.keyfield] !== undefined
    },
    gridpagechange (event, scope) {
      if (scope.row.pageNum > 0) this.currentpage = scope.row.pageNum
      else if (scope.row.pageNum < 0) this.currentpage += (scope.row.pageNum) * this.pagesvisible
      this.onpagechange(event, scope)
    }
  }
}
</script>

<style>
  .cd-grid--cell {
    display: table-cell;
    padding: 5px;
    vertical-align: middle;
  }
  .no-data--reload {
    cursor: pointer;
    width: 300px;
  }
  .cd-grid {
    margin: auto;
  }
  .cd-grid--table {
    margin: auto;
  }
  td.cd-grid--no-data {
    text-align: center;
    padding-top: 50px;
    padding-bottom: 50px;
  }
  .cd-grid--cell > .cd-cell {
    display: block;
  }
</style>
