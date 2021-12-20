import Vue from 'vue'
import inputtype from './inputtype' // а здесь его будем использовать

/**
 * функция, удаляющая все свойства объекта object,
 * которые имеют значение undefined
 * @param {Object} object объект, за чистоту которого
 * мы здесь боремся
 * @returns чистый объект
 */
function compress (object) {
  for (const property in object) {
    if (!hasProperty.call(object, property) || object[property] === undefined) {
      delete object[property]
    }
  }
  return object
}

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
  // если дескриптор property содержит свойство input и его значение
  // не содержится в массиве inputtype
  // предупредим в консоли
  if (hasProperty.call(property, 'input') && !inputtype.includes(property.input)) {
    console.warn(`[CDJS] Получено значение ${property.input}, ожидалось одно из ${inputtype}`)
  }
  const parent = this
  return compress({
    type: (property.input || 'text'),
    pattern: resolvePropertyValue(property, 'pattern', propertyholder),
    name: property.datafield,
    max: resolvePropertyValue(property, 'max', propertyholder),
    min: resolvePropertyValue(property, 'min', propertyholder),
    maxlength: resolvePropertyValue(property, 'maxlength', propertyholder),
    minlength: resolvePropertyValue(property, 'minlength', propertyholder),
    checked: resolvePropertyValue(property, 'checked', propertyholder),
    placeholder: resolvePropertyValue(property, 'placeholder', propertyholder),
    ondebounce (value, event) { parent.onpropertychange({ property, value }) }
  })
}

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
  const select = compress({
    valuekey: property.valuekey, // свойство ключа коллекции опций
    labelkey: property.labelkey, // свойство опции, которое мы видим в дропдауне
    payload: resolvePropertyValue(property, 'resolvepayload', propertyholder), // параметры получения данных,
    values: property.values,
    clearable: property.clearable,
    crud: {
      get: {
        url: property.url,
        method: property.method
      }
    },
    resolveresult: property.resolveresult, // функция, возвращающая нужные данные
    // для списка опций селекта из ответа сервера
    // определяем, задизаблена ли опция
    isdisabled: (option) => resolvePropertyValue(property, 'isdisabled', propertyholder, option),
    // выполняем onselect
    onselect: (option) => {
      parent.onpropertychange({ property, value: option })
      // Vue.set(propertyholder, property.datafield, option[property.valuekey])
      if (property.onselect && typeof property.onselect === 'function') property.onselect(propertyholder, option, parent)
    }
  })
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
  return {
    input: createInput.call(this, p, ph, payload),
    select: p.input === 'select' ? createSelect.call(this, p, ph, payload) : undefined,
    route: p.route ? createRouterLink.call(this, p, ph, payload) : undefined,
    clearable: p.clearable,
    datafield: p.datafield,
    text: p.text,
    value: resolvePropertyValue(p, 'format', ph) || ph[p.datafield],
    onchange (event) {

    },
    onblur (event) {

    },
    oninput (event) {

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
  ispropertyeditable,
  ispropertyvisible,
  flatterer,
  propertyconfig,
  countchildren,
  headerrows,
  extractarguments
}
