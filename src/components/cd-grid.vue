<template>
  <div class="cd-grid">
    <div class="grid-tuner">
      <slot name="grid-tuner"></slot>
    </div>
    <div class="grid-buttons--pane">
      <slot name="grid-buttons"></slot>
    </div>
    <div class="table-responsive">
      <table class="table table-sm border-bottom" :class="[{ 'table-striped' : striped, 'table-hover': highlightOnHover }, borderclass ]">
        <caption>
          <slot name="table-caption"><div class="no-data--reload" v-if="error" v-on:click="loaddata(get.url, payload)">{{ error }}</div></slot>
        </caption>
        <thead v-if="!hideheader" class="cd-grid--head table-light border-top" :class="headerclass">
          <tr class="ms-0 me-0">
            <th v-if="selectrows" class="cd-checkbox--cell">
              <input type="checkbox" class="cd-grid--checkbox" v-on:change="onrowselect($event)" :checked="allselected"/>
            </th>
            <th scope="col"></th>
            <template v-if="columns.length">
              <th scope="col"
                v-for="(col, jindex) in columns"
                :key="jindex" :class="col.headerclass">
                  <div>
                    <p class="mb-0">{{ col.text }}</p>
                  </div>
              </th>
            </template>
            <template v-else>
              <th scope="col" class="w-100"></th>
            </template>
            <th scope="col"></th>
          </tr>
        </thead>
        <tbody>
          <template v-if="collection && collection.length">
            <!-- проходим в цикле по list -->
            <tr v-for="(row, rindex) in collection" :key="rowkey(row)" class="ms-0 me-0">
              <td v-if="selectrows" class="cd-checkbox--cell">
                <input type="checkbox" class="cd-grid--checkbox" v-on:change="onrowselect($event, row)" :checked="isrowselected(row)"/>
              </td>
              <td :ref="propcellkey({}, rindex, 0)">
                <slot :data="{ row, $rowindex: rindex }" :start="true"></slot>
              </td>
              <td v-for="(prop, pindex) in columns"
                    :key="propcellkey(prop, rindex, pindex)"
                    :class="[resolvetdclass(prop, row), { 'text-center' : prop.input === 'checkbox'}]"
                    v-on:click="oncellclick(prop, { $event, row })">
                    <slot :data="{ row, $rowindex: rindex }" :property="{ prop, $propindex: pindex }">
                      <div class="w-auto">
                        <template v-if="prop.icon">
                          <i class="cd-cell--icon" :class="resolveicon(prop, row)"></i>
                        </template>
                        <template v-else-if="prop.route">
                          <router-link :to="prop.route(row)">
                            <template v-if="prop.format">{{ prop.format(row) }}</template>
                            <template v-else>{{ row[prop.datafield] }}</template>
                          </router-link>
                        </template>
                        <template v-else-if="prop.input === 'date' || prop.input === 'datetime'">
                          {{ formatDate(row[prop.datafield]) }}
                        </template>
                        <template v-else-if="prop.input === 'checkbox'">
                          <input class="form-check-input pe-none" type="checkbox" :checked="row[prop.datafield]"/>
                        </template>
                        <template v-else>
                          {{ row[prop.datafield] }}
                        </template>
                      </div>
                    </slot>
              </td>
              <td v-if="columns.length === 0">
                <slot :data="{ row, $rowindex: rindex }" :row="true">
                  {{ row }}
                </slot>
              </td>
              <td :ref="propcellkey({}, rindex, 999)">
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
        <tfoot class="container-sm border-top-0">
          <slot name="table-footer"></slot>
          <el-pagination class="p-2 m-auto" v-on:current-change="onpagechange({ page: $event, pagesize: payload.PageSize })"
                           :current-page="payload.Page"
                           :page-size="payload.PageSize"
                           layout="prev, pager, next"
                           :hide-on-single-page="true"
                           :total="total"
                           background
                           size="small"></el-pagination>
        </tfoot>
      </table>
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

const formatter = new Intl.DateTimeFormat('ru-RU')

const resolveborder = (borders) => {
  switch (borders) {
    case 'all': return 'table-bordered'
    case 'rows': return ''
    case 'cols': return ''
    case 'none': return 'table-borderless'
  }
}

export default {
  mixins: [collection, watchurl, props, methods, selection],
  props: {
    headerclass: { type: String, description: 'Класс для элемента thead таблицы' },
    borders: { type: String, validator: (value) => (['all', 'rows', 'cols', 'none'].indexOf(value) !== -1), default: 'rows' },
    striped: { type: Boolean, default: false, description: 'zebra-striping' },
    highlightOnHover: { type: Boolean, default: false, description: 'для подсветки строк при hover' },
    hideheader: { type: Boolean, default: false, description: 'Скрывать ли header грида' },
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
      currentpage: 1,
      borderclass: resolveborder(grid.borders)
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
    oncellclick (prop, event) {
      if (prop.oncellclick && typeof prop.oncellclick === 'function') prop.oncellclick(event)
    }
  }
}
</script>

<style>
  .table {
    table-layout: auto;
  }
  td.cd-grid--no-data {
    text-align: center;
    padding-top: 50px;
    padding-bottom: 50px;
  }
  ul.el-pager {
    padding: unset;
  }
  .cd-grid--checkbox {
    position: relative;
    width: 20px;
    padding: unset;
  }
</style>
