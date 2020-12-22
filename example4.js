const fs = require('fs')
const readableStream = fs.createReadStream('postcodes.csv', { encoding: 'utf8' })

let i = 0
readableStream.on('data', (chunk) => {
  i++
  console.log(`chunk ${i}: `, chunk)
})

readableStream.on('end', () => {
  console.log('The stream is done')
})

readableStream.on('error', (err) => {
  console.error(err)
})

console.log('The fun has just begun')
