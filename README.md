NodeJS stream by examples
===

NodeJS stream is a powerful concept but it's not widely understood by developers.

I have found myself googling and learning the concept again everytime I need to work with streams in NodeJS. This article is very much to remind my future self.

This article focuses on applying streams with text content and the great `readline` module.

## Why streams?
A few cases where streams really shine:
+ Processing large files that do not fit into computer's memory. Using streams allows you to read a file and process each chunk as the data arrive into your program.
+ All the input is not available just yet. When you write a command line program for users to interact with, input only becomes available over time.
+ Reduce latency and improve user experience. Thanks for streams, your Netflix movies play (almost) immediately. The Netflix app on your PC/TV/browser shows you the content whilst it's still downloading the rest of the movie.
+ Reduce bandwidth. You can show the user the interim download result and terminate it if it's not the right one. It would be a waste of bandwidth to download a whole large file only to find out it's the wrong one.

## Four types of streams

+ `Readable`: from which data can be read, e.g. `fs.createReadStream()`
+ `Writable`: to which data can be written, e.g. `fs.createWriteStream()`
+ `Duplex`: That are both Readable and Writeable, e.g. `net.Socket`
+ `Transform`: That can modify data as they are written or read, e.g. read and write compressed data from/to a file.

## Two reading modes

Readable streams operate in one of two modes: `flowing` and `paused`:
+ In `flowing mode`, data are automatically read from the underlying system and provided to an application as quickly as possible using events via EventEmitter interface (i.e. each chunk is provided via a `data` event).
  + The stream implementor decides how often a data event is emitted, e.g. HTTP request may emit an `data` event once a few KBs of data are read.
  + When there is more data to read (i.e. the end of stream), the stream emits an `end` event.
  + If there is an error, the stream will emit an `error` event.
+ In `paused mode`, the `stream.read()` method must be explicitly called each time to return a chunk of data from the stream.
  + A `readable` event is emitted everytime a chunk of data is ready.
  + A `end` event is emitted when the end of the stream is reached.
  + `stream.read()` returns `null` when the end of the stream is reached.

**Notes:**

+ All `Readable` streams begin in `paused mode` but can be switched on `flowing mode` in one of the following ways:
  + Adding a `data` event handler
  + Calling the `stream.resume()` method
  + Calling the `stream.pipe()` method to send data to a `Writable` stream
+ The `Readable` stream can switch back to `paused` with one of the following:
  + There is no pipe destination, by calling `stream.pause()` method. Removing all pipe destinations with `stream.unpipe` method.
  + Adding a `readable` event handler, which has higher priority than `data` event.
+ A `Readable` will not generate data until a mechanism for either consuming or ignoring data is provided. If that mechanism is taken away or disabled, the `Readable` will **attempt** to stop generating data.

## Node.js components

The examples will show you how to work with:
+ `process.stdin` as a `Readable` stream
+ `process.stdout` as a `Writable` stream
+ `fs.createReadStream()` as a `Readable` stream
+ `fs.createWriteStream()` as a `Writable` stream
+ `readline` module, which provides an interface to work with data from a textual `Readable` stream 
+ `http.response` as a `Readable` stream

## Further reading

+ This [wonderful introduction](https://nodesource.com/blog/understanding-streams-in-nodejs/) into streams in Node.js
+ Readline module's [official documentation](https://nodejs.org/api/readline.html)
+ [Async iterator](https://2ality.com/2019/11/nodejs-streams-async-iteration.html) in Node.js streams
+ Node.js streams' [cheat sheet](https://devhints.io/nodejs-stream)
## Examples

1. Get an input from the user

```javascript
const readline = require('readline')

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

rl.question('What is your name? ', (name) => {
  console.log(`Hello ${name}`)
  rl.close()
})
```

2. A simple CLI to interact with the user

```javascript
const readline = require('readline')
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: 'OHAI> '
})

rl.prompt()

rl.on('line', (line) => {
  switch (line.trim()) {
    case 'hello':
      console.log('world!')
      break
    default:
      console.log(`Say what? I might have heard '${line.trim()}'`)
      break
  }
  rl.prompt()
}).on('close', () => {
  console.log('Have a great day!')
  process.exit(0)
})
```

3. Read a csv file line by line from `postcodes.csv`, convert each line to an JSON object and write it down to `postcodes.txt`:

```javascript
const fs = require('fs')
const readline = require('readline')

const writer = fs.createWriteStream('postcode.txt')

const rl = readline.createInterface({
  input: fs.createReadStream('postcodes.csv'),
  output: process.stdout,
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
```

If you don't want the content of the input file to be shown on the console, remove the `output` parameter of `readline.createInterface` method call, i.e. comment out `output: process.stdout,`.

4. Read a file using `flowing mode`, i.e. by attaching a `data` event handler

```javascript
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
```

Notice in this program, the events (`data` and `end`) are emitted **after** last line, i.e. `console.log('The fun has just begun')` has been executed.

5. Read a stream in `paused mode` using `readble` event and `stream.read()` method
```javascript
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
```

6. Utility to download a file. `http.response` is a `Readable stream` and can be read using 3 ways:
   + `response.pipe()` method
   + Using `flowing mode` with `data` event
   + Using `paused mode` with `readable` event and `response.read()` method
```javascript
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
```

Using either `flowing mode` or `paused mode`, you can see the size of each data chunk (except the last one) to be `16384 Bytes` = `16KB`.

7. Utility to copy a file
```javascript
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
```
Notice the size of each chunk is `65536 Bytes` = `64KB`.

8. `Readable.from()` method can create a `readable` stream from a string or a iterator (both synchronous and asynchronous).

   From a string, no buffer is provided. So the whole string will be return in one chunk in a `data` event:
```javascript
const { Readable } = require('stream')

const readable = Readable.from('The quick brown fox jumps over the lazy dog')

readable.on('data', (chunk) => {
  console.log('chunk: ', chunk)
})

readable.on('end', () => {
  console.log('The readable stream has been exhausted')
})

console.log('Start reading the readable stream')
```
   From a synchronous iterator:
```javascript
const { Readable } = require('stream')

const readable = Readable.from('The quick brown fox jumps over the lazy dog'.split(' '))
```
   From an asynchronous iterator, e.g. by using an async generator function
```javascript
const { Readable } = require('stream')

async function * generate () {
  const items = 'The quick brown fox jumps over the lazy dog'.split(' ')
  for (const item of items) {
    yield item
  }
}

const readable = Readable.from(generate())
```

9. The `Readable` object constructor can be used to create a new `readable` stream. Notice the `readable.push(null)` is to signal the end of the stream.
```javascript
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
```