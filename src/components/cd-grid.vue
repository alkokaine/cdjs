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
          <tr class="cd-grid--header-row border-bottom">
            <th v-if="selectrows"
                class="cd-grid--header-cell cd-checkbox--cell"
                :rowspan="1">
                <!-- checked когда всё выбрано, по change выполняем onselectchange -->
                <input class="cd-checkbox"
                  type="checkbox"
                  @change="onrowselect($event)"
                  :checked="allselected"/>
            </th>
            <th class="cd-grid--header-cell"></th>
            <!-- теперь заголовки столбцов -->
            <!-- проходим в цикле по cols -->
            <!-- ставим colspan и rowspan из свойств col -->
            <th class="cd-grid--header-cell"
              v-for="(col, jindex) in columns"
              :key="jindex" :colspan="col.span" :rowspan="col.rowspan" :class="col.headerclass">
                <div class="cd-grid--header-cell_content">
                  <span>{{ col.text }}</span>
                </div>
            </th>
            <!-- показывать методы? index === 0? рисуем клетку с rowspan -->
            <th v-if="columns.length === 0" class="cd-grid--header-cell">
            </th>
            <th class="cd-grid--header-cell">
            </th>
          </tr>
        </thead>
        <tbody class="cd-grid--table-content">
          <template v-if="collection && collection.length">
            <!-- проходим в цикле по list -->
            <tr class="cd-grid--row" v-for="(row, rindex) in collection" :key="rowkey(row)">
              <td v-if="selectrows" class="cd-checkbox--cell">
                <input :id="cbkey(row, rindex)" class="cd-checkbox"
                    type="checkbox"
                    v-on:change="onrowselect($event, row)"
                    :checked="isrowselected(row)"/>
              </td>
              <td class="cd-grid--cell" :ref="propcellkey({}, rindex, 0)">
                <slot :data="{ row, $rowindex: rindex }" :start="true"></slot>
              </td>
              <td class="cd-grid--cell" v-for="(prop, pindex) in columns"
                    :key="propcellkey(prop, rindex, pindex)"
                    :class="resolvetdclass(prop, row)"
                    v-on:click="oncellclick(prop, { $event, row })">
                    <slot :data="{ row, $rowindex: rindex }" :property="{ prop, $propindex: pindex }">
                      <template v-if="prop.icon">
                        <i class="cd-cell--icon" :class="resolveicon(prop, row)"></i>
                      </template>
                      <template v-else-if="prop.input === 'date' || prop.input === 'datetime'">
                        {{ formatDate(row[prop.datafield]) }}
                      </template>
                      <template v-else>
                        {{ row[prop.datafield] }}
                      </template>
                    </slot>
              </td>
              <td class="cd-grid--cell" v-if="columns.length === 0">
                <slot :data="{ row, $rowindex: rindex }" :row="true">
                  {{ row }}
                </slot>
              </td>
              <td class="cd-grid--cell" :ref="propcellkey({}, rindex, 999)">
                <slot :data="{ row, $rowindex: rindex }" :end="true"></slot>
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
    <slot name="footer"></slot>
  </div>
</template>

<script>
import collection from '../common/collection'
import selection from '../common/selection'
import props from '../common/property-decorator'
import methods from '../common/methods'
import utils from '../common/utils'
import watchurl from '../common/get-url-watch'
import paging from './cd-paging.vue'

const formatter = new Intl.DateTimeFormat('ru-RU')

export default {
  mixins: [collection, watchurl, props, methods, selection],
  components: {
    'cd-paging': paging
  },
  props: {
    servicecol: { type: Boolean, default: false, description: 'Служебная колонка' },
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
    },
    formatDate: {
      type: Function,
      default: function (date) {
        return formatter.format(new Date(date))
      }
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
    propcellkey: function () {
      return (prop, ri, pi) => `cell_${ri}_${pi}`
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
    },
    resolvetdclass: function () {
      return (prop, row) => {
        if (typeof prop.tdclass === 'function') return prop.tdclass(row)
        return prop.tdclass
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
    },
    oncellclick (prop, event) {
      if (prop.oncellclick && typeof prop.oncellclick === 'function') prop.oncellclick(event)
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
  .table > :not(:first-child) {
    border-color: inherit;
    border-width: inherit;
  }
</style>
