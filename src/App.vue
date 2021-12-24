<template>
  <div id="app">
    <cd-menu class="doc-menu" :iscollapsed="iscollapsed" :menu="menu" :menuitemclicked="menuitemclick">
      <div slot="menu-header" class="cdjs-container" :class="{ 'is-collapsed': iscollapsed }">
        <div v-if="!iscollapsed" class="cdjs-name--block">
          <router-link to="/">CDJS</router-link>
        </div>
        <div class="cdjs-name--collapse" v-on:click="collapse">
          <i class='collapse-menu' :class="[iscollapsed ? 'bi bi-list' : 'bi bi-x']"></i>
        </div>
      </div>
    </cd-menu>
    <div class="content-wrapper" :class="{ 'is-collapsed': iscollapsed}">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import axios from 'axios'
import CDMenu from './components/cd-menu.vue'

axios.defaults.baseURL = 'wft-geo-db.p.rapidapi.com'
axios.defaults.headers.common['x-rapidapi-host'] = 'wft-geo-db.p.rapidapi.com'
axios.defaults.headers.common['x-rapidapi-key'] = '0d6efbd8a7msh8fcd0fa4c7e36a4p15464ejsn34c8169d4000'

Vue.prototype.$http = axios

export default {
  name: 'App',
  components: {
    'cd-menu': CDMenu
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
      get: { url: 'https://wft-geo-db.p.rapidapi.com/v1/geo/cities', method: 'get' },
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
          datafield: 'namePrefix',
          text: 'Поиск'
        },
        {
          select: {
            valuekey: 'wikiDataId',
            labelkey: 'name',
            url: 'https://wft-geo-db.p.rapidapi.com/v1/geo/countries',
            method: 'get',
            resolveresult: (response) => (response.data.data),
            isdisabled: (payload, option) => option.wikiDataId.endsWith(7),
            params: (payload) => ({
              limit: 10,
              namePrefix: payload.namePrefix
            })
          },
          datafield: 'wikiDataId',
          text: 'Country'
        }
      ],
      menu: [
        { id: 1, icon: 'bi bi-list-ul', text: 'Список', url: '/Collection' },
        {
          id: 2,
          icon: 'bi bi-menu-button-wide',
          text: 'Меню',
          url: '/Menu',
          drop: true,
          menu: [
            {
              id: 5,
              text: 'восходящее',
              is_drop: true,
              menu: [
                {
                  text: 'восходящее меню 1',
                  id: 7
                },
                {
                  text: 'восходящее меню 2',
                  id: 8
                },
                {
                  text: 'восходящее меню 3',
                  id: 9
                }
              ]
            },
            {
              id: 6,
              text: 'падающее',
              is_drop: false,
              menu: [
                {
                  text: 'падающее меню 1',
                  id: 10
                },
                {
                  text: 'падающее меню 2',
                  id: 11
                },
                {
                  text: 'падающее меню 3',
                  id: 12
                }
              ]
            }
          ]
        },
        {
          id: 3,
          icon: 'bi bi-table',
          text: 'Таблица',
          url: '/Grid'
        },
        { id: 4, icon: 'bi bi-input-cursor-text', text: 'Форма', url: '/Form' },
        { id: 10, text: 'Диалог', url: '/Dialog' }
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
      if (scope.row.url && this.$route.path !== scope.row.url) this.$router.push(scope.row.url)
    }
  }
}
</script>

<style>
  @import '~bootstrap/dist/css/bootstrap.css';
  @import '~bootstrap-icons/font/bootstrap-icons.css';
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
