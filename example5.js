const fs = require('fs')
const readableStream = fs.createReadStream('postcodes.csv', { encoding: 'utf8' })

let i = 0
let chunk = ''
readableStream.on('readable', () => {
  i++
  while ((chunk = readableStream.read()) !== null) {
    console.log(`chunk ${i}: `, chunk)
  }
})

readableStream.on('end', () => {
  console.log('The stream is done')
})

console.log('The fun has just begun')
