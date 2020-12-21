const fs = require('fs')
const { Readable } = require('stream')

function * generate () {
  const items = 'The quick brown fox jumps over the lazy dog'.split(' ')
  for (const item of items) {
    yield item
  }
}

// const readable = Readable.from('The quick brown fox jumps over the lazy dog')

// const readable = Readable.from(generate())

// const readable = fs.createReadStream('USZipcode2018.txt', { encoding: 'utf8' })

// const content = fs.readFileSync('USZipcode2018.txt', { encoding: 'utf8' })
// console.log(content)
// const readable = Readable.from(content)

// const readable = Readable.from('The quick brown fox jumps over the lazy dog'.split(' '))
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
