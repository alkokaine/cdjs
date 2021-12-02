<template>
  <div id="app">
    <cd-menu class="doc-menu" :iscollapsed="iscollapsed" :menu="menu" :menuitemclicked="menuitemclick">
      <div slot="menu-header" class="cdjs-container" :class="{ 'is-collapsed': iscollapsed }">
        <div v-if="!iscollapsed" class="cdjs-name--block">
          <span>[{ CDJS }]</span>
        </div>
        <div class="cdjs-name--collapse">
          <i class='collapse-menu' :class="[iscollapsed ? 'bi bi-list' : 'bi bi-x']" v-on:click="collapse"></i>
        </div>
      </div>
    </cd-menu>
    <div class="content-wrapper" :class="{ 'is-collapsed': iscollapsed}">
      <!-- <cd-grid :descriptor="descriptor"
        :crud="crud"
        keyfield="id"
        :payload="payload"
        :paging="true"
        :resolvedata="getcitydata"
        :total="metadata.totalCount"
        :page="metadata.currentOffset"
        :pageSize="payload.limit"></cd-grid> -->
      <cd-form :descriptor="form" :payload="formpayload"></cd-form>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import axios from 'axios'
import CDMenu from './components/cd-menu.vue'
// import CdGrid from './components/cd-grid.vue'
import CDForm from './components/cd-form.vue'

axios.defaults.baseURL = 'wft-geo-db.p.rapidapi.com'
axios.defaults.headers.common['x-rapidapi-host'] = 'wft-geo-db.p.rapidapi.com'
axios.defaults.headers.common['x-rapidapi-key'] = '0d6efbd8a7msh8fcd0fa4c7e36a4p15464ejsn34c8169d4000'

Vue.prototype.$http = axios

export default {
  name: 'App',
  components: {
    'cd-menu': CDMenu,
    // 'cd-grid': CdGrid,
    'cd-form': CDForm
  },
  data (app) {
    return {
      metadata: {
        currentOffset: 0,
        totalCount: 0
      },
      formpayload: {
        namePrefix: ''
      },
      crud: {
        get: { url: 'https://wft-geo-db.p.rapidapi.com/v1/geo/cities', method: 'get' }
      },
      payload: {
        limit: 10,
        minPopulation: null,
        namePrefix: null,
        distanceUnit: null,
        offset: 0,
        excludedCountryIds: null
      },
      descriptor: [
        {
          datafield: 'id',
          text: 'id'
        },
        {
          datafield: 'type',
          text: 'Type'
        },
        {
          datafield: 'city',
          text: 'City'
        },
        {
          datafield: 'country',
          text: 'Country'
        },
        {
          datafield: 'countryCode',
          text: 'Country Code'
        },
        {
          datafield: 'region',
          text: 'Region'
        },
        {
          datafield: 'latitude',
          text: 'Lat'
        },
        {
          datafield: 'longitude',
          text: 'Lon'
        }
      ],
      form: [
        {
          select: {
            valuekey: 'wikiDataId',
            labelkey: 'name',
            url: 'https://wft-geo-db.p.rapidapi.com/v1/geo/countries',
            method: 'get',
            resolveresult: (response) => (response.data.data),
            params: (payload) => ({
              limit: 10,
              namePrefix: payload.name
            })
          },
          datafield: 'wikiDataId',
          text: 'Country'
        }
      ],
      menu: [
        { id: 1, icon: 'bi bi-list-ul', text: 'Список' },
        { id: 2, icon: 'bi bi-menu-button-wide', text: 'Меню' },
        {
          id: 3,
          icon: 'bi bi-table',
          text: 'Таблица',
          menu: [
            {
              id: 5,
              text: 'Table1',
              menu: [
                { id: 8, text: 'Table1-Point1' },
                { id: 9, text: 'Table1-Point2' },
                { id: 10, text: 'Table1-Point3' }
              ]
            },
            { id: 6, text: 'Table2' },
            {
              id: 7,
              text: 'Table3',
              menu: [
                { id: 11, text: 'Table3-Point1' },
                {
                  id: 12,
                  text: 'Table3-Point2',
                  menu: [
                    { id: 14, text: 'Table3-Point2-Point1' },
                    { id: 15, text: 'Table3-Point2-Point2' },
                    { id: 16, text: 'Table3-Point2-Point3' }
                  ]
                },
                { id: 13, text: 'Table2-Point3' }
              ]
            }
          ]
        },
        { id: 4, icon: 'bi bi-input-cursor-text', text: 'Форма' }
      ],
      iscollapsed: window.innerWidth <= 1024,
      totalrows: 0
    }
  },
  methods: {
    collapse () {
      this.iscollapsed = !this.iscollapsed
    },
    getcitydata (response) {
      const data = response.data
      this.metadata = data.metadata
      return data.data
    },
    menuitemclick (event, scope) {
      if (scope.row.url) console.log(scope)
    }
  }
}
</script>

<style>
  /* @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400&family=Raleway:wght@300;400&display=swap');*/
  @import url("https://cdn.jsdelivr.net/npm/bootstrap-icons@1.7.1/font/bootstrap-icons.css");
  :root {
    --icon-width: 40px;
    --icon-height: 40px;
    --icon-padding: 10px;
    --collapsed-menu-width: 40px;
    --menu-color: white;
    --font-size: 16px;
    --menu-background: #104989;
    --collapsed-header-background: black;
    --hover-color: #2d74c4;
    --menu-padding: 10px;
    --menu-width: 260px;
    --menu-item-height: 50px;
  }
  .cdjs-name--block {
    width: calc(var(--menu-width) - var(--collapsed-menu-width));
    line-height: var(--collapsed-menu-width);
    text-align: center;
  }
  .cdjs-name--collapse {
    width: var(--collapsed-menu-width);
    line-height: var(--collapsed-menu-width);
    text-align: center;
  }
  .cdjs-container {
    display: flex;
  }
    #app {
    font-family: 'Open Sans', sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    font-size: 0.9rem;
  }
  body {
    margin: unset;
  }
  .doc-menu {
    background-color: var(--menu-background);
    color: var(--menu-color);
    font-size: var(--font-size);
    height: 100%;
    width: var(--menu-width);
    position: fixed;
    z-index: 1000;
  }
  .doc-menu.is-collapsed {
    width: var(--collapsed-menu-width);
  }
  .content-wrapper {
    margin-left: var(--menu-width);
  }
  .content-wrapper.is-collapsed {
    margin-left: var(--collapsed-menu-width);
  }
</style>
