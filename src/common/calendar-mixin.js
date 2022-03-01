export default {
  props: {
    payload: {
      type: Object,
      validator (value) {
        var hasmonth = true
        var hasyear = true
        if (!Object.prototype.hasOwnProperty.call(value, 'MonthID')) {
          hasmonth = false
          console.error('[CDJS]payload object must have \'MonthID\' property')
        }
        if (!Object.prototype.hasOwnProperty.call(value, 'Year')) {
          hasyear = false
          console.error('[CDJS]payload object must have \'Year\' property')
        }
        if (!(hasmonth && hasyear)) return false
        const monthvalue = value.MonthID
        const ismonth = Number.isInteger(monthvalue) && (monthvalue >= 1 && monthvalue <= 12)
        if (!ismonth) console.error('[CDJS]payload.MonthID value must be Number and starting from 1, ending by 12')
        const yearvalue = value.Year
        const isyear = yearvalue !== undefined && yearvalue !== null && Number.isInteger(yearvalue)
        return ismonth && isyear
      }
    }
  }
}
