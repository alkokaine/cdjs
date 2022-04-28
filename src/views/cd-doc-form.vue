<template>
  <div class="cd-doc-form m-auto">
    <cd-doc :content="content"></cd-doc>
    <cd-info property="props" :component="form"></cd-info>
    <el-checkbox v-model="editmode">AAA</el-checkbox> {{ editmode }}
    <cd-form class="m-auto" :descriptor="descriptor" :payload="test" :onpropertychange="onpropertychange" :editmode="editmode" :showcontrols="true" :switchmode="oncancel"></cd-form>
    {{ test }}
  </div>
</template>

<script>

import CDForm from '@/components/cd-form.vue'
import CDDocGeneric from '@/generic/cd-doc-generic.vue'
import ComponentInfo from '@/generic/cd-doc-component-info.vue'

export default {
  components: { 'cd-doc': CDDocGeneric, 'cd-info': ComponentInfo, 'cd-form': CDForm },
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
                {
                  descriptor: [
                    {
                      datafield: 'ShortName',
                      text: 'Сокращенное название'
                    }, {
                      datafield: 'UltraShortName',
                      text: 'Краткое название'
                    }
                  ],
                  class: 'row row-cols-2'
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
