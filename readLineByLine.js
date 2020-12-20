const readline = require('readline')

readline.emitKeypressEvents(process.stdin)


process.stdin.on('keypress', (c, k) => {
  if (c.toUpperCase() === 'X') {
    console.log('Goodbye')
    process.exit(0)
  }
})
