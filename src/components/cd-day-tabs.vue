<template>
  <div class="cd-day-tabs--wrapper">
    <div class="scheduler-slot">
        <slot name="scheduler" :date="date"></slot>
    </div>
    <cd-tabs :tabs="days" tab-key="daykey" class="cd-day-tabs ms-auto" :tab-class="dayClass"
      :orientation="orientation" :current-key="date.daykey" :tab-list-class="[{ 'align-items-end': inLeft, 'align-items-start': inRight }, 'days-list']">
      <div class="cd-day--wrap cd-day--tab" :class="[{ '': isCol, 'd-none': hideTabs }]" slot-scope="{ tab }" v-on:click.capture="selectDay($event, tab)">
        <div class="cd-day-tab--content" :class="{'opacity-25': tab.isprev }">
          <slot name="title" :day="tab">
            <div class="tab-title--block d-flex flex-nowrap align-items-center">
              <div class="bi day-icon mx-auto" >
                <slot name="icon" :day="tab"></slot>
              </div>
              <a class="text-decoration-none fw-bold text-end p-2" :class="{ 'text-danger': isHoliday(tab) }" href="#">{{ tabCaption(tab) }}</a>
            </div>
          </slot>
        </div>
      </div>
      <div slot="content" class="p-3" :class="{ 'border-start': hideTabs }">
        <cd-month-days :date="date" :collection="sortedDays" keyfield="daykey" listclass="list-unstyled" rowclass="month-day--details row my-2 w-auto">
          <div slot-scope="{ day }" :id="day.daykey">
            <slot :day="day"></slot>
          </div>
        </cd-month-days>
      </div>
    </cd-tabs>
  </div>
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
    hideTabs: { type: Boolean, default: false },
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
    },
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
  .cd-day-tabs--wrapper {
  }
  .days-list.flex-row {
    width: 100%;
  }
  .days-list.flex-column {
    width: 8vw;
  }
</style>
