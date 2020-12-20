const readline = require('readline')
const debounce = require('debounce')

readline.emitKeypressEvents(process.stdin)

const values = ['lorem ipsum', 'dolor sit amet']

const rl = readline.createInterface(process.stdin)

const showResults = (c, k) => debounce(() => {

  // console.log(`\nkey: `, c)
  console.log(
    '\n',
    values.filter((val) => val.startsWith(c)).join(' ')
  )
}, 300)

process.stdin.on('keypress', (c, k) => {
  showResults(c, k)()
})
