const { Readable } = require('stream')

const readable = Readable.from('The quick brown fox jumps over the lazy dog')

// const readable = Readable.from('The quick brown fox jumps over the lazy dog'.split(' '))

// async function * generate () {
//   const items = 'The quick brown fox jumps over the lazy dog'.split(' ')
//   for (const item of items) {
//     yield item
//   }
// }
// const readable = Readable.from(generate())

readable.on('data', (chunk) => {
  console.log('chunk: ', chunk)
})

readable.on('end', () => {
  console.log('The readable stream has been exhausted')
})

console.log('Start reading the readable stream')
