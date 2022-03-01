import baseProp from './base-property-descriptor'
const select = baseProp.concat([
  {
    datafield: 'labelkey',
    text: 'labelkey'
  },
  {
    datafield: 'valuekey',
    text: 'valuekey'
  },
  {
    datafield: 'url',
    text: 'url'
  },
  {
    datafield: 'method',
    text: 'method',
    input: 'select',
    values: [{ value: 'GET', label: 'GET' }, { value: 'POST', label: 'POST' }]
  },
  {
    datafield: 'url',
    text: 'url'
  },
  {
    datafield: 'resolvepayload',
    text: 'resolvepayload'
  },
  {
    datafield: 'resolveresult',
    text: 'resolveresult'
  }
])

export default select
