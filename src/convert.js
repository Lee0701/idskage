
const fs = require('fs')
const readline = require('readline')

const inFile = process.argv[2]
const outFile = process.argv[3]

fs.writeFileSync(outFile, '')
const rl = readline.createInterface({input: fs.createReadStream(inFile)})

let i = 0
rl.on('line', (line) => {
    if(i++ < 2) return
    const [name, related, data] = line.split('|').map((e) => e.trim())
    fs.appendFileSync(outFile, `${name}\t${data}\n`)
})