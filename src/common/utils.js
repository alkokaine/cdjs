import Vue from 'vue'

function range (start, end, step) {
  return Array.from({ length: (end - start) / step + 1 }, (_, i) => start + i * step)
}

/**
 * функция, удаляющая все свойства объекта object,
 * которые имеют значение undefined
 * @param {Object} object объект, за чистоту которого
 * мы здесь боремся
 * @returns чистый объект
 */
// function compress (object) {
//   for (const property in object) {
//     if (!hasProperty.call(object, property) || object[property] === undefined) {
//       delete object[property]
//     }
//   }
//   return object
// }

/**
 *
 * @param {Object} object объект дескриптора, в котором мы ищем указанное
 * ниже свойство propertyname
 * @param {String} propertyname имя разыскиваемого в object свойства
 * @param {Object} payload объект, от которого зависит результат вычисления свойства
 * object[propertyname]
 * @param {Object} another ещё один объект, от которого зависит результат вычисления свойства
 * object[propertyname]
 * @returns {any} undefined, если свойства propertyname в объекте object не содержится
 * значение свойства object.propertyname (если это свойство) или результат выполнения функции
 * object.propertyname(payload)
 */
function resolvePropertyValue (object, propertyname, payload, another = undefined) {
  if (hasProperty.call(object, propertyname)) {
    if (typeof object[propertyname] === 'function') return object[propertyname](payload, another)
    return object[propertyname]
  }
  return undefined
}
function createRouterLink (property, propertyholder, payload) {
  return resolvePropertyValue(property, 'route', propertyholder)
}
/**
 * функция, возвращающая настройки поля <input>
 * для свойства property с именем property.datafield
 * объекта propertyholder,
 * @param {Object} property дескриптор свойства property.datafield
 * объекта propertyholder
 * @param {Object} propertyholder объект, для свойства property.datafield
 * мы получаем настройки элемента input
 * @param {Object} payload какой-нибудь внешний объект, от которого может
 * зависеть поведение элемента input
 * @returns {Object} настройки элемента <input>
 */
function createInput (property, propertyholder, payload) {
  const parent = this
  return {
    type: (property.input || 'text'),
    pattern: resolvePropertyValue(property, 'pattern', propertyholder),
    name: property.datafield,
    autosize: property.input === 'textarea' ? (resolvePropertyValue(property, 'autosize', propertyholder) || {}) : undefined,
    max: resolvePropertyValue(property, 'max', propertyholder),
    min: resolvePropertyValue(property, 'min', propertyholder),
    displayformat: property.displayformat,
    maxlength: resolvePropertyValue(property, 'maxlength', propertyholder),
    minlength: resolvePropertyValue(property, 'minlength', propertyholder),
    checked: propertyholder[property.datafield] === 1 || propertyholder[property.datafield] === true,
    placeholder: resolvePropertyValue(property, 'placeholder', propertyholder),
    ondebounce (value, event) {
      Vue.set(propertyholder, property.datafield, value)
      parent.onpropertychange(propertyholder, property, value)
    }
  }
}

// function validate (parent, property, propertyholder, newvalue) {
//   const propertyRules = property.rules === undefined
//     ? []
//     : (
//       typeof property.rules === 'function'
//         ? property.rules(propertyholder)
//         : property.rules
//     )
//   const collectErrors = []
//   propertyRules.forEach(function (rule, index) {
//     if (Object.prototype.hasOwnProperty.call(rule, 'validator')) {
//     }
//   }, collectErrors)
//   console.log(collectErrors)
//   return {
//     result: collectErrors.length === 0,
//     errors: collectErrors
//   }
// }

/**
 * функция, возвращающая настройки элемента
 * формы select с опциями, которые достаются по url
 * @param {*} property свойство, для которого мы получаем
 * настройки для элемента формы
 * @param {*} propertyholder объект, свойство property которого
 * мы рассматриваем
 * @param {*} payload какой-то объект, от которого может зависеть
 * функциональность элемента формы select для рассматриваемого
 * свойства property
 * @returns объект, содержащий необходымые для рендеринга
 * элемента формы select
 */
function createSelect (property, propertyholder, payload) {
  const parent = this
  const select = {
    valuekey: property.valuekey, // свойство ключа коллекции опций
    labelkey: property.labelkey, // свойство опции, которое мы видим в дропдауне
    payload: resolvePropertyValue(property, 'resolvepayload', propertyholder), // параметры получения данных,
    values: property.values,
    resolvepayload: property.resolvepayload,
    descriptor: property.slotdescriptor,
    filterable: property.filterable,
    multiple: property.multiple,
    collapsetags: property.collapsetags,
    clearable: property.clearable,
    optionclass: resolvePropertyValue(property, 'optionclass', propertyholder),
    change (values, newvalue) {
      if (newvalue !== '') {
        Vue.set(propertyholder, property.datafield, newvalue)
        if (property.onselect && typeof property.onselect === 'function') {
          property.onselect(propertyholder, values.find(v => v[property.valuekey] === newvalue), parent)
        }
      }
      // // новое значение
      // Vue.set(propertyholder, property.datafield, newvalue)
      // // результат валидации
      // const validateresult = validate(parent, property, propertyholder, newvalue)
      // if (!validateresult.result) {
      //   Vue.set(select, '$validateinfo', validateresult.errors)
      // }
      // if (property.onselect && typeof property.onselect === 'function') {
      //   property.onselect(propertyholder, values.find(v => v[property.valuekey] === newvalue), parent)
      // }
      // if (parent.onpropertychange) parent.onpropertychange(propertyholder, property, option)
    },
    visiblechange (visiblestate) {
      // console.log('visible change')
    },
    removetag (tagkey) {
      // console.log('remove tag')
    },
    clear () {
      Vue.set(propertyholder, property.datafield, null)
      if (property.reset && typeof property.reset === 'function') property.reset(propertyholder, parent)
    },
    blur (focusevent) {
      // console.log('blur')
    },
    focus (focusevent) {
      // console.log('focus')
    },
    disabled: resolvePropertyValue(property, 'disabled', propertyholder),
    remote: property.url !== undefined,
    remotemethod (query) {
      const request = parent.$http[property.method]
      request(property.url, resolvePropertyValue(property, 'resolvepayload', propertyholder)).then((response) => {
        Vue.set(select, 'values', property.resolveresult(response))
      })
    },
    url: property.url,
    method: property.method,
    resolveresult: property.resolveresult, // функция, возвращающая нужные данные
    // для списка опций селекта из ответа сервера
    // определяем, задизаблена ли опция
    isdisabled: (option) => resolvePropertyValue(property, 'isdisabled', propertyholder, option)
    // выполняем onselect
    // onselect: (option) => {
    //   if (property.onselect && typeof property.onselect === 'function') property.onselect(propertyholder, option, parent)
    // }
  }
  return select
}

const hasProperty = Object.prototype.hasOwnProperty

const ispropertyvisible = function (property, payload, propertyowner) {
  if (hasProperty.call(property, 'hidden')) {
    if (typeof property.hidden === 'function') return !property.hidden(propertyowner, payload)
    if (typeof property.hidden === 'boolean') return !property.hidden
    console.warn(`[CDJS:WARNING] для property.hidden ожидается булевское значение, или функция, возвращающая булевское значение. Получено ${typeof property.hidden}`)
    return true
  } if (hasProperty.call(property, 'isvisible')) {
    if (typeof property.isvisible === 'function') return property.isvisible(propertyowner, payload)
    if (typeof property.isvisible === 'boolean') return property.isvisible
    console.warn(`[CDJS:WARNING] для property.isvisible ожидается булевское значение, или функция, возвращающая булевское значение. Получено ${typeof property.isvisible}`, property)
    return true
  }
  return true
}

const ispropertyeditable = function (property, payload, propertyowner) {
  if (hasProperty.call(property, 'canedit')) {
    if (typeof property.canedit === 'function') return property.canedit(propertyowner, payload)
    if (typeof property.canedit === 'boolean') return property.canedit
    console.warn(`[CDJS:WARNING] для property.isvisible ожидается булевское значение, или функция, возвращающая булевское значение. Получено ${typeof property.isvisible}`, property)
    return true
  }
  return true
}

const hasArray = function (property, name) {
  return (hasProperty.call(property, name) && Array.isArray(property[name]))
}

const flatterer = function (arr, accum) {
  return (arr || []).reduce((acc, u) => { // выбираем между arr и пустым
    // массивом и выполняем над ним reduce
    // функцией (acc, u) => {},
    // где acc -- массив-аккумулятор, а u -- текущее свойств
    let res = []
    if (hasArray(u, 'descriptor')) {
      // соединим массив acc с результатом выполнения функции reducer над u.descriptor
      res = acc.concat(flatterer(u.descriptor, []))
    } else {
      acc.push(u)
      res = acc
    }
    return res // вернём что получилось
  }, accum)
}

/**
 * собственно ради чего всё задумывалось
 * функция, возвращающая настройки клетки таблицы или поля на форме
 * по объекту property (дескриптору свойства property.datafield
 * объекта propertyholder)
 * сюда бы хорошо передать компонент, который выполняет эту функцию,
 * завести у него свойство типа хранилища и, при получении данных из API,
 * иметь возможность запихнуть туда полученный датасет, таким образом мы сможем,
 * гхм, регулировать посылаемые к API запросы, забирая из хранилища уже готовые
 * данные
 * впрочем, он может быть и в this
 * @param {Object} property дескриптор свойства property.datafield
 * объекта propertyholder
 * @param {Object} propertyholder объект, свойство property.datafield
 * которого мы хотим показать
 * @param {Object} payload какой-нибудь внешний объект, от значений которого
 * может зависеть настройки, возвращаемые этой фукнцией
 * @returns {Object} настройки ячейки таблицы или поля на форме
 */
const propertyconfig = function (property, propertyholder, isreadonly, payload = {}) {
  const ph = propertyholder
  const p = property
  const parent = this
  return {
    input: createInput.call(parent, p, ph, payload),
    select: p.input === 'select' ? createSelect.call(parent, p, ph, payload) : undefined,
    route: p.route ? createRouterLink.call(parent, p, ph, payload) : undefined,
    clearable: p.clearable,
    datafield: p.datafield,
    class: p.class,
    text: p.text,
    value: ph[p.datafield],
    onchange (event) {
      if (p.input === 'checkbox') {
        p.toogle(ph)
      }
      if (p.input === 'datetime' || p.input === 'date') {
        Vue.set(ph, p.datafield, new Date(event))
      }
      parent.onpropertychange(propertyholder, property, event)
    },
    onblur (event) {
      // console.log(event)
      if (p.onblur && typeof p.onblur === 'function') {
        p.onblur(ph, event)
      }
    },
    oninput (event) {
      if (property.oninput && typeof property.oninput === 'function') {
        property.oninput(propertyholder, event, payload)
      }
    },
    onfocus (event) {
    },
    reset (event) {
      Vue.set(ph, p.datafield, null)
      if (p.reset !== undefined && typeof p.reset === 'function') p.reset(ph, parent)
    }
  }
}
/**
 * функция вычисляет colspan для колонки при определении таблицы
 * @param {Array} properties массив свойств, содержащихся в свойства descriptor
 * объекта property
 * @returns 1, если массив properties пустой или его нет или
 *          сумму посчитанных дескприпторов свойств для каждого из объекта в properties
 */
const countchildren = function (properties) {
  if (properties === undefined || properties === null || // если на вход ничего не пришло
      // или пришёл пустой массив
      (Array.isArray(properties) && !properties.length)) return 1
  // посчитаем количество свойств под группе
  return properties.reduce((acc, cur) => {
    // acc -- сумма
    // cur -- свойство
    let a = 0
    // если у свойства есть массив descriptor,
    if (hasArray(cur, 'descriptor')) {
      // сложим аккумулятор и то, что насчитает count
      a = acc + countchildren(cur.descriptor)
    } else {
      a = acc + 1
    }
    return a
  }, 0)
}
/**
 *
 * @param {Array} properties
 * @param {Object} payload
 * @returns {Array} массив копий объекта
 */
const initspan = function (properties, payload) {
  const arr = properties.filter(property => ispropertyvisible(property, payload, {}))
  arr.forEach(property => {
    const span = hasArray(property, 'descriptor') ? countchildren(property.descriptor) : 1
    Vue.set(property, 'span', span)
  })
  return arr
}

const headerrows = function (descriptor, payload, accum = []) {
  let child = initspan(descriptor, payload)
  do {
    // затолкаем в accum новый объект с cols, который получим сделав child.map
    accum.push({
      cols: child.map((m) => ({
        datafield: m.datafield, // здесь копируем значения свойств
        text: m.text,
        span: m.span,
        headerclass: m.headerclass,
        // а тут сделаем пометку, что у свойства m есть вложенные дескприторы
        haschild: hasArray(m, 'descriptor') && m.descriptor.length > 0
      }))
    })
    // здесь получим массив свойств, которые расположены в { descriptor: [] } объектов в child
    child = initspan(child.reduce((acc, cur) => acc.concat(cur.descriptor || []), []), payload)
  } while (child.length) // если что-то есть -- маппим дальше до тех пор, пока child не окажется пустым
  // accum сейчас может выглядеть как-то так: [[{}, {}, {}], [{},{}], [{}, {},{}]] и
  // представляет собой строки хидера таблицы
  accum.forEach((r, index) => r.cols.forEach((prop) => { // получается, для каждой строки идём по списку колонок
    if (!prop.haschild) { // если у свойства ранее выявили вложенный дескриптор
      Vue.set(prop, 'rowspan', accum.length - index) // то вычислим rowspan для колонки prop как разницу
      // между количеством строк и текущим индексом цикла
    }
  }))
  return accum
}

const extractarguments = function getArgs (func) {
  if (func === undefined || func.length === 0) {
    return []
  }
  const STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg
  const ARGUMENT_NAMES = /([^\s,]+)/g

  const fnStr = func.toString().replace(STRIP_COMMENTS, '')
  var result = fnStr.slice(fnStr.indexOf('(') + 1, fnStr.indexOf(')')).match(ARGUMENT_NAMES)
  if (result === null) result = []
  return result
}
export default {
  resolvePropertyValue,
  range,
  ispropertyeditable,
  ispropertyvisible,
  flatterer,
  propertyconfig,
  countchildren,
  headerrows,
  extractarguments
}
