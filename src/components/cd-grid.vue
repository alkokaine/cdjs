<template>
  <div class="cd-grid">
    <div class="grid-tuner">
      <slot name="grid-tuner"></slot>
    </div>
    <div class="grid-buttons--pane">
      <slot name="grid-buttons"></slot>
    </div>
    <div class="cd-grid--table">
      <table class="table table-sm border-bottom" :class="[{ 'table-striped' : striped, 'table-hover': highlightOnHover }, borderclass ]">
        <caption>
          <slot name="table-caption"><div class="no-data--reload" v-if="error" v-on:click.stop="loaddata(get.url, payload)">{{ error }}</div></slot>
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
                  <p class="mb-0">{{ col.text }}</p>
              </th>
            </template>
            <template v-else>
              <th scope="col"></th>
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
                    :key="propcellkey(prop, rindex, pindex)" class="cd-grid--cell"
                    :class="[resolvetdclass(prop, row), { 'text-center' : prop.input === 'checkbox'}]"
                    v-on:click="oncellclick(prop, { $event, row })">
                    <el-popover class="cd-grid--tooltip"
                                :disabled="hasnopopover(prop) || isdisabledpopover(prop, row)" :popper-class="resolvepopperclass(prop, row)"
                                :trigger="resolvepopovertrigger(prop, row)"
                                v-on:hide="onpopoverhide($event, { prop, row })"
                                v-on:show="onpopovershow($event, { prop, row })"
                                v-on:after-leave="onpopoverleave($event, { prop, row })"
                                v-on:after-enter="onpopoverenter($event, { prop, row })"
                                :width="resolvepopoverwidth(prop, row)"
                                :popper-options="resolvepopoveroptions(prop, row)"
                                :title="resolvepopovertitle(prop, row)"
                                :content="resolvepopovercontent(prop, row)">
                      <template v-if="prop.popover">
                        <slot :ispopover="true" :data="{ row, $rowindex: rindex }" :property="{ prop, $propindex: pindex }">
                          <div class="cd-popover--default">укажите содержимое подсказки для свойства {{ prop.datafield }} или используйте слот, где ispopover == true  </div>
                        </slot>
                      </template>
                      <template slot="reference">
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
                      </template>
                    </el-popover>
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
        <tfoot class="border-top-0"></tfoot>
      </table>
      <el-pagination v-if="paging" class="p-2 m-auto" v-on:current-change="onpagechange({ page: $event, pagesize: payload.PageSize })"
                           :current-page="payload.Page"
                           :page-size="payload.PageSize"
                           layout="prev, pager, next"
                           :hide-on-single-page="true"
                           :total="total"
                           background
                           size="small"></el-pagination>
        <slot name="table-footer"></slot>
    </div>
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
    gridsettings: { type: String, description: 'Попробуем css grid' },
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
      currentrow: {},
      currentpage: 1,
      borderclass: resolveborder(grid.borders)
    }
  },
  computed: {
    isdisabledpopover () {
      const grid = this
      return (property, row) => (grid.resolvepopoverproperty(property, 'isdisabled', row))
    },
    resolvepopover () {
      return (property, row) => (utils.resolvePropertyValue(property, 'popover', row) || {})
    },
    resolvepopperclass () {
      const grid = this
      return (prop, row) => (`${(grid.resolvepopoverproperty(prop, 'class', row) || 'cd-popover--content')}`)
    },
    resolvepopoveroptions: function () {
      const grid = this
      return (prop, row) => (grid.resolvepopoverproperty(prop, 'options', row) || {
        placement: 'auto-start'
      })
    },
    resolvepopovertrigger: function () {
      const grid = this
      return (prop, row) => (grid.resolvepopoverproperty(prop, 'trigger', row) || 'hover')
    },
    resolvepopovertitle: function () {
      const grid = this
      return (prop, row) => (grid.resolvepopoverproperty(prop, 'title', row))
    },
    resolvepopovercontent: function () {
      const grid = this
      return (prop, row) => (grid.resolvepopoverproperty(prop, 'content', row))
    },
    resolvepopoverwidth: function () {
      const grid = this
      return (prop, row) => (grid.resolvepopoverproperty(prop, 'title', row))
    },
    hasnopopover () {
      return (prop) => prop.popover === undefined
    },
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
      return (prop, row) => utils.resolvePropertyValue(prop, 'icon', row)
    },
    resolvecellclass: function () {
      return (prop, row) => utils.resolvePropertyValue(prop, 'cellclass', row)
    },
    resolvetdclass: function () {
      return (prop, row) => utils.resolvePropertyValue(prop, 'tdclass', row)
    },
    resolvepopoverproperty () {
      const grid = this
      return (property, propname, row) => {
        const popover = grid.resolvepopover(property, row)
        return utils.resolvePropertyValue(popover, propname, row)
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
    },
    onpopoverhide (event, args) {
      const onhide = args.prop.onhide
      if (onhide && typeof onhide === 'function') onhide(args.row, event)
    },
    onpopovershow (event, args) {
      const onshow = args.prop.onshow
      if (onshow && typeof onshow === 'function') onshow(args.row, event)
    },
    onpopoverleave (event, args) {
      const onleave = args.prop.onleave
      if (onleave && typeof onleave === 'function') onleave(args.row, event)
    },
    onpopoverenter (event, args) {
      const onenter = args.prop.onenter
      if (onenter && typeof onenter === 'function') onenter(args.row, event)
    }
  },
  watch: {
    payload: {
      deep: true,
      handler (newvalue, oldvalue) {
        this.loaddata(this.get.url, newvalue)
      }
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
  .cd-popover--content {
    min-width: max-content!important;
    max-width: min-content;
  }
</style>
