<template>
  <cd-tabs :tabs="days" tab-key="daykey" class="cd-day-tabs d-flex flex-row flex-nowrap w-100" :tab-class="dayClass"
    :orientation="orientation">
    <div slot="header">
      <slot name="header"></slot>
    </div>
    <div class="cd-day--wrap cd-day--tab" :class="[{ 'mw-100': isCol }]" slot-scope="{ tab }" v-on:click.capture="selectDay($event, tab)">
      <div class="cd-day-tab--content d-flex flex-nowrap flex-row align-items-center">
        <slot name="title" :day="tab"></slot>
        <a class="text-decoration-none p-2" :class="{ 'text-danger': isHoliday(tab) }" :href="href(tab)">{{ tabCaption(tab) }}</a>
      </div>
    </div>
    <div slot="content">
      <cd-list :collection="selectedDays" keyfield="daykey" listclass="list-unstyled" rowclass="month-day--details row my-2 w-auto">
        <div slot-scope="{ row }" :id="row.daykey">
          <slot :day="row"></slot>
        </div>
      </cd-list>
    </div>
  </cd-tabs>
</template>

<script>
import CDTabs from '@/components/cd-tabs.vue'
import CDList from './cd-list.vue'
const formatter = Intl.DateTimeFormat('ru-RU')
export default {
  name: 'cd-day-tabs',
  components: {
    'cd-tabs': CDTabs,
    'cd-list': CDList

  },
  props: {
    dayClass: { type: [String, Object, Array, Function] },
    days: { type: Array, required: true, description: 'Коллекция дней' },
    orientation: { type: String, description: 'Положение и направление дней' },
    compareDate: { type: Function, required: true, description: 'Функция сравнения дат' },
    multiple: { type: Boolean, default: false, description: 'Можно ли выбрать несколько дней' },
    format: { type: String, default: 'dd-MM-YYYY', description: 'Формат заголовка вкладки' },
    selectDay: {
      type: Function,
      description: 'Функция, которая выполняется по клику на день'
    },
    selectedDays: {
      type: Array,
      description: 'Массив выбранных дат'
    }
  },
  data (tabs) {
    return {
      info: {}
    }
  },
  computed: {
    getDay () {
      return ({ date }) => (date.toDate())
    },
    isHoliday () {
      return ({ code }) => code == '1'
    },
    isCol ({ orientation }) {
      return ['col-left', 'col-right'].indexOf(orientation) >= 0
    },
    inLeft ({ orientation }) {
      return orientation === 'col-left'
    },
    inRight ({ orientation }) {
      return orientation === 'col-right'
    },
    tabCaption ({ format }) {
      return ({ date }) => formatter.format(date, format)
    },
    href () {
      return ({ daykey }) => (`#${daykey}`)
    }
  }
}
</script>

<style>
  .cd-day--tab {
    white-space: nowrap;
  }
</style>
