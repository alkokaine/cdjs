<template>
  <div class="cd-doc-modal">
    <button v-on:click="isvisible = true">Show dialog</button>
    <el-dialog :visible="isvisible" width="75%">
      <cd-form :descriptor="descriptor" :payload="payload" :showcontrols="true"></cd-form>
    </el-dialog>
  </div>
</template>

<script>
import { Dialog } from 'element-ui'
import CDForm from '@/components/cd-form.vue'
export default {
  components: {
    'el-dialog': Dialog,
    'cd-form': CDForm
  },
  data (doc) {
    return {
      isvisible: false,
      payload: {},
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
      ]
    }
  }
}
</script>

<style>

</style>
