NodeJS stream by examples
===

NodeJS stream is a powerful concept but it's not widely understood by developers.

I have found myself googling and learning the concept again everytime I need to work with streams in NodeJS. This article is very much to remind my future self.

This article focuses on applying streams with text content and the great `readline` module.

## Why streams?
A few cases where streams really shine:
+ Processing large files that do not fit into computer's memory. Using streams allows you to read the file and process it as the data arrive into your program.
+ All the input is not available just yet. When you write a command line program for users to interact with, input only becomes available over time.
+ Reduce latency and improve user experience. Thanks for streams, your Netflix movies play (almost) immediately. The Netflix app on your PC/TV/browser shows you the content whilst it's still downloading the rest of the movie.

## Further reading
+ This [wonderful introduction](https://nodesource.com/blog/understanding-streams-in-nodejs/) into streams in Node.js
+ Readline module's [official documentation](https://nodejs.org/api/readline.html)
+ [Async iterator](https://2ality.com/2019/11/nodejs-streams-async-iteration.html) in Node.js streams
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



