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

const ispropertyeditable = function (property, payload) {
  if (hasProperty.call(property, 'canedit')) {
    if (typeof property.canedit === 'function') return property.canedit(payload)
    if (typeof property.canedit === 'boolean') return property.canedit
    console.warn(`[CDJS:WARNING] для property.canedit ожидается булевское значение, или функция, возвращающая булевское значение. Получено ${typeof property.canedit}`, property)
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
  countchildren,
  headerrows,
  extractarguments
}
