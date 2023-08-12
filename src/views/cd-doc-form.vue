<template>
  <div class="cd-doc-form m-auto">
    <cd-doc :content="content"></cd-doc>
    <cd-info property="props" :component="form"></cd-info>
    <el-checkbox v-model="editmode">AAA</el-checkbox> {{ editmode }}
    <cd-form class="m-auto" :descriptor="descriptor"
      :payload="test"
      :showcontrols="true"
      :editmode="editmode"
      :submit="submitform"
      :sync="true"
      :reset="resetform">
      <template slot-scope="{ property }">
        <template v-if="property.datafield === 'test'">
          AAAAAA
        </template>
      </template>
    </cd-form>
    {{ test }}
    {{ shadow }}
  </div>
</template>

<script>
import Vue from 'vue'
import CDForm from '@/components/cd-form.vue'
import CDDocGeneric from '@/generic/cd-doc-generic.vue'
import ComponentInfo from '@/generic/cd-doc-component-info.vue'
import keys from './keys'

const buildingslotdescriptor = [
  {
    datafield: 'Name',
    class: 'building-name pb-1'
  },
  {
    datafield: 'BuildingTypeName',
    class: 'building-type-name pb-1'
  },
  {
    datafield: 'Address',
    class: 'building-address'
  }
]

export default {
  components: { 'cd-doc': CDDocGeneric, 'cd-info': ComponentInfo, 'cd-form': CDForm },
  props: {
    building: {
      type: Object,
      default: function (options = {}) {
        return {
          input: 'select',
          datafield: 'building_id',
          slotdescriptor: buildingslotdescriptor,
          class: options.class,
          text: 'Объект недвижимости',
          onselect (payload, option, parent) {
            Vue.set(payload, 'BuildingID', option.BuildingID)
          },
          resolveresult (response) {
            return response.data.Data
          },
          headers: keys.crossd,
          url: '/local/api/building/object/196',
          reset: options.reset,
          method: 'get',
          valuekey: 'BuildingID',
          labelkey: 'Name',
          clearable: (options.clearable || false),
          isdisabled (option, payload, parent) {
            return option.BuildingTypeID === 1
          }
        }
      }
    }
  },
  data (doc) {
    return {
      editmode: false,
      form: CDForm,
      test: {
        date1: null,
        Name: null,
        City: null,
        address: null
      },
      shadow: Object,
      descriptor: [
        {
          descriptor: [
            {
              text: 'Общее',
              descriptor: [
                {
                  datafield: 'date1',
                  input: 'date',
                  text: 'date1',
                  rules: [
                    {
                      required: true,
                      message: 'Укажите дату'
                    }
                  ]
                },
                {
                  datafield: 'Name',
                  text: 'Полное название',
                  required: (payload) => payload.BuildingID > 0
                },
                doc.building,
                {
                  descriptor: [
                    {
                      datafield: 'ShortName',
                      text: 'Сокращенное название'
                    }, {
                      datafield: 'UltraShortName',
                      text: 'Краткое название'
                    },
                    {
                      datafield: 'test',
                      text: 'test'
                    }
                  ],
                  class: 'row row-cols-3'
                },
                {
                  descriptor: [
                    {
                      datafield: 'Is24Group',
                      text: 'Is24Group'
                    },
                    {
                      datafield: 'IsBudget',
                      text: 'IsBudget'
                      // Invalid prop: type check failed for prop "value".
                    },
                    {
                      datafield: 'IsDepartment',
                      text: 'IsDepartment'
                    }
                  ],
                  class: 'row row-cols-3'
                },

                {
                  descriptor: [
                    {
                      datafield: 'IsFew',
                      text: 'Малочисленная'
                    },
                    {
                      datafield: 'WorkDaysCount',
                      text: 'WorkDaysCount'
                    },
                    {
                      datafield: 'ObjectID',
                      text: 'ObjectID'
                    },
                    {
                      datafield: 'slider',
                      text: 'slider',
                      input: 'slider'
                    }
                  ],
                  class: 'row row-cols-4'
                },

                {
                  descriptor: [
                    {
                      datafield: 'ObjectStatusID',
                      text: 'ObjectStatusID'
                    },
                    {
                      datafield: 'ObjectTypeID',
                      text: 'ObjectTypeID'
                    },
                    {
                      datafield: 'MainObjectID',
                      text: 'MainObjectID'
                    }
                  ],
                  class: 'row row-cols-3'
                },

                {
                  descriptor: [
                    {
                      datafield: 'Code',
                      text: 'Code'
                    },
                    {
                      datafield: 'EndDate',
                      text: 'EndDate'
                    },
                    {
                      datafield: 'OrderNumber',
                      text: 'OrderNumber'
                    }
                  ],
                  class: 'row row-cols-3'
                },
                {
                  datafield: 'ParentObjectID',
                  text: 'ParentObjectID'
                }
              ]
            },
            {
              text: 'Адрес и контактные данные',
              descriptor: [
                {
                  descriptor: [
                    {
                      datafield: 'address',
                      text: 'address',
                      input: 'autocomplete',
                      method: 'post',
                      labelkey: 'unrestricted_value',
                      valuekey: 'unrestricted_value',
                      headers: keys.dadataheaders,
                      onselect (payload, event, parent) {
                        debugger
                        const { data, unrestricted_value } = event
                        const { settlement_with_type, city_with_type } = data
                        Vue.set(payload, 'City', (city_with_type || settlement_with_type))
                        Vue.set(payload, 'address', unrestricted_value)
                      },
                      resolvepayload (query, payload, parent) {
                        return {
                          query: query,
                          count: 20,
                          locations_boost: [{
                            kladr_id: '51'
                          }]
                        }
                      },
                      focustrigger: false,
                      clearable: true,
                      url: '/suggestions/address',
                      resolveresult: (response) => (response.data.suggestions)
                    },
                    {
                      datafield: 'PostIndex',
                      text: 'Почтовый индекс'
                    },
                    {
                      datafield: 'City',
                      text: 'Город'
                    }
                  ],
                  class: 'row row-cols-2'
                },
                {
                  descriptor: [
                    {
                      datafield: 'Region',
                      text: 'Район'
                    },
                    {
                      datafield: 'Street',
                      text: 'Улица'
                    }
                  ],
                  class: 'row row-cols-2'
                },
                {
                  descriptor: [
                    {
                      datafield: 'HouseNumber',
                      text: 'Дом'
                    },
                    {
                      datafield: 'HouseBlock',
                      text: 'Корпус'
                    }
                  ],
                  class: 'row row-cols-2'
                },
                {
                  descriptor: [
                    {
                      datafield: 'PhoneNumber',
                      text: 'Телефон',
                      hidden (payload) {
                        return payload.date1 === undefined || payload.date1 === null
                      },
                      canedit (payload) {
                        return true
                      },
                      rules: function (payload) {
                        const hasdate = payload.date1 instanceof Date && !isNaN(payload.date1)
                        return [
                          {
                            required: !hasdate,
                            message: 'Укажите номер телефона'
                          }
                        ]
                      }
                    },
                    {
                      datafield: 'EMail',
                      text: 'E-mail'
                    }
                  ],
                  class: 'row row-cols-2'
                },
                {
                  descriptor: [
                    {
                      datafield: 'FaxNumber',
                      text: 'Факс'
                    },

                    {
                      datafield: 'WWW',
                      text: 'Сайт'
                    }
                  ],
                  class: 'row row-cols-2'
                },
                {
                  datafield: 'CityID',
                  text: 'CityID'
                }
              ]
            }
          ],
          class: 'row row-cols-2'
        },
        {
          descriptor: [
            {
              text: 'Реквизиты',
              descriptor: [
                {
                  descriptor: [{
                    datafield: 'INN',
                    text: 'ИНН'
                  },
                  {
                    datafield: 'OKPO',
                    text: 'ОКПО'
                  }
                  ],
                  class: 'row row-cols-2'
                },
                {
                  descriptor: [

                    {
                      datafield: 'KPP',
                      text: 'КПП'
                    },
                    {
                      datafield: 'OKVED',
                      text: 'ОКВЭД'
                    }
                  ],
                  class: 'row row-cols-2'
                },
                {
                  descriptor: [
                    {
                      datafield: 'BankName',
                      text: 'Банк'
                    },
                    {
                      datafield: 'CorrAccount',
                      text: 'Корр/счет'
                    }
                  ],
                  class: 'row row-cols-2'
                },
                {
                  descriptor: [
                    {
                      datafield: 'BIC',
                      text: 'БИК'
                    },
                    {
                      datafield: 'CorrBank',
                      text: 'Корр.банк'
                    }
                  ],
                  class: 'row row-cols-2'
                },
                {
                  datafield: 'CurrentAccount',
                  text: 'Р/Счет'
                },
                {
                  descriptor: [
                    {
                      datafield: 'PersonalAccount',
                      text: 'Лицевой счет'
                    },
                    {
                      datafield: 'PersonalAccount2',
                      text: 'Лицевой счет2'
                    }
                  ],
                  class: 'row row-cols-2'
                },
                {
                  datafield: 'MunAccount',
                  text: 'MunAccount'
                },
                {
                  datafield: 'UFK',
                  text: 'UFK'
                }
              ]
            },
            {
              text: 'Руководитель',
              descriptor: [
                {
                  datafield: 'HeadPosition',
                  text: 'Должность'
                },
                {
                  descriptor: [
                    {
                      datafield: 'HeadFIO',
                      text: 'ФИО'
                    },
                    {
                      datafield: 'IsIO',
                      text: 'Исполняющий обязаности'
                    }
                  ],
                  class: 'row row-cols-2'
                },
                {
                  descriptor: [
                    {
                      datafield: 'HeadPhoneNumber',
                      text: 'Телефон'
                    },
                    {
                      datafield: 'HeadEMail',
                      text: 'E-mail'
                    }
                  ],
                  class: 'row row-cols-2'
                },
                {
                  descriptor: [
                    {
                      datafield: 'HeadReason',
                      text: 'HeadReason'
                    },
                    {
                      datafield: 'HeadSignature',
                      text: 'Подпись для документов'
                    }
                  ],
                  class: 'row row-cols-2'
                },
                {
                  descriptor: [
                    {
                      datafield: 'PostAddress',
                      text: 'PostAddress'
                    },
                    {
                      datafield: 'LawAddress',
                      text: 'LawAddress'
                    }
                  ],
                  class: 'row row-cols-2'
                }
              ]
            }
          ],
          class: 'row row-cols-2'
        }
      ],
      content: [
        {
          id: 'form-1',
          header: 'CD-FORM'
        }
      ]
    }
  },
  // watch: {
  //   editmode: {
  //     handler (newvalue, oldvalue) {
  //       if (newvalue && !oldvalue) {
  //         this.shadow = Object.assign({}, this.test)
  //       } else {
  //         if (this.isreset) {
  //           this.test = Object.assign({}, this.shadow)
  //         }
  //       }
  //     }
  //   }
  // },
  methods: {
    oncancel (event) {
      this.editmode = false
    },
    submitform ({ $event, payload }) {
      this.test = { ...payload }
    },
    resetform ({ $event, payload }) {
      this.test = { ...payload }
    }
  }
}
</script>

<style>
  .cd-doc-form {
    width: 95%;
  }
</style>
