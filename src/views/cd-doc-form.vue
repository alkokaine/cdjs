<template>
  <div class="cd-doc-form m-auto">
    <cd-doc :content="content"></cd-doc>
    <cd-info property="props" :component="form"></cd-info>
    <el-checkbox v-model="editmode">AAA</el-checkbox> {{ editmode }}
    <cd-form class="m-auto" :descriptor="descriptor" :payload="test" :onpropertychange="onpropertychange" :editmode="editmode" :showcontrols="true" :switchmode="oncancel">
      <template slot-scope="{ property }">
        <template v-if="property.datafield === 'test'">
          AAAAAA
        </template>
      </template>
    </cd-form>
    {{ test }}
  </div>
</template>

<script>

import CDForm from '@/components/cd-form.vue'
import CDDocGeneric from '@/generic/cd-doc-generic.vue'
import ComponentInfo from '@/generic/cd-doc-component-info.vue'

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
          onselect: options.onselect,
          resolveresult (response) {
            return response.data.Data
          },
          headers: {
            Accept: '*/*',
            'Content-Type': 'application/json',
            Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJJZCI6IjMwNiIsIlVzZXJOYW1lIjoi0JDQu9C10LrRgdC10Lkg0JrQvtC60L7QstC40L0iLCJPYmplY3RJRCI6IjE3IiwiQXBwbGljYXRpb25JRCI6IjEiLCJodHRwOi8vc2NoZW1hcy5taWNyb3NvZnQuY29tL3dzLzIwMDgvMDYvaWRlbnRpdHkvY2xhaW1zL3JvbGUiOiJhZG1pbiIsImV4cCI6MTY1MTk5ODQzMSwiaXNzIjoiY3Jvc3MtZCIsImF1ZCI6ImNyb3NzLWQifQ.26Rmkx8XTSjqzag91XdKJUyk73NmDsA4E6-ee7GbbAg'
          },
          url: '/local/api/building/object/196',
          reset: options.reset,
          method: 'get',
          valuekey: 'BuildingID',
          labelkey: 'Name',
          clearable: (options.clearable || false)
        }
      }
    }
  },
  data (doc) {
    return {
      editmode: false,
      form: CDForm,
      test: {
        date: new Date(Date.now())
      },
      descriptor: [
        {
          descriptor: [
            {
              text: 'Общее',
              descriptor: [
                {
                  datafield: 'Name',
                  text: 'Полное название'
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
                      text: 'Телефон'
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
  methods: {
    onpropertychange (...args) {
      // console.log(args)
    },
    oncancel (event) {
      this.editmode = false
    }
  }
}
</script>

<style>
  .cd-doc-form {
    width: 95%;
  }
</style>
