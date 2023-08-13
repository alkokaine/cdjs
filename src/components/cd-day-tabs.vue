<template>
  <cd-tabs :tabs="days" tab-key="daykey" class="cd-day-tabs d-flex flex-row flex-nowrap w-100" :tab-class="dayClass"
    :orientation="orientation">
    <div slot="header">
      <slot name="header"></slot>
    </div>
    <div class="cd-day--wrap cd-day--tab" :class="[{ 'mw-100': isCol }]" slot-scope="{ tab }" v-on:click.capture="selectDay($event, tab)">
      <div class="cd-day-tab--content w-auto p-2" :class="{'opacity-25': tab.isprev }">
        <slot name="title" :day="tab">
          <div class="tab-title--block">
            <slot name="icon" :day="tab"></slot>
            <a class="text-decoration-none ps-2 fw-bold text-end" :class="{ 'text-danger': isHoliday(tab) }" :href="href(tab)">{{ tabCaption(tab) }}</a>
          </div>
        </slot>
      </div>
    </div>
    <div slot="content">
      <cd-month-days :date="date" :collection="sortedDays" keyfield="daykey" listclass="list-unstyled" rowclass="month-day--details row my-2 w-auto">
        <div slot="scheduler" slot-scope="{ month, date }">
          <slot name="scheduler" :month="month" :date="date"></slot>
        </div>
        <div slot-scope="{ day }" :id="day.daykey">
          <slot :day="day"></slot>
        </div>
      </cd-month-days>
    </div>
  </cd-tabs>
</template>

<script>
import CDTabs from './cd-tabs.vue'
import CDMonthDays from './cd-month-days'
const formatter = Intl.DateTimeFormat('ru-RU')
export default {
  name: 'cd-day-tabs',
  components: {
    'cd-tabs': CDTabs,
    'cd-month-days': CDMonthDays

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
    date: { type: Object },
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
    sortedDays ({ selectedDays }) {
      return (selectedDays.sort((a, b) => a.daykey - b.daykey))
      
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
  .cd-day-tab--content {
    width: 4em;
    cursor: pointer;
  }
</style>
