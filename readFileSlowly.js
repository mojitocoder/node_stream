const fs = require('fs')
const debounce = require('debounce')

async function logChunks(readStream) {
  for await (const chunk of readStream) {
    // console.log(chunk)
    puts(chunk)()
  }
}

const puts = (val) => debounce(() => {
  console.log(val)
}, 5000)

const readableStream = fs.createReadStream('postcodes.csv', {encoding: 'utf8'})

logChunks(readableStream)
