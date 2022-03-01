import inputs from '../common/inputtype'

export default [
  {
    datafield: 'input',
    text: 'input',
    input: 'select',
    valuekey: 'key',
    labelkey: 'label',
    values: inputs.map((t, i) => ({ key: i, label: t }))
  }
]
