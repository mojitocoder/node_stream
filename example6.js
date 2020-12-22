const http = require('https')
const fs = require('fs')

const downloadPipe = function (url, saveAsFile, callback) {
  const writer = fs.createWriteStream(saveAsFile)
  const request = http.get(url, (response) => {
    response.pipe(writer)
    writer.on('finish', () => {
      writer.close()
      console.log('Download done')
    })
    console.log('Turn the tap on!')
  }).on('error', (err) => {
    fs.unlink(saveAsFile)
    if (callback) callback(err.message)
  })
}

const downloadFlowing = function (url, saveAsFile) {
  const writer = fs.createWriteStream(saveAsFile)
  const request = http.get(url, (response) => {
    let i = 0

    response.on('data', (chunk) => {
      i++
      writer.write(chunk)
      console.log(`chunk ${i}\tsize ${chunk.length}`)
    }).on('end', () => {
      writer.close()
      console.log('Download done')
    })

    console.log('Turn the tap on!')
  }).on('error', (err) => {
    fs.unlink(saveAsFile)
    console.error(err)
  })
}

const downloadPaused = function (url, saveAsFile) {
  const writer = fs.createWriteStream(saveAsFile)
  const request = http.get(url, (response) => {
    let i = 0
    let chunk = ''
    response.on('readable', () => {
      i++
      while ((chunk = response.read()) !== null) {
        writer.write(chunk)
        console.log(`chunk ${i}\tsize ${chunk.length}`)
      }
    }).on('end', () => {
      writer.close()
      console.log('Download done')
    })

    console.log('Turn the tap on!')
  }).on('error', (err) => {
    fs.unlink(saveAsFile)
    console.error(err)
  })
}

const url = 'https://www.freemaptools.com/download/outcode-postcodes/postcode-outcodes.csv'
const fileName = 'test.txt'

downloadFlowing(url, fileName)
