<template>
  <cd-tabs class="cd-day-tabs container" :tabs="days" tab-key="daykey"
    :orientation="orientation" :tab-list-class="{ 'align-items-end': inLeft, 'align-items-start': inRight }"
    :on-tab-select="selectDay">
    <div class="cd-day--wrap cd-day--tab" :class="[{ 'mw-100': isCol }]" slot-scope="{ tab }">
      <span slot="header">{{ tabCaption(tab) }}</span>
    </div>
    <div slot="content" class="p-2 m-2">
      <cd-list :collection="selectedDays" keyfield="daykey" list-class="list-unstyled" row-class="month-day--details row">
        <!-- <cd-day slot-scope="{ row }" :day="getDay(row)" :info="info">
          <div class="cd-day--details fw-bold" slot="header">
            {{ tabCaption(row) }}
          </div>
          <div slot-scope="{ day }" class="cd-day-content--wrap">
            <slot :day="day"></slot>
          </div>
        </cd-day> -->
        <span slot-scope="{ row }">{{ row }}</span>
      </cd-list>
    </div>
  </cd-tabs>
</template>

<script>
import CDTabs from '@/components/cd-tabs.vue'
// import CDDay from '@/components/cd-day.vue'
import CDList from './cd-list.vue'
const formatter = Intl.DateTimeFormat('ru-RU')
export default {
  name: 'cd-day-tabs',
  components: {
    'cd-tabs': CDTabs,
    // 'cd-day': CDDay,
    'cd-list': CDList

  },
  props: {
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
    }
  }
}
</script>

<style>
  .cd-day--tab {
    white-space: nowrap;
  }
</style>
