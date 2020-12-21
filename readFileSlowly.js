const fs = require('fs')

const copyFile = (source, target) => {
  const readableStream = fs.createReadStream(source)
  const writableStream = fs.createWriteStream(target)

  let i = 0
  readableStream.on('data', (chunk) => {
    i++
    writableStream.write(chunk)
    console.log(`chunk ${i}\tsize ${chunk.length}`)
  })

  readableStream.on('end', () => {
    writableStream.close()
    console.log('File copy done')
  })

  readableStream.on('error', (err) => {
    fs.unlink(target)
    console.error(err)
  })

  console.log('Start copying file')
}

copyFile('ukpostcodes.csv', 'test.txt')
