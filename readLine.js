const fs = require('fs')
const readline = require('readline')

const writer = fs.createWriteStream('postcode.txt')

const rl = readline.createInterface({
  input: fs.createReadStream('postcodes.csv'),
  // output: process.stdout,
  crlfDelay: Infinity
})

rl.on('line', (line) => {
  //e.g. "AB10 1XG, 57.144165160000000, -2.114847768000000"
  const parts = line.split(',')
  const item = {
    postcode: parts[0].replace(' ', ''),
    latitude: parseFloat(parts[1]),
    longitude: parseFloat(parts[2])
  }
  writer.write(`${JSON.stringify(item)}\n`)
})

rl.on('close', () => {
  writer.close()
  console.log('Job done')
})
