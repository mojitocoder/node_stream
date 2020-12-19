const fs = require('fs')
const debounce = require('debounce')

const readStream = fs.createReadStream('ukpostcodes.csv', { encoding: 'utf8' })

let i = 0
readStream.on('data', (chunk) => {
  i++
  console.log(`chunk ${i}`)
})

readStream.on('end', () => {
  console.log('This is the end!');
})

readStream.on('error', (err) => {
  console.error(err)
})
