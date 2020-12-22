const { Readable } = require('stream')

const readable = new Readable({ objectMode: true, read () {} })
const items = 'The quick brown fox jumps over the lazy dog'.split(' ')
for (const item of items) {
  readable.push(item)
}
readable.push(null)

readable.on('data', (chunk) => {
  console.log('chunk: ', chunk)
})

readable.on('end', () => {
  console.log('The readable stream has been exhausted')
})

readable.on('error', (err) => {
  console.error(err)
})

console.log('Start reading the readable stream')
